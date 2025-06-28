import React, { useEffect, useState } from "react";
import TextInput from "./ui/TextInputs";
import TextArea from "./ui/TextArea";
import Button from "./ui/Button";

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

const ResumeForm = ({ extractedData, disabled = false }) => {
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
    <form onSubmit={handleSubmit} className="grid gap-6 grid-cols-1">

      <h3 className="text-xl text-slate-500 font-semibold">Personal Information</h3>
      <div className="grid md:grid-cols-2 col-span-2 gap-6 p-8 bg-white rounded-lg shadow-sm">
        <div className="md:col-span-2">
          <TextInput
            label="*Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            disabled={disabled}
            placeholder={"e.g. Juan Dela Cruz"}
          />
        </div>       

        <TextInput
          label="*Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          disabled={disabled}
          placeholder={"Your email address"}
        />

        <TextInput
          label="*Phone Number"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
          disabled={disabled}
          placeholder={"e.g. +63 912 345 6789"}
        />
      </div>

      <h3 className="text-xl text-slate-500 font-semibold">Work Experience</h3>
      <div className="grid md:grid-cols-2 col-span-2 gap-6 p-8 bg-white rounded-lg shadow-sm">
        <div className="md:col-span-2">
          <TextArea
            label="Work Experience"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            rows={6}
            disabled={disabled}
          />
        </div>
      </div>

      <h3 className="text-xl text-slate-500 font-semibold">Educational Background</h3>
      <div className="grid md:grid-cols-2 col-span-2 gap-6 p-8 bg-white rounded-lg shadow-sm">
        <div className="md:col-span-2">
          <TextArea
            label="Education"
            name="education"
            value={form.education}
            onChange={handleChange}
            rows={6}
            disabled={disabled}
          />        
        </div>
      </div>     
      <div className="col-span-2 flex justify-center">
        <Button
          type={"submit"}
          variant="primary"
          disabled={disabled}
          classNames="px-10"
        >
          Submit Form
        </Button>
      </div>      
    </form>
  );
};

export default ResumeForm;
