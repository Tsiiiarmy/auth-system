import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  enableTwoFactor,
  disableTwoFactor,
  getCurrentUser,
} from "../utils/api";

function TwoFactorSetup() {
  const navigate = useNavigate();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Load the actual 2FA status from the backend
  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      setError("You are not authenticated. Please log in again.");
      setIsLoadingStatus(false);
      return;
    }

    const loadTwoFactorStatus = async () => {
      try {
        const user = await getCurrentUser(token);

        setTwoFactorEnabled(
          Boolean(user.twoFactorEnabled)
        );
      } catch (error) {
        setError(
          error.message ||
            "Failed to load your 2FA settings."
        );
      } finally {
        setIsLoadingStatus(false);
      }
    };

    loadTwoFactorStatus();
  }, []);

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      setError(
        "You are not authenticated. Please log in again."
      );
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      if (twoFactorEnabled) {
        await enableTwoFactor(token);
      } else {
        await disableTwoFactor(token);
      }

      // Verify that the backend actually saved the new state
      const updatedUser = await getCurrentUser(token);

      setTwoFactorEnabled(
        Boolean(updatedUser.twoFactorEnabled)
      );

      navigate("/dashboard");

    } catch (error) {
      setError(
        error.message ||
        "Failed to update your 2FA settings."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50 px-4 py-8 sm:py-10">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-red-200/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-red-100/25 blur-3xl" />

      <div className="relative mx-auto w-full max-w-125">
        {/* Back Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:-translate-x-1 hover:text-[#D71920]"
          >
            <span className="text-lg transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            Back
          </button>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-xl shadow-gray-200/60 sm:px-8 sm:py-10">

          {/* Header */}
          <div className="text-center">

            {/* Security Icon */}
            <div className="group mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 transition-all duration-300 hover:scale-105 hover:bg-red-100">
              <svg
                className="h-10 w-10 text-[#D71920] transition-transform duration-300 group-hover:scale-110"
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

                <rect
                  x="9"
                  y="10"
                  width="6"
                  height="5"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />

                <path
                  d="M10.5 10V8.5C10.5 7.67 11.17 7 12 7C12.83 7 13.5 7.67 13.5 8.5V10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#D71920]">
              Account Security
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Two-Factor Authentication
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
              Add an extra layer of protection to your account by requiring a
              verification code when signing in.
            </p>
          </div>

          {/* Security Illustration */}
          <div className="mt-8 flex justify-center">
            <div className="relative flex h-32 w-full max-w-xs items-center justify-center overflow-hidden rounded-2xl bg-gray-50">

              {/* Decorative circles */}
              <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-red-100/60" />
              <div className="absolute -bottom-10 -right-5 h-28 w-28 rounded-full bg-red-100/40" />

              {/* Phone */}
              <div className="relative flex h-20 w-12 items-center justify-center rounded-[10px] border-2 border-gray-700 bg-white shadow-lg">
                <div className="absolute top-2 h-1 w-5 rounded-full bg-gray-200" />

                <div className="flex h-10 w-8 items-center justify-center rounded-md bg-red-50">
                  <svg
                    className="h-5 w-5 text-[#D71920]"
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

                <div className="absolute bottom-2 h-1 w-1 rounded-full bg-gray-300" />
              </div>

              {/* Connection */}
              <div className="relative mx-3 flex items-center">
                <div className="h-0.5 w-10 bg-red-200" />

                <div className="absolute left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-red-50 text-[#D71920] shadow-sm">
                  <span className="text-sm">✓</span>
                </div>
              </div>

              {/* Security Shield */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-gray-100">
                <svg
                  className="h-10 w-10 text-[#D71920]"
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
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              How it works
            </p>

            <div className="mt-4 space-y-3">

              {/* Step 1 */}
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5 transition-all duration-200 hover:bg-red-50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#D71920] shadow-sm">
                  1
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Sign in normally
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Enter your email or phone and password.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5 transition-all duration-200 hover:bg-red-50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#D71920] shadow-sm">
                  2
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Receive a verification code
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    A one-time code will be sent to your registered email.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5 transition-all duration-200 hover:bg-red-50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#D71920] shadow-sm">
                  3
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Confirm your identity
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Enter the code to complete 2FA verification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle */}
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                {/* Status Icon */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                    twoFactorEnabled
                      ? "bg-emerald-50 text-emerald-500"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="11"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />

                    <path
                      d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Enable 2FA
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {isLoadingStatus
                      ? "Loading your security settings..."
                      : twoFactorEnabled
                      ? "Two-factor authentication is enabled."
                      : "Recommended for stronger security."}
                  </p>
                </div>
              </div>

              {/* Proper Toggle */}
              <label
                className={`relative inline-flex shrink-0 ${
                  isLoadingStatus || isSaving
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={twoFactorEnabled}
                  onChange={(e) =>
                    setTwoFactorEnabled(e.target.checked)
                  }
                  disabled={isLoadingStatus || isSaving}
                  aria-label="Enable Two-Factor Authentication"
                />

                <span
                  className="
                    relative
                    h-7
                    w-12
                    rounded-full
                    bg-gray-300
                    transition-colors
                    duration-200
                    peer-checked:bg-emerald-500
                    peer-focus:outline-none
                    peer-focus:ring-2
                    peer-focus:ring-emerald-300
                    peer-focus:ring-offset-2
                    peer-disabled:opacity-60
                    after:absolute
                    after:left-1
                    after:top-1
                    after:h-5
                    after:w-5
                    after:rounded-full
                    after:bg-white
                    after:shadow-md
                    after:transition-transform
                    after:duration-200
                    after:content-['']
                    peer-checked:after:translate-x-5
                  "
                />
              </label>
            </div>
          </div>

          {/* Information Box */}
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
            <div className="flex gap-3">

              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <span className="text-xs font-bold">i</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-800">
                  How verification works
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-600/80">
                  When 2FA is enabled, a one-time verification code will be
                  sent to your registered email address whenever you sign in.
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Save Button */}
          <form onSubmit={handleSaveChanges}>
            <button
              type="submit"
              disabled={isSaving || isLoadingStatus}
              className="group mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D71920] text-sm font-semibold text-white shadow-lg shadow-red-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b9151b] hover:shadow-xl hover:shadow-red-200 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoadingStatus
                ? "Loading..."
                : isSaving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </form>

          {/* Cancel */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-4 w-full text-sm font-medium text-gray-400 transition-colors duration-200 hover:text-[#D71920]"
          >
            Cancel and return to dashboard
          </button>
        </div>

        {/* Security Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 pb-4 text-center text-[11px] text-gray-400 sm:text-xs">
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

          <span>Your security settings are protected</span>
        </div>
      </div>
    </div>
  );
}

export default TwoFactorSetup;