import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {forgotPassword,verifyPasswordResetCode} from "../utils/api";import { navigateWithTransition } from "../utils/navigateWithTransition";


function ForgotPasswordVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    // Only allow one digit per input
    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;

    setOtp(newOtp);
    setError("");

    // Move to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setError("");

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      const code = otp.join("");

      if (!email) {
        setError(
          "Your email information is missing. Please restart the password reset process."
        );
        return;
      }

      if (code.length !== 6) {
        setError("Please enter the 6-digit verification code.");
        return;
      }

      setError("");

      try {
        await verifyPasswordResetCode(email, code);

        navigateWithTransition(
          navigate,
          "/reset-password",
          {
            state: {
              email,
              code,
            },
          }
        );
      } catch (err) {
        setError(err.message);
    }
};


  const handleResend = async () => {
    if (resendTimer > 0 || isResending) {
      return;
    }

    if (!email) {
      setError(
        "Your email information is missing. Please restart the password reset process."
      );
      return;
    }

    setError("");
    setIsResending(true);

    try {
      await forgotPassword(email);

      setOtp(["", "", "", "", "", ""]);
      setResendTimer(30);

      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50 px-4 py-8 sm:py-10">
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-red-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-red-100/30 blur-3xl" />

      <div className="relative mx-auto w-full max-w-125">

        {/* Back Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() =>
              navigate("/forgot-password")
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
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M3 7L12 13L21 7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
              Verify Your Email
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
              Enter the 6-digit verification code we sent to your email address.
            </p>
          </div>

          {/* Email */}
          <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-center">
            <p className="text-xs text-gray-400">
              Verification code sent to
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-700">
              {email || "your email address"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-7">

            <label className="mb-3 block text-center text-sm font-semibold text-gray-700">
              Enter verification code
            </label>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(index, e.target.value)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(index, e)
                  }
                  onPaste={handlePaste}
                  className={`h-12 w-11 rounded-xl border bg-white text-center text-lg font-semibold text-gray-900 outline-none transition-all duration-200 sm:h-14 sm:w-12 ${
                    error
                      ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 focus:border-[#D71920] focus:ring-4 focus:ring-red-100"
                  }`}
                  aria-label={`Verification digit ${index + 1}`}
                />
              ))}
            </div>

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

            {/* Verify Button */}
            <button
              type="submit"
              className="group mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D71920] text-sm font-semibold text-white shadow-lg shadow-red-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b9151b] hover:shadow-xl hover:shadow-red-200 active:translate-y-0 active:scale-[0.98]"
            >
              Verify Code

              <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
          </form>

          {/* Resend */}
          <div className="mt-5 text-center">
            <p className="text-xs text-gray-400">
              Didn't receive the code?
            </p>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0 || isResending}
              className={`mt-1 text-sm font-semibold transition-colors ${
                resendTimer > 0 || isResending
                  ? "cursor-not-allowed text-gray-300"
                  : "text-[#D71920] hover:text-[#b9151b]"
              }`}
            >
              {isResending
                ? "Sending..."
                : resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : "Resend code"}
            </button>
          </div>

          {/* Back to Login */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-5 w-full text-center text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-[#D71920]"
          >
            ← Back to Login
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-gray-400 sm:text-xs">
          <svg
            className="h-4 w-4 text-emerald-500"
            viewBox="0 0 24 24"
            fill="none"
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

          <span>
            Your password reset is protected with secure verification
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordVerification;