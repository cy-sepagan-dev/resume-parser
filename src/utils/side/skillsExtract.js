export function extractSkills(lines) {
  const softSkillKeywords = [
    "adaptable", "adaptability", "communication", "team player", "collaboration", "leadership",
    "problem solving", "critical thinking", "work under pressure", "attention to detail",
    "time management", "creativity", "organized", "fast learner", "multitasking",
    "initiative", "self-motivated", "decision making", "interpersonal skills", "empathy",
    "flexibility", "resilience", "reliability", "punctual", "integrity", "accountability"
  ];
  const skillSectionKeywords = [
    "skills", "core skills", "soft skills", "personal skills", "key strengths", "strengths"
  ];

  const skillLines = lines.filter(line => skillSectionKeywords.some(kw => line.toLowerCase().includes(kw)));
  const matched = [];

  for (const line of skillLines) {
    const softs = line.split(/[,•\-–—]/)
      .map(w => w.trim().toLowerCase())
      .filter(w => softSkillKeywords.includes(w));
    matched.push(...softs);
  }

  const additionalSoftSkills = lines.flatMap(line => {
    const lower = line.toLowerCase();
    return softSkillKeywords.filter(skill => lower.includes(skill));
  });

  return Array.from(new Set([...matched, ...additionalSoftSkills]));
}
