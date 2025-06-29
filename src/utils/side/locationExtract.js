import nlp from "compromise";

export function extractLocation(lines) {
  const addressKeywords = [
    "street", "st", "road", "rd", "avenue", "ave", "lane", "ln", "blvd", "drive", "dr",
    "court", "ct", "square", "sq", "block", "building", "unit", "suite", "floor", "apt",
    "village", "town", "city", "district", "region", "state", "province", "zipcode", "zip", "postal", "country"
  ];

  return lines.find(line => {
    const lower = line.toLowerCase();
    return addressKeywords.some(kw => lower.includes(kw)) || nlp(line).places().out("array").length > 0;
  }) || "";
}
