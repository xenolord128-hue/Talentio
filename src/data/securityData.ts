import { SecurityThreat } from '../types';

export const SECURITY_THREATS: SecurityThreat[] = [
  {
    id: 'threat_qr_code',
    title: 'Fake "QR Code Verification" Scam in Inbox',
    titleBn: 'Fake "QR Code Verification" Scam in Inbox',
    category: 'phishing',
    severity: 'critical',
    threatDescription: 'Scammers pose as buyers or "Talentio Security Bot" and send an image containing a QR code, claiming you must scan it to receive the client payment.',
    threatDescriptionBn: 'Scammers pose as buyers or security bots and send a QR code claiming you must scan it to receive payments.',
    realExample: '"Hello seller, I made an order for $350 but your account is restricted. Please scan this official QR code with your banking app to unlock the funds."',
    realExampleBn: '"Hello seller, I purchased your gig. Please scan this QR code to verify your payment card."',
    warningSigns: [
      'An image attachment containing a QR code or external link.',
      'Claims that you must enter credit card numbers or account balances to "receive" money.',
      'Mentions of urgency like "You have 10 minutes or your account will be deleted".',
      'Sent from an ordinary buyer account with 0 reviews created today.'
    ],
    warningSignsBn: [
      'An image attachment containing a QR code or external link.',
      'Demands to enter your bank PIN or card balance to receive funds.',
      'Threats that your account will be deleted if you do not scan.',
      'Messages from brand-new unverified accounts with 0 reviews.'
    ],
    correctAction: [
      'DO NOT scan the QR code with any camera or banking app.',
      'Click the 3 dots at top-right of the chat window.',
      'Click "Report Message" -> "Phishing / Malicious link".',
      'Click "Block User" immediately.'
    ],
    correctActionBn: [
      'Never scan any QR code or external links sent in chat.',
      'Click the 3 dots in chat and select "Report Message".',
      'Select "Phishing / Scam" as the report reason.',
      'Block the suspicious user account immediately.'
    ],
    officialRule: 'Official Talentio Rule: Talentio NEVER sends QR codes to receive payments. When a buyer pays, the milestone escrow activates automatically with a verified badge inside your Workstation.'
  },
  {
    id: 'threat_off_platform',
    title: 'Taking Communication or Payment Outside Talentio (WhatsApp / Telegram)',
    titleBn: 'Taking Communication or Payment Outside Talentio (WhatsApp / Telegram)',
    category: 'client_scam',
    severity: 'critical',
    threatDescription: 'A prospective client asks to move the conversation to Telegram, WhatsApp, Discord, or Personal Email to "avoid fees" or pay via unverified crypto/PayPal.',
    threatDescriptionBn: 'A prospective client asks to move the conversation to Telegram, WhatsApp, Discord, or Personal Email.',
    realExample: '"I have a large $2,000 project. Message my manager on Telegram @MarketingManager or WhatsApp +1-234-567 for immediate contract."',
    realExampleBn: '"I have a large project. Contact me directly on Telegram to skip platform fees."',
    warningSigns: [
      'Client shares phone numbers, email addresses, or handles masked with spaces (e.g. "w h a t s a p p").',
      'Promise of huge upfront payments outside the escrow system.',
      'Asks you to pay an "application fee" or "security deposit" to get the job.'
    ],
    warningSignsBn: [
      'Client masks contact details (e.g. w.h.a.t.s.a.p.p).',
      'Unrealistic budget promises outside escrow protection.',
      'Demands for registration or deposit fees before starting.'
    ],
    correctAction: [
      'Politely refuse in the chat: "I only work and communicate exclusively through Talentio as per Terms of Service."',
      'Never send your email, phone, or Telegram handle.',
      'If the user persists, report them for TOS violation.'
    ],
    correctActionBn: [
      'State clearly in chat: "I only communicate and work through Talentio Escrow."',
      'Never share personal contact info or payment details.',
      'Report and block persistent offenders immediately.'
    ],
    officialRule: 'TOS Zero Tolerance: Exchanging off-platform contact information or unmonitored payments forfeits escrow dispute protection and may lead to account suspension.'
  },
  {
    id: 'threat_malicious_files',
    title: 'Dangerous Attachments & Fake Project ZIPs (.exe / .scr / .bat)',
    titleBn: 'Dangerous Attachments & Fake Project ZIPs (.exe / .scr / .bat)',
    category: 'malware',
    severity: 'high',
    threatDescription: 'Client sends an archive file claiming it contains "project briefs and design assets", but it contains executable spyware or cookie stealers.',
    threatDescriptionBn: 'Client sends an archive file claiming it contains project briefs, but it contains executable files.',
    realExample: '"Please download this Project_Brief.zip. Extract it and run the viewer to see my requirements."',
    realExampleBn: '"Please download this Project_Specs.zip and extract it to see the requirements."',
    warningSigns: [
      'File has extensions like .exe, .scr, .bat, .vbs, or password-protected ZIP that antivirus cannot scan.',
      'The client insists you must open a specific executable program.',
      'The file is hosted on shady third-party file sharing links rather than direct Talentio attachment.'
    ],
    warningSignsBn: [
      'File has extensions like .exe, .bat, .scr, or password-protected archives.',
      'Insistence on running external executable files.',
      'Links directing to unfamiliar third-party download pages.'
    ],
    correctAction: [
      'Do NOT run .exe or executable programs.',
      'Ask the client to send standard formats: PDF, PNG, JPG, DOCX, or Figma/Google Drive preview links.',
      'Scan any downloaded archive on VirusTotal.com before extracting.'
    ],
    correctActionBn: [
      'Do not run .exe or unknown script files.',
      'Ask for standard formats like PDF, PNG, JPG, DOCX, or Figma links.',
      'Scan any downloaded file on VirusTotal before opening.'
    ],
    officialRule: 'Safe Freelancer Protocol: Legitimate clients always provide documents in standard image, vector, video, or document formats (PDF/DOCX/Figma).'
  },
  {
    id: 'threat_free_work_extortion',
    title: 'Demanding Free Custom Work Before Placing an Order',
    titleBn: 'Demanding Free Custom Work Before Placing an Order',
    category: 'client_scam',
    severity: 'medium',
    threatDescription: 'Buyer asks for a "free custom sample" tailored to their exact project before they decide to buy, stealing your finished work without paying.',
    threatDescriptionBn: 'Buyer asks for a free custom sample tailored to their project without placing an order.',
    realExample: '"Create 2 logos with my company name \'Apex Tech\' so I can test your skills. If I like it, I will order a $500 package."',
    realExampleBn: '"Create 2 logos with my brand name to test your skills before I place an order."',
    warningSigns: [
      'Wants bespoke new work for their actual commercial brand for $0.',
      'Refuses to judge your skills from your existing live portfolio samples.'
    ],
    warningSignsBn: [
      'Requests tailored commercial assets with zero escrow deposit.',
      'Refuses to review existing portfolio items.'
    ],
    correctAction: [
      'Share your existing portfolio links and past client case studies.',
      'Offer a small paid Basic package order ($10-$20) as an official paid test run.',
      'Never send high-resolution unwatermarked final source files prior to a funded active order.'
    ],
    correctActionBn: [
      'Provide your existing portfolio and live demonstration links.',
      'Send a custom offer for a paid test milestone.',
      'Never deliver final high-resolution files without escrow funding.'
    ],
    officialRule: 'Talentio Escrow Guarantee: Talentio Buyer and Seller Protection ONLY cover work done inside an officially funded, active milestone order.'
  }
];
