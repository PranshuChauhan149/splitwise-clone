import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuthActions } from "../hooks/useAuthActions.js";
import { selectAuthStatus, selectAuthError } from "../features/auth/authSlice.js";
import AuthForm from "../components/AuthForm.jsx";

const RegisterPage = () => {
  const { register } = useAuthActions();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const fields = [
    { name: "name", label: "Name", type: "text", placeholder: "Your full name", required: true },
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
    { name: "password", label: "Password", type: "password", placeholder: "Create a password", required: true },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Create your account</p>
          <p className="mt-2 text-sm text-slate-600">Register and start tracking group expenses with realtime conversation.</p>
        </div>
        <AuthForm
          title="Register"
          fields={fields}
          submitLabel="Create account"
          onSubmit={register}
          isLoading={status === "loading"}
          error={error}
        />
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-sky-600 hover:text-sky-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
