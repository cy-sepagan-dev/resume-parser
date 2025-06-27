import React, { useEffect, useState } from "react";

const ResumeFieldExtractor = ({ rawText }) => {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    skills: [],
    education: "",
    experience: "",
  });

  const KNOWN_SKILLS = [
    "JavaScript", "React", "Node.js", "HTML", "CSS", "Python", "Java", "C++",
    "SQL", "MongoDB", "AWS", "Docker", "Git", "Photoshop", "Figma", "Tailwind"
  ];

  const extractFields = () => {
    const text = rawText || "";

    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);

    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

    const firstLines = text.split("\n").filter(l => l.trim().length > 0);
    const nameGuess = firstLines.length > 0 ? firstLines[0] : "";

    const escapeRegExp = (str) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const foundSkills = KNOWN_SKILLS.filter(skill =>
        new RegExp(`\\b${escapeRegExp(skill)}\\b`, "i").test(text)
    );

    const experienceSection = text.split(/experience|work history/i)[1]?.split(/\n\n|\n\s*\n/)[0] || "";

    const educationSection = text.split(/education/i)[1]?.split(/\n\n|\n\s*\n/)[0] || "";

    setFields({
      name: nameGuess,
      email: emailMatch?.[0] || "",
      phone: phoneMatch?.[0] || "",
      skills: foundSkills,
      education: educationSection.trim(),
      experience: experienceSection.trim(),
    });
  };

  useEffect(() => {
    extractFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawText]);

  return (
    <div className="mt-10 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-blue-700"> Extracted Resume Fields</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div><strong>Full Name:</strong> {fields.name}</div>
        <div><strong>Email:</strong> {fields.email}</div>
        <div><strong>Phone:</strong> {fields.phone}</div>
        <div className="md:col-span-2">
          <strong>Skills:</strong> {fields.skills.join(", ") || "None found"}
        </div>
        <div className="md:col-span-2">
          <strong>Experience:</strong>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{fields.experience || "Not found"}</pre>
        </div>
        <div className="md:col-span-2">
          <strong>Education:</strong>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{fields.education || "Not found"}</pre>
        </div>
      </div>
    </div>
  );
};

export default ResumeFieldExtractor;
