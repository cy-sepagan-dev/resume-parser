import React, { useEffect, useState } from "react";
import TextInput from "./ui/TextInputs";
import TextArea from "./ui/TextArea";
import Button from "./ui/Button";
import nlp from "compromise";

const extractFields = (text) => {
  const result = {
    name: "",
    email: "",
    phone: "",
    experience: "",
    education: "",
  };

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const joinedText = lines.join(" ");

  // 1. Extract full name using NLP (compromise)
  const doc = nlp(joinedText);
  const people = doc.people().out("array");
  if (people.length > 0) {
    result.name = people[0];
  }

  // 2. Email extraction (more robust pattern)
  const emailMatch = joinedText.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g
  );
  if (emailMatch?.length) {
    result.email = emailMatch[0];
  }

  // 3. Phone extraction (handles more formats, dashes, spaces)
  const phoneMatch = joinedText.match(
    /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/g
  );
  if (phoneMatch?.length) {
    result.phone = phoneMatch[0];
  }

  // 4. Fallback: guess name from email if not detected
  if (!result.name && result.email) {
    const emailPrefix = result.email.split("@")[0].split(/[._-]/);
    const guessedName = emailPrefix
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
    result.name = guessedName;
  }

  // 5. Extract work experience block
  const workMatch = text.match(
    /(Work Experience|Employment History|Professional Experience)([\s\S]{0,2500})/i
  );
  if (workMatch) {
    const block = workMatch[2]
      .replace(/(Education|Academic Background|Skills|Certifications|Languages).*/is, "")
      .trim();

    // Optional line-based cleanup
    const relevantLines = block
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 10 || /Developer|Engineer|Company|Technologies/i.test(line));

    result.experience = relevantLines.join("\n").trim();
  }

  // 6. Extract education block
  const eduMatch = text.match(
    /(Education|Academic Background)([\s\S]{0,2000})/i
  );
  if (eduMatch) {
    const block = eduMatch[2]
      .replace(/(Skills|Certifications|Languages|Experience).*/is, "")
      .trim();

    const eduLines = block
      .split("\n")
      .map((line) => line.trim())
      .filter((line) =>
        /Bachelor|Master|College|University|Graduate|High School|School/i.test(line)
      );

    result.education = eduLines.join("\n").trim();
  }

  return result;
};


const ResumeForm = ({ extractedData, disabled = false }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    education: "",
  });

  const [errors, setErrors] = useState({});

  const isFormIncomplete =
    !form.name.trim() ||
    !form.email.trim() ||
    !form.phone.trim() ||
    !form.experience.trim() ||
    !form.education.trim();

  useEffect(() => {
    const parsed = extractFields(extractedData);
    setForm(parsed);
  }, [extractedData]);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: !value.trim() ? `${name[0].toUpperCase() + name.slice(1)} is required.` : "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    if (!form.phone.trim()) errs.phone = "Phone is required.";
    if (!form.experience.trim()) errs.experience = "Work Experience is required.";
    if (!form.education.trim()) errs.education = "Educational background is required.";

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
            onBlur={handleBlur}
            error={errors.name}
            disabled={disabled}
            placeholder="e.g. Juan Dela Cruz"
          />
        </div>

        <TextInput
          label="*Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          disabled={disabled}
          placeholder="Your email address"
        />

        <TextInput
          label="*Phone Number"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone}
          disabled={disabled}
          placeholder="e.g. +63 912 345 6789"
        />
      </div>

      <h3 className="text-xl text-slate-500 font-semibold">Work Experience</h3>
      <div className="grid md:grid-cols-2 col-span-2 gap-6 p-8 bg-white rounded-lg shadow-sm">
        <div className="md:col-span-2">
          <TextArea
            label="*Work Experience"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.experience}
            rows={6}
            disabled={disabled}
          />
        </div>
      </div>

      <h3 className="text-xl text-slate-500 font-semibold">Educational Background</h3>
      <div className="grid md:grid-cols-2 col-span-2 gap-6 p-8 bg-white rounded-lg shadow-sm">
        <div className="md:col-span-2">
          <TextArea
            label="*Education"
            name="education"
            value={form.education}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.education}
            rows={6}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="col-span-2 flex justify-center">
        <Button
          type="submit"
          variant="primary"
          disabled={disabled || isFormIncomplete}
          classNames="px-10"
        >
          Submit Form
        </Button>
      </div>
    </form>
  );
};

export default ResumeForm;
