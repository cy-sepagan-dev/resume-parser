import toProperCase from "./properCase";

export function extractExperience(text) {
  const experience = [];
  const workExpRegex = /([A-Z][A-Z\s\-\.&]+?),\s*(.*?),\s*(PHILIPPINES|[A-Z][a-z\s]+)?\s*(20\d{2})\s*[-–]\s*(20\d{2}|Present)\s*\n(.+?)(?=\n[A-Z\s]+,\s|$)/gs;
  let match;

  while ((match = workExpRegex.exec(text)) !== null) {
    const [, companyRaw, cityRaw, countryRaw, startYear, endYear, roleAndDesc] = match;

    const company = toProperCase(companyRaw);
    const location = toProperCase([cityRaw, countryRaw].filter(Boolean).join(", "));
    const positionLine = roleAndDesc.split(".")[0].split("\n")[0];
    const positionMatch = positionLine.match(/(Developer|Engineer|Manager|Designer|Analyst|Lead|Support|Assistant|Intern)/i);
    const position = positionMatch ? toProperCase(positionLine.trim()) : "";
    const responsibilities = roleAndDesc.replace(positionLine, "").replace(/\s+/g, " ").trim();

    experience.push({ company, position, duration: `${startYear} - ${endYear}`, location, responsibilities });
  }

  return experience;
}
