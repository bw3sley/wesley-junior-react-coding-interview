import { faker } from "@faker-js/faker";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { SupportCase, CaseCategory, CustomerTier } from "../types/supportCase";
import { agents } from "./agents";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "db.json");

const CASE_COUNT = 500;

if (fs.existsSync(DB_PATH)) {
  process.exit(0);
}

const CUSTOMER_TIERS: CustomerTier[] = ["free", "standard", "premium"];

const STATUSES = ["open", "in-progress", "closed"] as const;

const PRIORITIES = ["low", "medium", "high", "critical"] as const;

const CATEGORIES: CaseCategory[] = ["billing", "technical", "account"];

const subjectGenerators: Record<CaseCategory, (() => string)[]> = {
  billing: [
    () =>
      `Failed payment troubleshooting for my ${faker.commerce.productName()} purchase`,
    () => `Mischarged for order #${faker.string.alphanumeric({ length: 8, casing: "upper" })}`,
    () =>
      `Duplicate charge on ${faker.commerce.productName()} subscription`,
    () => `Invoice #${faker.string.alphanumeric({ length: 6, casing: "upper" })} shows incorrect amount`,
    () => `Refund not received for order #${faker.string.alphanumeric({ length: 8, casing: "upper" })}`,
    () =>
      `Unable to update billing method — ${faker.system.fileType()} not accepted`,
    () => `Promo code ${faker.string.alphanumeric({ length: 6, casing: "upper" })} not applied at checkout`,
    () => `Tax charged incorrectly on ${faker.commerce.productName()}`,
    () =>
      `Subscription downgrade to ${faker.helpers.arrayElement(["monthly", "annual"])} plan failed`,
    () =>
      `Pending charge stuck for ${faker.number.int({ min: 1, max: 14 })} days`,
  ],
  technical: [
    () =>
      `${faker.helpers.arrayElement(["API", "SSO", "SMTP", "CSV", "DNS"])} integration returning ${faker.internet.httpStatusCode()} errors`,
    () =>
      `Data import fails for files larger than ${faker.number.int({ min: 50, max: 500 })}MB`,
    () => `Webhook delivery delays during ${faker.helpers.arrayElement(["peak hours", "batch processing", "scheduled exports", "nightly sync"])}`,
    () =>
      `${faker.helpers.arrayElement(["Dashboard", "Reports", "Widgets", "Charts"])} not loading after ${faker.helpers.arrayElement(["browser update", "latest deploy", "cache clear", "SSO re-auth"])}`,
    () =>
      `${faker.helpers.arrayElement(["Mobile", "Desktop", "iOS", "Android"])} app crashes when ${faker.helpers.arrayElement(["uploading files", "syncing data", "opening attachments", "switching accounts"])}`,
    () =>
      `Rate limiting triggered at ${faker.number.int({ min: 50, max: 500 })} req/min on ${faker.helpers.arrayElement(["pro", "enterprise"])} plan`,
    () =>
      `Two-factor authentication codes not being sent via ${faker.helpers.arrayElement(["SMS", "email", "authenticator app"])}`,
    () =>
      `Performance degradation in ${faker.helpers.arrayElement(["search", "filtering", "export", "bulk operations"])} with ${faker.number.int({ min: 1000, max: 50000 })} records`,
    () =>
      `${faker.string.alphanumeric({ length: 10, casing: "mixed" })}.${faker.system.fileExt()} file type blocked on upload`,
    () =>
      `Session timeout after ${faker.number.int({ min: 1, max: 15 })} minutes of inactivity`,
  ],
  account: [
    () =>
      `Unable to update ${faker.helpers.arrayElement(["email", "password", "display name", "phone number"])} in account settings`,
    () =>
      `Data export request for ${faker.helpers.arrayElement(["GDPR", "CCPA", "internal audit", "compliance review"])} compliance`,
    () =>
      `${faker.helpers.arrayElement(["Admin", "Read-only", "Billing", "Custom"])} role permissions not applying for ${faker.person.jobTitle()}`,
    () =>
      `Unable to ${faker.helpers.arrayElement(["invite", "remove", "transfer"])} team member ${faker.person.fullName()}`,
    () =>
      `Account locked after ${faker.number.int({ min: 1, max: 5 })} failed login attempts`,
    () =>
      `SSO login failing for users from ${faker.helpers.arrayElement(["Azure AD", "Okta", "Google Workspace", "OneLogin"])}`,
    () =>
      `Password reset email not arriving for ${faker.internet.email().toLowerCase()}`,
    () =>
      `${faker.commerce.productName()} license key not activating on new device`,
    () =>
      `Account merge request for duplicate profiles — ${faker.person.fullName()}`,
    () =>
      `${faker.helpers.arrayElement(["Profile", "Billing", "Notification", "Privacy"])} preferences not saving`,
  ],
};

