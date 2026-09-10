import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { navigateWithTransition } from "../utils/navigateWithTransition";
import { forgotPassword } from "../utils/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    try {
      await forgotPassword(email.trim());

      navigateWithTransition(
        navigate,
        "/forgot-password-verification",
        {
          state: {
            email: email.trim().toLowerCase(),
          },
        }
      );
    } catch (err) {
      setError(err.message);
    }
  };


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
            onClick={() => navigate("/login")}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:-translate-x-1 hover:text-[#D71920]"
          >
            <span className="text-lg transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            Back to Login
          </button>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-9 shadow-xl shadow-gray-200/60 sm:px-8 sm:py-10">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50">
              <svg
                className="h-10 w-10 text-[#D71920]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 7.5C4 6.67 4.67 6 5.5 6H18.5C19.33 6 20 6.67 20 7.5V16.5C20 17.33 19.33 18 18.5 18H5.5C4.67 18 4 17.33 4 16.5V7.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M4.5 7L12 13L19.5 7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M16.5 3.5V7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <path
                  d="M14.5 5.5H18.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="mt-7 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#D71920]">
              Account Recovery
            </div>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Forgot Your Password?
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
              No worries. Enter the email address associated with your account
              and we'll send you a verification code to reset your password.
            </p>
          </div>

          {/* Recovery Information */}
          <div className="mt-7 rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
            <div className="flex items-start gap-3">
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
                  Secure password recovery
                </p>

                <p className="mt-1 text-[11px] leading-5 text-gray-400 sm:text-xs">
                  We'll verify your identity before allowing your password to
                  be changed.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-7">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>

            <div className="relative">
              {/* Email Icon */}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 7.5C4 6.67 4.67 6 5.5 6H18.5C19.33 6 20 6.67 20 7.5V16.5C20 17.33 19.33 18 18.5 18H5.5C4.67 18 4 17.33 4 16.5V7.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M4.5 7L12 13L19.5 7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your email address"
                autoComplete="email"
                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 ${
                  error
                    ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-[#D71920] focus:ring-4 focus:ring-red-100"
                }`}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                  !
                </span>

                <p className="text-xs font-medium text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="group mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D71920] text-sm font-semibold text-white shadow-lg shadow-red-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b9151b] hover:shadow-xl hover:shadow-red-200 active:translate-y-0 active:scale-[0.98]"
            >
              Send Verification Code

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
            ← Remember your password? Sign in
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

          <span>Your account is protected with secure verification</span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;