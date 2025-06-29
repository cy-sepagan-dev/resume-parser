export function fallbackNameFromEmail(email) {
  if (!email) return { firstName: "", lastName: "", fullName: "" };

  const parts = email.split("@")[0].split(/[._-]/);
  const firstName = parts[0]?.charAt(0).toUpperCase() + parts[0]?.slice(1) || "";
  const lastName = parts[1]?.charAt(0).toUpperCase() + parts[1]?.slice(1) || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return { firstName, lastName, fullName };
}
