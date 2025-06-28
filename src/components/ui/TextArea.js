const TextArea = ({ label, name, value, onChange, error, rows = 5 }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border px-3 py-2 rounded shadow-sm"
      rows={rows}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default TextArea;