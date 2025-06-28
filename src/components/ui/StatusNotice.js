// components/StatusNotice.jsx
import React from "react";
import clsx from "clsx";

const StatusNotice = ({ type = "info", message, show = true }) => {
  if (!show || !message) return null;

  const baseClass = "px-4 py-2 rounded-md border text-sm";

  const variants = {
    info: "bg-blue-50 text-blue-800 border-blue-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    error: "bg-red-50 text-red-800 border-red-200",
  };

  const prefix = {
    info: "Status:",
    warning: "Notice:",
    error: "Error:",
  };

  return (
    <div className={clsx(baseClass, variants[type])}>
      <strong>{prefix[type]}</strong> {message}
    </div>
  );
};

export default StatusNotice;
