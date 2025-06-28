const TextInput = ({ label, name, type = "text", value, onChange, error, required = false, placeholder }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full border px-3 py-2 rounded shadow-sm"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default TextInput;