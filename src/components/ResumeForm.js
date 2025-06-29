import React, { useEffect, useState } from "react";
import TextInput from "./ui/TextInputs";
import Button from "./ui/Button";
import SkillInput from "./ui/SkillInput";

const ResumeForm = ({ structuredData = null, disabled = false }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    skills: "",
    experience: [],
    education: [],
  });

  useEffect(() => {
    if (structuredData) {
      setForm({
        firstName: structuredData.firstName || "",
        lastName: structuredData.lastName || "",
        email: structuredData.email || "",
        phone: structuredData.phone || "",
        location: structuredData.location || "",
        skills: Array.isArray(structuredData.skills)
        ? structuredData.skills
        : typeof structuredData.skills === "string"
        ? structuredData.skills.split(",").map((s) => s.trim())
        : [],
        experience: structuredData.experience || [],
        education: structuredData.education || [],
      });
    }
  }, [structuredData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, field, value, key) => {
    const newArr = [...form[key]];
    newArr[index][field] = value;
    setForm((prev) => ({ ...prev, [key]: newArr }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Submitted:\n" + JSON.stringify(form, null, 2));
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <h3 className="text-xl text-slate-500 font-semibold">Personal Information</h3>
      <div className="grid md:grid-cols-2 gap-6 bg-white p-10 rounded-md shadow-sm">
        <TextInput label="First Name" name="firstName" value={form.firstName} onChange={handleChange} disabled={disabled} />
        <TextInput label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} disabled={disabled} />
        <TextInput label="Email" name="email" value={form.email} onChange={handleChange} disabled={disabled} />
        <TextInput label="Phone" name="phone" value={form.phone} onChange={handleChange} disabled={disabled} />
        {/* <TextInput label="Location" name="location" value={form.location} onChange={handleChange} disabled={disabled} /> */}
      </div>

      <h3 className="text-xl text-slate-500 font-semibold ">Skills</h3>
      <div className="grid md:grid-cols-1 gap-6 bg-white p-10 rounded-md shadow-sm">
        <SkillInput
          label="Skills"
          value={form.skills}
          onChange={(skills) => setForm((prev) => ({ ...prev, skills }))}
          disabled={disabled}
        />
      </div>     

      <h3 className="text-xl text-slate-500 font-semibold">Work Experience</h3>
      {form.experience.map((exp, i) => (
        <div key={i} className="grid md:grid-cols-3 gap-4 bg-white p-10 rounded-md shadow-sm">
          <TextInput
            label="Company"
            value={exp.company}
            onChange={(e) => handleArrayChange(i, "company", e.target.value, "experience")}
            disabled={disabled}
          />
          <TextInput
            label="Position"
            value={exp.position}
            onChange={(e) => handleArrayChange(i, "position", e.target.value, "experience")}
            disabled={disabled}
          />
          <TextInput
            label="Duration"
            value={exp.duration}
            onChange={(e) => handleArrayChange(i, "duration", e.target.value, "experience")}
            disabled={disabled}
          />
        </div>
      ))}

      <h3 className="text-xl text-slate-500 font-semibold">Education</h3>
      {form.education.map((edu, i) => (
        <div key={i} className="grid md:grid-cols-3 gap-4 bg-white p-10 rounded-md shadow-sm">
          <TextInput
            label="Institution"
            value={edu.institution}
            onChange={(e) => handleArrayChange(i, "institution", e.target.value, "education")}
            disabled={disabled}
          />
          <TextInput
            label="Degree"
            value={edu.degree}
            onChange={(e) => handleArrayChange(i, "degree", e.target.value, "education")}
            disabled={disabled}
          />
          <TextInput
            label="Year"
            value={edu.year}
            onChange={(e) => handleArrayChange(i, "year", e.target.value, "education")}
            disabled={disabled}
          />
        </div>
      ))}

      <div className="flex justify-center">
        <Button type="submit" variant="primary" classNames="px-10" disabled={disabled}>
          Submit Form
        </Button>
      </div>
    </form>
  );
};

export default ResumeForm;