const descriptionGenerators: Record<CaseCategory, (() => string)[]> = {
  billing: [
    () =>
      `Customer reports a charge of $${faker.finance.amount({ min: 10, max: 500 })} on their ${faker.helpers.arrayElement(["credit card", "bank account", "PayPal"])} that they do not recognise. The transaction ID is ${faker.string.alphanumeric({ length: 12, casing: "upper" })}. They have contacted their bank who advised reaching out to us. No previous issues with similar charges.`,
    () =>
      `Customer is requesting a refund for order #${faker.string.alphanumeric({ length: 8, casing: "upper" })} placed on ${faker.date.recent({ days: 14 }).toLocaleDateString()}. They say the item arrived damaged and photos have been attached to the original support request. The order value is $${faker.finance.amount({ min: 20, max: 300 })}. Refund policy should cover this case.`,
    () =>
      `Invoice #${faker.number.int({ min: 10000, max: 99999 })} shows a total of $${faker.finance.amount({ min: 50, max: 1000 })} but the customer expected $${faker.finance.amount({ min: 30, max: 200 })} based on their plan. They have attached the quote they received via email. The discrepancy seems to be related to a ${faker.helpers.arrayElement(["promotional discount", "early adopter rate", "annual billing credit"])} that was not applied.`,
    () =>
      `Customer's subscription was charged $${faker.finance.amount({ min: 10, max: 100 })} on ${faker.date.recent({ days: 7 }).toLocaleDateString()} even though they downgraded to the free plan ${faker.number.int({ min: 10, max: 60 })} days ago. They have screenshots showing the downgrade confirmation. The charge needs to be reversed and the billing cycle corrected.`,
    () =>
      `A promo code ${faker.string.alphanumeric({ length: 8, casing: "upper" })} was shared with the customer by a support agent last week but it shows as invalid at checkout. The customer has tried applying it to ${faker.helpers.arrayElement(["the monthly plan", "the annual plan", "an add-on purchase"])}. The code was meant to give ${faker.number.int({ min: 10, max: 50 })}% off.`,
    () =>
      `Customer was charged $${faker.finance.amount({ min: 5, max: 50 })} for a ${faker.helpers.arrayElement(["e-book", "template pack", "premium add-on"])} they purchased, but ${faker.number.int({ min: 2, max: 5 })} additional small fees of $${faker.finance.amount({ min: 1, max: 10 })} each appear on their statement. They believe these fees were not disclosed at checkout and want an itemised breakdown.`,
  ],
  technical: [
    () =>
      `Customer reports that the ${faker.helpers.arrayElement(["API", "dashboard", "mobile app"])} returns a ${faker.internet.httpStatusCode()} error when attempting to ${faker.helpers.arrayElement(["sync data", "upload a file", "run a report", "authenticate a user"])}. The issue started after the latest ${faker.helpers.arrayElement(["deploy", "browser update", "OS update"])}. They have cleared cache, tried a different browser, and restarted their device — no change.`,
    () =>
      `A data import containing ${faker.number.int({ min: 500, max: 10000 })} records is failing partway through with no clear error message. The CSV file has been validated against the required schema. Smaller imports (under ${faker.number.int({ min: 100, max: 400 })} records) succeed without issues. The customer needs this completed by ${faker.date.soon({ days: 3 }).toLocaleDateString()}.`,
    () =>
      `Webhooks configured to POST to ${faker.internet.url()} are experiencing intermittent delays of ${faker.number.int({ min: 5, max: 60 })} minutes during ${faker.helpers.arrayElement(["business hours", "peak load times", "overnight batch processing"])}. The webhook logs show successful delivery but with timestamps that are significantly delayed. This is affecting the customer's real-time ${faker.helpers.arrayElement(["inventory sync", "order processing pipeline", "notification system"])}.`,
    () =>
      `Customer reports that the ${faker.helpers.arrayElement(["Dashboard", "Reports page", "Analytics view"])} shows a blank screen after the ${faker.date.recent({ days: 5 }).toLocaleDateString()} platform update. The browser console shows a JavaScript error related to ${faker.helpers.arrayElement(["chart rendering", "data fetching", "component hydration"])}. The issue affects ${faker.helpers.arrayElement(["Chrome 131", "Firefox 133", "Safari 18"])} but works fine on other browsers.`,
    () =>
      `Two-factor authentication codes sent via ${faker.helpers.arrayElement(["SMS", "email"])} are arriving ${faker.number.int({ min: 5, max: 30 })} minutes late, making them expire before use. The customer has tried resending codes multiple times and verified their ${faker.helpers.arrayElement(["phone number", "email address"])} is correct. This has locked them out of their account for ${faker.number.int({ min: 2, max: 48 })} hours.`,
    () =>
      `A ${faker.helpers.arrayElement(["video file", "large PDF", "high-res image"])} of ${faker.number.int({ min: 10, max: 200 })}MB fails to upload with error "File type not supported". The supported formats list shows ${faker.system.fileExt()} files should be accepted. The customer has tried compressing the file and renaming the extension. The file was created with ${faker.helpers.arrayElement(["Adobe software", "a mobile app", "an open-source tool"])}.`,
  ],
  account: [
    () =>
      `Customer is unable to change their email address from ${faker.internet.email().toLowerCase()} to a new address. The settings page shows the email field as greyed out with no edit option. They need to update it because their ${faker.helpers.arrayElement(["company was acquired", "email provider is shutting down", "domain was changed"])}. They have verified ownership of the new address via support chat.`,
    () =>
      `A ${faker.helpers.arrayElement(["GDPR", "CCPA"])} data export request was submitted ${faker.date.recent({ days: 10 }).toLocaleDateString()} but no download link has been received. The customer needs all personal data, transaction history, and communication logs. They have a ${faker.helpers.arrayElement(["legal", "compliance", "audit"])} deadline of ${faker.date.soon({ days: 14 }).toLocaleDateString()}. The automated export tool shows the request as "processing".`,
    () =>
      `Customer reports that team member ${faker.person.fullName()} was assigned ${faker.helpers.arrayElement(["Admin", "Billing", "Read-only"])} role permissions but cannot access the ${faker.helpers.arrayElement(["billing section", "user management page", "reports dashboard"])}. The role configuration shows the correct permissions are enabled. Removing and re-adding the user did not resolve the issue.`,
    () =>
      `Customer is unable to remove a team member from their organisation. The ${faker.helpers.arrayElement(["Admin", "Owner"])} account holder goes to Settings > Team, clicks "Remove" next to ${faker.person.fullName()}, but the page refreshes with no change. This user left the company ${faker.number.int({ min: 5, max: 30 })} days ago and still has access to ${faker.helpers.arrayElement(["sensitive data", "customer records", "financial information"])}.`,
    () =>
      `Account was locked after ${faker.number.int({ min: 2, max: 6 })} consecutive failed login attempts. The customer confirms they know their password but the lockout occurred after their ${faker.helpers.arrayElement(["password manager auto-filled old credentials", "caps lock was on", "a script was testing credentials"])}. They have waited the standard lockout period but the account remains locked. They need access restored urgently.`,
    () =>
      `Password reset emails sent to ${faker.internet.email().toLowerCase()} are not arriving. The customer has checked spam and junk folders, added us to their safe senders list, and tried resetting from multiple devices. The previous password expired ${faker.number.int({ min: 1, max: 7 })} days ago. They use ${faker.helpers.arrayElement(["Gmail", "Outlook", "ProtonMail", "a corporate exchange server"])} as their email provider.`,
  ],
};

