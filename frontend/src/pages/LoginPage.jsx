import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuthActions } from "../hooks/useAuthActions.js";
import { selectAuthStatus, selectAuthError } from "../features/auth/authSlice.js";
import AuthForm from "../components/AuthForm.jsx";

const LoginPage = () => {
  const { login } = useAuthActions();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const fields = [
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••", required: true },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Welcome back</p>
          <p className="mt-2 text-sm text-slate-600">Log in to continue managing your shared expenses.</p>
        </div>
        <AuthForm
          title="Login"
          fields={fields}
          submitLabel="Sign in"
          onSubmit={login}
          isLoading={status === "loading"}
          error={error}
        />
        <p className="text-center text-sm text-slate-500">
          Don’t have an account?{' '}
          <Link to="/auth/register" className="font-medium text-sky-600 hover:text-sky-700">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
