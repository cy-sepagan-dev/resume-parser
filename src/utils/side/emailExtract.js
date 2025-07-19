export function extractEmail(lines) {
  const personalEmailDomains = [
    "gmail.com", "yahoo.com", "ymail.com", "outlook.com", "hotmail.com", "live.com",
    "icloud.com", "me.com", "mac.com", "aol.com", "zoho.com", "protonmail.com", "pm.me",
    "gmx.com", "gmx.us", "mail.com", "email.com", "consultant.com"
  ];

  const allEmailMatches = lines.flatMap(line => line.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || []);
  const keywordEmail = lines.find(line => /email|e-mail/i.test(line) && /@/.test(line));

  if (keywordEmail) {
    return (keywordEmail.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i) || [])[0] || "";
  } else {
    const personal = allEmailMatches.find(email => personalEmailDomains.includes(email.split('@')[1]));
    return personal || allEmailMatches[0] || "";
  }
}
