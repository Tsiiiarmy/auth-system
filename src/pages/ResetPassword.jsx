import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../utils/api";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const code = location.state?.code || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  // Password requirements
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const strength = Object.values(passwordChecks).filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!password) return "";
    if (strength <= 2) return "Weak";
    if (strength <= 4) return "Good";
    return "Strong";
  };

  const getStrengthWidth = () => {
    if (!password) return "0%";
    if (strength <= 2) return "40%";
    if (strength <= 4) return "70%";
    return "100%";
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !code) {
      setError(
        "Your password reset session is missing. Please restart the password reset process."
      );
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (!passwordChecks.uppercase) {
      setError("Your password must contain at least one uppercase letter.");
      return;
    }

    if (!passwordChecks.lowercase) {
      setError("Your password must contain at least one lowercase letter.");
      return;
    }

    if (!passwordChecks.number) {
      setError("Your password must contain at least one number.");
      return;
    }

    if (!passwordChecks.special) {
      setError("Your password must contain at least one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      await resetPassword(
        email,
        code,
        password,
        confirmPassword
      );

      navigate("/password-reset-success");
    } catch (err) {
      setError(err.message);
    }
  };


  const Requirement = ({ passed, children }) => (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
          passed
            ? "bg-emerald-100 text-emerald-600"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {passed ? "✓" : "•"}
      </span>

      <span
        className={`text-[11px] ${
          passed ? "text-emerald-600" : "text-gray-400"
        }`}
      >
        {children}
      </span>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50 px-4 py-8 sm:py-10">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-red-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-red-100/30 blur-3xl" />

      <div className="relative mx-auto w-full max-w-125">
        {/* Back Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() =>
              navigate("/forgot-password-verification", {
                state: {
                  email,
                  code,
                },
              })
            }  
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:-translate-x-1 hover:text-[#D71920]"
          >
            <span className="text-lg transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            Back
          </button>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-xl shadow-gray-200/50 sm:px-8 sm:py-9">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <svg
                className="h-8 w-8 text-[#D71920]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M8 10V7.5C8 5.29 9.79 3.5 12 3.5C14.21 3.5 16 5.29 16 7.5V10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <circle
                  cx="12"
                  cy="15"
                  r="1.3"
                  fill="currentColor"
                />

                <path
                  d="M12 16.3V18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="mt-6 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#D71920]">
              Account Recovery
            </div>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Create New Password
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
              Choose a strong new password for your account. Make sure it's
              something you don't use elsewhere.
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <svg
                  className="h-4 w-4 text-[#D71920]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3L19 6V11C19 15.5 16.2 19.4 12 21C7.8 19.4 5 15.5 5 11V6L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 sm:text-sm">
                  Secure password reset
                </p>

                <p className="mt-0.5 text-[11px] leading-4 text-gray-400 sm:text-xs">
                  Your new password will replace your current password.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-7">
            {/* New Password */}
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              New Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your new password"
                autoComplete="new-password"
                className={`h-12 w-full rounded-xl border bg-white px-4 pr-12 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 ${
                  error
                    ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-[#D71920] focus:ring-4 focus:ring-red-100"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M3 3L21 21"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.6 10.6C10.24 10.96 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.04 13.76 13.4 13.4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9.88 5.17C10.56 4.96 11.27 4.85 12 4.85C17 4.85 20.5 9.1 21 12C20.82 13.05 20.1 14.38 19.02 15.63"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6.2 7.04C4.38 8.39 3.25 10.35 3 12C3.5 14.9 7 19.15 12 19.15C13.38 19.15 14.68 18.8 15.82 18.2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M3 12C4.5 8 8 5 12 5C16 5 19.5 8 21 12C19.5 16 16 19 12 19C8 19 4.5 16 3 12Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Password Strength */}
            {password && (
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-400">
                    Password strength
                  </span>

                  <span
                    className={`text-[11px] font-semibold ${
                      strength <= 2
                        ? "text-red-500"
                        : strength <= 4
                        ? "text-amber-500"
                        : "text-emerald-500"
                    }`}
                  >
                    {getStrengthLabel()}
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      strength <= 2
                        ? "bg-red-400"
                        : strength <= 4
                        ? "bg-amber-400"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: getStrengthWidth() }}
                  />
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="mt-4 grid grid-cols-1 gap-2 rounded-xl bg-gray-50 px-4 py-3 sm:grid-cols-2">
              <Requirement passed={passwordChecks.length}>
                At least 8 characters
              </Requirement>

              <Requirement passed={passwordChecks.uppercase}>
                One uppercase letter
              </Requirement>

              <Requirement passed={passwordChecks.lowercase}>
                One lowercase letter
              </Requirement>

              <Requirement passed={passwordChecks.number}>
                One number
              </Requirement>

              <Requirement passed={passwordChecks.special}>
                One special character
              </Requirement>
            </div>

            {/* Confirm Password */}
            <label
              htmlFor="confirmPassword"
              className="mb-2 mt-6 block text-sm font-semibold text-gray-700"
            >
              Confirm New Password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Confirm your new password"
                autoComplete="new-password"
                className={`h-12 w-full rounded-xl border bg-white px-4 pr-12 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 ${
                  error
                    ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-[#D71920] focus:ring-4 focus:ring-red-100"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors hover:text-gray-600"
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M3 3L21 21"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.6 10.6C10.24 10.96 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.04 13.76 13.4 13.4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9.88 5.17C10.56 4.96 11.27 4.85 12 4.85C17 4.85 20.5 8.5 21 12C20.82 13.05 20.1 14.38 19.02 15.63"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6.2 7.04C4.38 8.39 3.25 10.35 3 12C3.5 14.9 7 19.15 12 19.15C13.38 19.15 14.68 18.8 15.82 18.2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M3 12C4.5 8 8 5 12 5C16 5 19.5 8 21 12C19.5 16 16 19 12 19C8 19 4.5 16 3 12Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Matching Password */}
            {confirmPassword && (
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                    password === confirmPassword
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {password === confirmPassword ? "✓" : "!"}
                </span>

                <span
                  className={`text-[11px] ${
                    password === confirmPassword
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {password === confirmPassword
                    ? "Passwords match"
                    : "Passwords do not match"}
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                  !
                </span>

                <p className="text-xs font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Reset Password Button */}
            <button
              type="submit"
              className="group mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D71920] text-sm font-semibold text-white shadow-lg shadow-red-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b9151b] hover:shadow-xl hover:shadow-red-200 active:translate-y-0 active:scale-[0.98]"
            >
              Reset Password

              <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
          </form>

          {/* Back to Login */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-5 w-full text-center text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-[#D71920]"
          >
            ← Back to Login
          </button>
        </div>

        {/* Security Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-gray-400 sm:text-xs">
          <svg
            className="h-4 w-4 text-emerald-500"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3L19 6V11C19 15.5 16.2 19.4 12 21C7.8 19.4 5 15.5 5 11V6L12 3Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M9 12L11 14L15 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>Your password reset is protected with secure verification</span>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;