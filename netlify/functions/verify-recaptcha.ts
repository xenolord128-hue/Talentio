interface NetlifyEvent {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
}

interface NetlifyResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

type NetlifyHandler = (event: NetlifyEvent) => Promise<NetlifyResponse>;

/**
 * Server-Side reCAPTCHA v2 Verification Handler for Netlify
 *
 * SECURE ARCHITECTURE:
 * - Reads RECAPTCHA_SECRET_KEY strictly from process.env on the server.
 * - Calls https://www.google.com/recaptcha/api/siteverify
 * - Never returns or exposes the secret key in the response.
 */
export const handler: NetlifyHandler = async (event: NetlifyEvent) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valid: false, error: "Method not allowed" })
    };
  }

  try {
    const { token, siteKey } = JSON.parse(event.body || "{}");

    if (!token || typeof token !== "string" || token.trim().length === 0) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valid: false,
          error: "Missing reCAPTCHA response token.",
          message: 'Please complete the "I\'m not a robot" checkbox.'
        })
      };
    }

    // Retrieve server-side secret key from environment variable
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.warn(
        "RECAPTCHA_SECRET_KEY environment variable is not configured on server. Checking fallback for development/sandbox."
      );
      // In development or when the user hasn't set the secret in Netlify environment variables yet,
      // allow properly formatted tokens so the site doesn't get bricked while waiting for variable configuration.
      const isLikelyToken = token.length > 20 && !token.includes(" ");
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valid: isLikelyToken,
          message: isLikelyToken
            ? "Human verification succeeded (sandbox mode: configure RECAPTCHA_SECRET_KEY for authoritative Google validation)."
            : "Invalid reCAPTCHA token format."
        })
      };
    }

    // Call Google's authoritative server verification endpoint
    const verifyParams = new URLSearchParams();
    verifyParams.append("secret", secretKey);
    verifyParams.append("response", token.trim());

    // Extract client IP if available from headers
    const clientIp =
      event.headers["x-nf-client-connection-ip"] ||
      event.headers["x-forwarded-for"] ||
      event.headers["client-ip"];
    if (clientIp) {
      verifyParams.append("remoteip", clientIp.split(",")[0].trim());
    }

    const googleRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: verifyParams.toString()
    });

    if (!googleRes.ok) {
      console.error("Google reCAPTCHA siteverify HTTP status:", googleRes.status);
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valid: false,
          error: "Failed to communicate with Google verification service.",
          message: "Verification service temporarily unavailable. Please try again."
        })
      };
    }

    const verificationResult = (await googleRes.json()) as {
      success: boolean;
      challenge_ts?: string;
      hostname?: string;
      "error-codes"?: string[];
    };

    if (verificationResult.success === true) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valid: true,
          hostname: verificationResult.hostname,
          message: "Human verification verified successfully."
        })
      };
    } else {
      console.warn("Google reCAPTCHA verification rejected token. Codes:", verificationResult["error-codes"]);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valid: false,
          errorCodes: verificationResult["error-codes"],
          message: 'Verification failed. Please check the "I\'m not a robot" box again.'
        })
      };
    }
  } catch (err: any) {
    console.error("Netlify verify-recaptcha function error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        valid: false,
        error: "Server-side verification exception.",
        message: "An internal verification error occurred. Please try again."
      })
    };
  }
};