function generateId(index: number): string {
  return `TKT-${String(index + 1).padStart(5, "0")}`;
}

const cases: SupportCase[] = Array.from({ length: CASE_COUNT }, (_, i) => {
  const category = faker.helpers.arrayElement(CATEGORIES);
  const subjectGen = faker.helpers.arrayElement(subjectGenerators[category]);
  const descGen = faker.helpers.arrayElement(descriptionGenerators[category]);

  const createdAt = faker.date.recent({ days: 30 });
  const updatedAt = faker.date
    .between({ from: createdAt, to: new Date() });

  const status = faker.helpers.arrayElement(STATUSES);

  const agentId = status === "open"
    ? null
    : faker.helpers.arrayElement(
        agents.filter((a) => a.specialty === category).map((a) => a.id),
      );

  return {
    id: generateId(i),
    customer: faker.person.fullName(),
    customerEmail: faker.internet.email().toLowerCase(),
    customerTier: faker.helpers.arrayElement(CUSTOMER_TIERS),
    subject: subjectGen(),
    status,
    priority: faker.helpers.arrayElement(PRIORITIES),
    agentId,
    category,
    description: descGen(),
    tags: faker.helpers.arrayElements(
      [
        "refund",
        "checkout",
        "invoice",
        "subscription",
        "api",
        "sso",
        "import",
        "export",
        "webhooks",
        "upload",
        "dashboard",
        "performance",
        "rate-limiting",
        "authentication",
        "password",
        "email",
        "permissions",
        "gdpr",
        "license",
        "mobile",
        "android",
        "ios",
        "desktop",
        "browser",
      ],
      { min: 1, max: 3 },
    ),
    createdAt,
    updatedAt,
    deadline: faker.date.soon({ days: 7 }),
  };
});

fs.writeFileSync(DB_PATH, JSON.stringify(cases, null, 2) + "\n");

console.log(`Generated ${cases.length} cases → db.json`);
