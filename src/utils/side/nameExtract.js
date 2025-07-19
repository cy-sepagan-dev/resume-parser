import nlp from "compromise";

// Capitalize each word properly
function capitalizeWords(str = "") {
  return str.replace(/\w\S*/g, word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

export function extractName(lines = []) {
  let fullName = "";
  let firstName = "";
  let lastName = "";

  const peopleNames = lines.flatMap(line => nlp(line).people().out("array"));

  // Priority 1: Lines like "Name: John Doe" or "Full Name - Jane Smith"
  const nameLine = lines.find(line => /^(name|full name)\b[:\-]?\s*/i.test(line));
  if (nameLine) {
    const match = nameLine.match(/[:\-]?\s*(.+)$/i);
    fullName = match?.[1]?.trim() || "";
  }

  // Priority 2: First detected person name from compromise
  if (!fullName && peopleNames.length > 0) {
    fullName = peopleNames[0];
  }

  // Extract first and last name from fullName
  if (fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      firstName = parts.slice(0, -1).join(" ");
      lastName = parts.at(-1);
    } else {
      firstName = fullName;
    }
  }

  return {
    fullName: capitalizeWords(fullName),
    firstName: capitalizeWords(firstName),
    lastName: capitalizeWords(lastName)
  };
}
