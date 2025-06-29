export function extractPhone(lines) {
  const allPhoneMatches = lines.flatMap(line =>
    line.match(/(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/g) || []
  );

  const keywordPhone = lines.find(line => /phone|contact|mobile/i.test(line) && /\d{3}/.test(line));

  if (keywordPhone) {
    return (keywordPhone.match(/\+?\d[\d\s().-]{8,}/) || [])[0] || "";
  } else {
    const valid = allPhoneMatches.find(p => p.replace(/[^\d]/g, "").length >= 10);
    return valid || allPhoneMatches[0] || "";
  }
}
