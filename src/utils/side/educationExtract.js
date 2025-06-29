export function extractEducation(parsedText) {
  const education = [];
  const eduBlock = parsedText.match(/(Education|Academic Background)([\s\S]{0,1500})/i);

  if (eduBlock) {
    const eduLines = eduBlock[2].split("\n").map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < eduLines.length - 1; i++) {
      const group = eduLines[i] + " " + eduLines[i + 1];
      const year = group.match(/\b(20\d{2}|19\d{2})\b/);
      const degree = group.match(/Bachelor|Master|High School|College|Associate|Graduate/i);
      const school = group.match(/University|College|Institute|School/i);

      if (degree || school || year) {
        education.push({
          institution: school?.[0] || "",
          degree: degree?.[0] || "",
          year: year?.[0] || "",
        });
        i++;
      }
    }
  }

  return education;
}
