import { useState } from "react";
import FormInput from "./FormInput.jsx";

const AuthForm = ({ title, fields, submitLabel, onSubmit, isLoading, error }) => {
  const [values, setValues] = useState(fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg sm:p-10">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <FormInput
            key={field.name}
            label={field.label}
            type={field.type}
            name={field.name}
            value={values[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
          />
        ))}
        {error && <div className="rounded-md bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-sky-600 px-4 py-3 text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Please wait..." : submitLabel}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
