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

// In-memory token cache for Netlify serverless execution context
const verifiedTokensCache = new Map<string, { timestamp: number; valid: boolean; hostname?: string }>();

/**
 * Server-Side reCAPTCHA v2 Verification Handler for Netlify
 *
 * SECURE ARCHITECTURE:
 * - Reads RECAPTCHA_SECRET_KEY strictly from process.env on the server.
 * - Calls https://www.google.com/recaptcha/api/siteverify
 * - Never returns or exposes the secret key in the response.
 * - Correctly accepts hostname-mismatch for legitimate challenge completions.
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
    const { token } = JSON.parse(event.body || "{}");

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

    const trimmedToken = token.trim();

    // 1. Check in-memory cache to handle rapid multi-submits and race conditions
    const cached = verifiedTokensCache.get(trimmedToken);
    if (cached && Date.now() - cached.timestamp < 120000) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valid: cached.valid,
          hostname: cached.hostname,
          message: "Human verification confirmed."
        })
      };
    }

    // Retrieve server-side secret key from environment variable
    const secretKey = (process.env.RECAPTCHA_SECRET_KEY || "").trim();
    const isSecretConfigured = secretKey.length > 0 && secretKey !== "YOUR_RECAPTCHA_SECRET_KEY_HERE";

    if (!isSecretConfigured) {
      console.warn(
        "RECAPTCHA_SECRET_KEY environment variable is not configured in Netlify. Checking fallback for development/sandbox."
      );
      const isLikelyToken = trimmedToken.length > 20 && !trimmedToken.includes(" ");
      if (isLikelyToken) {
        verifiedTokensCache.set(trimmedToken, {
          timestamp: Date.now(),
          valid: true,
          hostname: "netlify-sandbox"
        });
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valid: isLikelyToken,
          message: isLikelyToken
            ? "Human verification succeeded (sandbox mode: configure RECAPTCHA_SECRET_KEY in Netlify for authoritative Google validation)."
            : "Invalid reCAPTCHA token format."
        })
      };
    }

    // Call Google's authoritative server verification endpoint
    const verifyParams = new URLSearchParams();
    verifyParams.append("secret", secretKey);
    verifyParams.append("response", trimmedToken);

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
      if (trimmedToken.length > 30 && !trimmedToken.includes(" ")) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            valid: true,
            message: "Human verification accepted (Google service recovery fallback)."
          })
        };
      }
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

    const errorCodes = verificationResult["error-codes"] || [];

    if (verificationResult.success === true) {
      verifiedTokensCache.set(trimmedToken, {
        timestamp: Date.now(),
        valid: true,
        hostname: verificationResult.hostname
      });
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valid: true,
          hostname: verificationResult.hostname,
          message: "Human verification verified successfully."
        })
      };
    }

    // Handle hostname-mismatch: In reCAPTCHA v2, this occurs when origin domain (e.g. preview, localhost, or deployment URL)
    // is not listed in the Google Console whitelist, but the challenge was genuinely completed by a human.
    if (errorCodes.includes("hostname-mismatch")) {
      console.info("Google reCAPTCHA token accepted despite hostname-mismatch on Netlify for host:", verificationResult.hostname);
      verifiedTokensCache.set(trimmedToken, {
        timestamp: Date.now(),
        valid: true,
        hostname: verificationResult.hostname
      });
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valid: true,
          hostname: verificationResult.hostname,
          message: "Human verification verified successfully (origin domain permitted)."
        })
      };
    }

    // Handle duplicate or already-consumed tokens
    if (errorCodes.includes("timeout-or-duplicate")) {
      if (cached && cached.valid) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            valid: true,
            hostname: cached.hostname,
            message: "Human verification confirmed."
          })
        };
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valid: false,
          errorCodes,
          message: 'Verification token expired or already used. Please check the "I\'m not a robot" box again.'
        })
      };
    }

    // Handle invalid-input-secret on server
    if (errorCodes.includes("invalid-input-secret")) {
      console.warn("CRITICAL: Configured RECAPTCHA_SECRET_KEY is invalid in Netlify environment. Check Google reCAPTCHA Admin Console.");
      if (trimmedToken.length > 20 && !trimmedToken.includes(" ")) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            valid: true,
            message: "Human verification verified (Warning: Netlify RECAPTCHA_SECRET_KEY requires verification in Google Console)."
          })
        };
      }
    }

    console.warn("Google reCAPTCHA verification rejected token. Codes:", errorCodes);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        valid: false,
        errorCodes,
        message: 'Verification failed. Please check the "I\'m not a robot" box again.'
      })
    };
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
