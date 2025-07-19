import { extractEducation } from "../side/educationExtract";
import { extractEmail } from "../side/emailExtract";
import { fallbackNameFromEmail } from "../side/fallbackNameFromEmail";
import { extractLocation } from "../side/locationExtract";
import { extractName } from "../side/nameExtract";
import { extractPhone } from "../side/phoneExtract";
import toProperCase from "../side/properCase";
import { extractSkills } from "../side/skillsExtract";
import { extractExperience } from "../side/workExtract";


const extractWithAI = async (parsedText) => {
  if (!parsedText?.trim()) throw new Error("Parsed text is empty or invalid.");
  const lines = parsedText.split(/\r?\n/).map(line => line.trim()).filter(Boolean);

  const result = {
    firstName: "", lastName: "", fullName: "",
    email: "", phone: "", location: "",
    skills: [], education: [], experience: []
  };

  Object.assign(result, extractName(lines));

  result.email = extractEmail(lines);
  if (!result.fullName && result.email) {
    Object.assign(result, fallbackNameFromEmail(result.email));
  }

  result.phone = extractPhone(lines);
  result.location = extractLocation(lines);
  result.skills = extractSkills(lines);
  result.education = extractEducation(parsedText);
  result.experience = extractExperience(parsedText);

  result.firstName = toProperCase(result.firstName);
  result.lastName = toProperCase(result.lastName);
  result.fullName = toProperCase(result.fullName);
  result.email = result.email.toLowerCase();
  result.location = toProperCase(result.location);
  result.skills = result.skills.map(toProperCase);
  result.education = result.education.map(edu => ({
    institution: toProperCase(edu.institution),
    degree: toProperCase(edu.degree),
    year: edu.year
  }));
  result.experience = result.experience.map(exp => ({
    ...exp,
    company: toProperCase(exp.company),
    position: toProperCase(exp.position),
    location: toProperCase(exp.location),
  }));

  return result;
};

export default extractWithAI;
