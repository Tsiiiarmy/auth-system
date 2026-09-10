import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyTwoFactor } from "../utils/api";

function TwoFactorVerification() {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = useRef([]);

  // --------------------------------
  // Load login email
  // --------------------------------
  useEffect(() => {
    const email = sessionStorage.getItem("loginEmail");

    if (email) {
      setLoginEmail(email);
    } else {
      setError(
        "Login session not found. Please return to login and try again."
      );
    }
  }, []);

  // --------------------------------
  // Resend countdown
  // --------------------------------
  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // --------------------------------
  // Format timer
  // --------------------------------
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // --------------------------------
  // OTP change
  // --------------------------------
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);
    setError("");

    // Move to next input automatically
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // --------------------------------
  // Keyboard navigation
  // --------------------------------
  const handleKeyDown = (e, index) => {
    // Move backward with Backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Move left
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Move right
    if (
      e.key === "ArrowRight" &&
      index < otp.length - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // --------------------------------
  // Paste OTP
  // --------------------------------
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) {
      return;
    }

    const newOtp = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setError("");

    const nextIndex = Math.min(
      pastedValue.length,
      otp.length - 1
    );

    inputRefs.current[nextIndex]?.focus();
  };

  // --------------------------------
  // Resend code
  // --------------------------------
  const handleResend = () => {
    if (resendTimer > 0) {
      return;
    }

    // Backend resend functionality can be added later.
    console.log("Resending 2FA verification code");

    setOtp(["", "", "", "", "", ""]);
    setError("");
    setResendTimer(30);

    inputRefs.current[0]?.focus();
  };

  // --------------------------------
  // Submit
  // --------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError(
        "Please enter the complete 6-digit verification code."
      );
      return;
    }

    const email = sessionStorage.getItem("loginEmail");

    if (!email) {
      setError(
        "Login session not found. Please return to login and try again."
      );
      return;
    }

    const rememberMe =
      sessionStorage.getItem("loginRememberMe") === "true";

    setIsSubmitting(true);
    setError("");

    try {
      const result = await verifyTwoFactor(
        email,
        enteredOtp
      );

      // --------------------------------
      // Store JWT according to Remember Me
      // --------------------------------
      if (rememberMe) {
        // Remember Me checked:
        // Keep the user logged in after closing the browser.
        localStorage.setItem("token", result.token);

        // Make sure there isn't an old session token.
        sessionStorage.removeItem("token");
      } else {
        // Remember Me unchecked:
        // Keep the login only for the current browser session.
        sessionStorage.setItem("token", result.token);

        // Make sure there isn't an old persistent token.
        localStorage.removeItem("token");
      }

      // --------------------------------
      // Clean up temporary 2FA data
      // --------------------------------
      sessionStorage.removeItem("loginEmail");
      sessionStorage.removeItem("loginRememberMe");

      // --------------------------------
      // Login successful
      // --------------------------------
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.message ||
          "Invalid verification code. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50 px-4 py-8 sm:py-10">

      {/* ========================================================= */}
      {/* BACKGROUND GLOW */}
      {/* ========================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Top-left reddish glow */}
        <div
          className="
            absolute
            -left-32
            -top-32
            h-72
            w-72
            rounded-full
            bg-red-500/10
            blur-3xl
          "
        />

        {/* Bottom-right subtle glow */}
        <div
          className="
            absolute
            -bottom-32
            -right-32
            h-72
            w-72
            rounded-full
            bg-red-500/5
            blur-3xl
          "
        />
      </div>

      {/* ========================================================= */}
      {/* MAIN CONTAINER */}
      {/* ========================================================= */}

      <div className="relative mx-auto w-full max-w-125">

        {/* ======================================================= */}
        {/* BACK BUTTON */}
        {/* ======================================================= */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="
            group
            mb-5
            flex
            items-center
            gap-2
            text-sm
            font-medium
            text-gray-500
            transition-all
            duration-200
            hover:-translate-x-1
            hover:text-gray-800
          "
        >
          <span
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white
              text-gray-600
              shadow-sm
              ring-1
              ring-gray-200
              transition-all
              duration-200
              group-hover:shadow-md
              group-hover:ring-gray-300
            "
          >
            ←
          </span>

          Back
        </button>

        {/* ======================================================= */}
        {/* VERIFICATION CARD */}
        {/* ======================================================= */}

        <div
          className="
            rounded-2xl
            border
            border-gray-100
            bg-white
            px-6
            py-8
            shadow-xl
            shadow-gray-200/50
            transition-all
            duration-300
            sm:px-8
            sm:py-9
          "
        >

          {/* ===================================================== */}
          {/* HEADER */}
          {/* ===================================================== */}

          <div className="text-center">

            {/* Security Icon */}
            <div
              className="
                group
                mx-auto
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-red-50
                transition-all
                duration-300
                hover:scale-105
                hover:bg-red-100
              "
            >
              <svg
                className="
                  h-8
                  w-8
                  text-[#D71920]
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
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

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-[#D71920]
              "
            >
              Account Security
            </p>

            <h1
              className="
                mt-2
                text-2xl
                font-bold
                tracking-tight
                text-gray-800
                sm:text-3xl
              "
            >
              Two-Factor Authentication
            </h1>

            <p
              className="
                mx-auto
                mt-2
                max-w-sm
                text-sm
                leading-6
                text-gray-500
                sm:text-base
              "
            >
              Enter the 6-digit verification code sent
              to your registered email address.
            </p>
          </div>

          {/* ===================================================== */}
          {/* EMAIL */}
          {/* ===================================================== */}

          <div
            className="
              mx-auto
              mt-5
              w-fit
              rounded-lg
              bg-gray-50
              px-4
              py-2
            "
          >
            <p
              className="
                text-sm
                font-semibold
                text-gray-700
              "
            >
              {loginEmail || "your registered email"}
            </p>
          </div>

          {/* ===================================================== */}
          {/* OTP FORM */}
          {/* ===================================================== */}

          <form
            onSubmit={handleSubmit}
            className="mt-7"
          >
            <label
              className="
                mb-3
                block
                text-center
                text-sm
                font-semibold
                text-gray-700
              "
            >
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
                  id={`twofa-otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete={
                    index === 0
                      ? "one-time-code"
                      : "off"
                  }
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(
                      e.target.value,
                      index
                    )
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, index)
                  }
                  onPaste={handlePaste}
                  aria-label={`Verification digit ${
                    index + 1
                  }`}
                  className={`
                    h-12
                    w-11
                    rounded-xl
                    border
                    bg-white
                    text-center
                    text-lg
                    font-bold
                    text-gray-800
                    outline-none
                    transition-all
                    duration-200
                    sm:h-13
                    sm:w-12
                    ${
                      error
                        ? "border-red-300 focus:border-[#D71920] focus:ring-4 focus:ring-red-50"
                        : "border-gray-200 focus:border-[#D71920] focus:ring-4 focus:ring-red-50"
                    }
                  `}
                />
              ))}

            </div>

            {/* ================================================= */}
            {/* ERROR */}
            {/* ================================================= */}

            {error && (
              <p
                className="
                  mt-3
                  text-center
                  text-xs
                  font-medium
                  text-red-500
                "
              >
                ⚠ {error}
              </p>
            )}

            {/* ================================================= */}
            {/* RESEND CODE */}
            {/* ================================================= */}

            <div className="mt-6 text-center">

              <p
                className="
                  text-sm
                  text-gray-400
                "
              >
                Didn't receive the code?
              </p>

              {resendTimer > 0 ? (
                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-gray-400
                  "
                >
                  Resend code in{" "}
                  <span className="text-gray-500">
                    {formatTimer(resendTimer)}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-[#D71920]
                    transition-all
                    duration-200
                    hover:text-[#b9151b]
                    hover:underline
                  "
                >
                  Resend verification code
                </button>
              )}

            </div>

            {/* ================================================= */}
            {/* VERIFY BUTTON */}
            {/* ================================================= */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                group
                mt-7
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#D71920]
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-red-200
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#b9151b]
                hover:shadow-xl
                hover:shadow-red-200
                active:translate-y-0
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              {isSubmitting ? (
                <span
                  className="
                    h-5
                    w-5
                    animate-spin
                    rounded-full
                    border-2
                    border-white/30
                    border-t-white
                  "
                  aria-label="Verifying"
                />
              ) : (
                <>
                  <span>Verify & Login</span>

                  <span
                    className="
                      text-lg
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* ===================================================== */}
          {/* BACK TO LOGIN */}
          {/* ===================================================== */}

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
              mt-6
              block
              w-full
              text-center
              text-sm
              font-semibold
              text-gray-500
              transition-all
              duration-200
              hover:text-[#D71920]
              hover:underline
            "
          >
            ← Back to login
          </button>
        </div>

        {/* ======================================================= */}
        {/* SECURITY MESSAGE */}
        {/* ======================================================= */}

        <div
          className="
            mt-5
            flex
            items-center
            justify-center
            gap-2
            pb-4
            text-center
            text-xs
            font-medium
            text-gray-400
          "
        >
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

          <span>
            Your verification code keeps your account secure.
          </span>
        </div>
      </div>
    </div>
  );
}

export default TwoFactorVerification;
