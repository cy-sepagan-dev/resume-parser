import React, { useEffect, useState } from "react";

// Improved extractor function
const extractFields = (text) => {
  const result = {
    name: "",
    email: "",
    phone: "",
    summary: "",
    experience: "",
    education: "",
  };

  const lines = text.split("\n").map(line => line.trim()).filter(Boolean);

  // Name: probable full name on top
  const probableName = lines.find(line =>
    /^[A-Z][a-z]+(?: [A-Z][a-z]+)+$/.test(line) && !/resume|summary|profile/i.test(line)
  );
  result.name = probableName || "";

  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  result.email = emailMatch?.[0] || "";

  // Phone
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)*\d{3}[-.\s]?\d{4}/);
  result.phone = phoneMatch?.[0] || "";

  // Summary (first few lines after email/phone)
  const summaryStart = lines.findIndex(
    line => line.includes(result.email) || line.includes(result.phone)
  );
  result.summary = lines.slice(summaryStart + 1, summaryStart + 5).join(" ");

  // Work Experience
  const expMatch = text.match(/(?:Employment History|Work Experience|Professional Experience)[\s\S]{0,2000}/i);
  result.experience = expMatch ? expMatch[0].split(/Education/i)[0].trim() : "";

  // Education
  const eduMatch = text.match(/(?:Education|Academic Background)[\s\S]{0,1500}/i);
  result.education = eduMatch?.[0].trim() || "";

  return result;
};

const ResumeForm = ({ extractedData }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    experience: "",
    education: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const parsed = extractFields(extractedData);
    setForm(parsed);
  }, [extractedData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    if (!form.phone.trim()) errs.phone = "Phone is required.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
    } else {
      setErrors({});
      alert("Form submitted:\n" + JSON.stringify(form, null, 2));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
      {/* Name */}
      <div>
        <label className="block font-medium mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded shadow-sm"
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block font-medium mb-1">Contact Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded shadow-sm"
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block font-medium mb-1">Phone Number</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded shadow-sm"
        />
        {errors.phone && <p className="text-red-500">{errors.phone}</p>}
      </div>

      {/* Summary */}
      <div>
        <label className="block font-medium mb-1">Professional Summary</label>
        <textarea
          name="summary"
          value={form.summary}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded shadow-sm h-28"
        />
      </div>

      {/* Experience */}
      <div>
        <label className="block font-medium mb-1">Work Experience</label>
        <textarea
          name="experience"
          value={form.experience}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded shadow-sm h-32"
        />
      </div>

      {/* Education */}
      <div>
        <label className="block font-medium mb-1">Education</label>
        <textarea
          name="education"
          value={form.education}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded shadow-sm h-32"
        />
      </div>

      <button
        type="submit"
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        Submit
      </button>
    </form>
  );
};

export default ResumeForm;
