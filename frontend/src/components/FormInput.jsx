const FormInput = ({ label, type, value, onChange, placeholder, icon: Icon, required = true }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-primary uppercase tracking-wider pl-1">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-white border border-gray-200 rounded-2xl py-3.5 ${Icon ? 'pl-12' : 'pl-5'} pr-5 text-gray-700 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all shadow-sm`}
        />
      </div>
    </div>
  );
};

export default FormInput;
