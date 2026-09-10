import { useNavigate } from "react-router-dom";

function RegistrationComplete() {
  const navigate = useNavigate();

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
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:-translate-x-1 hover:text-[#D71920]"
          >
            <span className="text-lg transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            Back
          </button>
        </div>

        {/* Registration Progress */}
        <div className="mb-8 flex w-full items-start justify-between">
          {/* Step 1 */}
          <div className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600 shadow-sm">
                ✓
              </div>

              <div className="h-0.5 flex-1 bg-gray-200" />
            </div>

            <span className="mt-2 text-[10px] font-medium text-gray-500 sm:text-xs">
              Account
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div className="h-0.5 flex-1 bg-gray-200" />

              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600 shadow-sm">
                ✓
              </div>

              <div className="h-0.5 flex-1 bg-gray-200" />
            </div>

            <span className="mt-2 text-[10px] font-medium text-gray-500 sm:text-xs">
              Verify Email
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div className="h-0.5 flex-1 bg-gray-200" />

              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600 shadow-sm">
                ✓
              </div>

              <div className="h-0.5 flex-1 bg-gray-200" />
            </div>

            <span className="mt-2 text-[10px] font-medium text-gray-500 sm:text-xs">
              Verify Phone
            </span>
          </div>

          {/* Step 4 - Active */}
          <div className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div className="h-0.5 flex-1 bg-gray-200" />

              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#D71920] text-sm font-bold text-white shadow-md shadow-red-200 transition-transform duration-300 hover:scale-110">
                4
              </div>
            </div>

            <span className="mt-2 text-[10px] font-semibold text-[#D71920] sm:text-xs">
              Complete
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-9 shadow-xl shadow-gray-200/60 sm:px-8 sm:py-10">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="group relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 transition-all duration-300 hover:scale-105 hover:bg-emerald-100">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-8 border-emerald-50 transition-all duration-300 group-hover:border-emerald-100" />

              <svg
                className="relative h-12 w-12 transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#10B981"
                  strokeWidth="3"
                />

                <path
                  d="M14.5 24.5L21 31L34 17.5"
                  stroke="#10B981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="mt-7 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Registration Successful!
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
              Your account has been created and your email and phone number
              have been successfully verified.
            </p>
          </div>

          {/* Success Message */}
          <div className="mt-7 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-600">
                ✓
              </span>

              <p className="text-sm font-semibold text-emerald-700">
                Your account is ready
              </p>
            </div>

            <p className="mt-2 text-xs leading-5 text-emerald-600/80 sm:text-sm">
              You can now sign in and start using your account.
            </p>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="group mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D71920] text-sm font-semibold text-white shadow-lg shadow-red-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b9151b] hover:shadow-xl hover:shadow-red-200 active:translate-y-0 active:scale-[0.98]"
          >
            Go to Login

            <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>

          {/* Secondary Action */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-4 w-full text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-[#D71920]"
          >
            Sign in to your account
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

export default RegistrationComplete;

