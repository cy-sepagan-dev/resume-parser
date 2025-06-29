import React, { useEffect, useState } from "react";

const SkillInput = ({ label, value, onChange, disabled }) => {
  const [input, setInput] = useState("");
  const [skills, setSkills] = useState([]);

  // Initialize from parent
  useEffect(() => {
    if (typeof value === "string") {
      setSkills(value.split(",").map((s) => s.trim()).filter(Boolean));
    } else if (Array.isArray(value)) {
      setSkills(value);
    }
  }, [value]);

  const addSkill = (skill) => {
    const cleaned = skill.trim();
    if (cleaned && !skills.includes(cleaned)) {
      const updated = [...skills, cleaned];
      setSkills(updated);
      onChange(updated); // Notify parent
    }
  };

  const removeSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    onChange(updated); // Notify parent
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input);
      setInput("");
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm mb-1">{label}</label>
      <div className="bg-white p-3 border border-slate-300 rounded-md shadow-sm">
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
            >
              {skill}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="ml-2 text-blue-500 hover:text-red-500"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a skill and press Enter"
          className="w-full outline-none border-none focus:ring-0 placeholder:text-slate-400"
        />
      </div>
    </div>
  );
};

export default SkillInput;
