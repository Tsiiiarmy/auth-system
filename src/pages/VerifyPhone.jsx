import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyPhone } from "../utils/api";

function VerifyPhone() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = useRef([]);

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
    // Only allow numbers
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

    const newOtp = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pastedValue.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setError("");

    const nextIndex = Math.min(
      pastedValue.length,
      5
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

    // Later this will call the backend
    // to send a new SMS verification code.
    console.log("Resending phone verification code");

    setOtp([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

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

      const phoneNumber = sessionStorage.getItem("registrationPhone");

      if (!phoneNumber) {
        setError("Phone number not found. Please register again.");
        return;
      }

      setIsSubmitting(true);
      setError("");

      try {
        console.log("Verifying phone:", phoneNumber);

        await verifyPhone(phoneNumber, enteredOtp);

        sessionStorage.setItem("phoneVerified", "true");

        navigate("/registration-complete");
      } catch (error) {
        console.error("Phone verification error:", error);

        setError(
          error.message ||
            "Phone verification failed. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    };



  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:py-10">

      {/* -------------------------------- */}
      {/* Soft Background Glow             */}
      {/* -------------------------------- */}

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

      {/* -------------------------------- */}
      {/* Main Container                    */}
      {/* -------------------------------- */}

      <div className="relative mx-auto w-full max-w-125">

        {/* -------------------------------- */}
        {/* Back Button                       */}
        {/* -------------------------------- */}

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

        {/* -------------------------------- */}
        {/* Registration Progress             */}
        {/* Step 3 Active                    */}
        {/* -------------------------------- */}

        <div className="mb-7 px-2 sm:px-4">
          <div className="flex items-center">

            {/* Step 1 - Completed */}
            <div className="flex flex-col items-center">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-200
                  text-sm
                  font-semibold
                  text-white
                "
              >
                ✓
              </div>

              <span
                className="
                  mt-2
                  text-xs
                  font-medium
                  text-gray-400
                  sm:text-sm
                "
              >
                Account
              </span>
            </div>

            {/* Connector */}
            <div className="mx-2 h-px flex-1 bg-gray-200 sm:mx-3" />

            {/* Step 2 - Completed */}
            <div className="flex flex-col items-center">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-200
                  text-sm
                  font-semibold
                  text-white
                "
              >
                ✓
              </div>

              <span
                className="
                  mt-2
                  text-xs
                  font-medium
                  text-gray-400
                  sm:text-sm
                "
              >
                Verify Email
              </span>
            </div>

            {/* Connector */}
            <div className="mx-2 h-px flex-1 bg-gray-200 sm:mx-3" />

            {/* Step 3 - Active */}
            <div className="flex flex-col items-center">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[#D71920]
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                "
              >
                3
              </div>

              <span
                className="
                  mt-2
                  text-xs
                  font-medium
                  text-[#D71920]
                  sm:text-sm
                "
              >
                Verify Phone
              </span>
            </div>

            {/* Connector */}
            <div className="mx-2 h-px flex-1 bg-gray-200 sm:mx-3" />

            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-200
                  text-sm
                  font-semibold
                  text-white
                "
              >
                4
              </div>

              <span
                className="
                  mt-2
                  text-xs
                  font-medium
                  text-gray-400
                  sm:text-sm
                "
              >
                Complete
              </span>
            </div>

          </div>
        </div>

        {/* -------------------------------- */}
        {/* Verification Card                 */}
        {/* -------------------------------- */}

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

          {/* -------------------------------- */}
          {/* Header                            */}
          {/* -------------------------------- */}

          <div className="text-center">

            {/* Phone Icon */}
            <div
              className="
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
                width="32"
                height="32"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Phone */}
                <rect
                  x="13"
                  y="5"
                  width="20"
                  height="38"
                  rx="3"
                  stroke="#D71920"
                  strokeWidth="2.5"
                />

                {/* Speaker */}
                <path
                  d="M20 9H26"
                  stroke="#D71920"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Home indicator */}
                <path
                  d="M20 38H26"
                  stroke="#D71920"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Signal */}
                <path
                  d="M37 14C39 16 40 19 40 22"
                  stroke="#D71920"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <path
                  d="M34 17C35.5 18.5 36 20 36 22"
                  stroke="#D71920"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-gray-800
                sm:text-3xl
              "
            >
              Verify Your Phone
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
              We've sent a 6-digit verification code
              to your phone number.
            </p>

          </div>

          {/* -------------------------------- */}
          {/* Phone Number                      */}
          {/* -------------------------------- */}

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
              {sessionStorage.getItem("registrationPhone") || "your phone number"}
            </p>
          </div>

          {/* -------------------------------- */}
          {/* OTP Form                          */}
          {/* -------------------------------- */}

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
                  id={`phone-otp-${index}`}
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

            {/* Error */}
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

            {/* -------------------------------- */}
            {/* Resend Code                       */}
            {/* -------------------------------- */}

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

            {/* -------------------------------- */}
            {/* Verify Button                     */}
            {/* -------------------------------- */}

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
              "
            >
              {isSubmitting ? "Verifying..." : "Verify & Continue"}

              {!isSubmitting && (
              <span
                className="
                  transition-transform
                  duration-200
                  group-hover:translate-x-1
                "
              >
                →
              </span>
              )}
            </button>

          </form>

          {/* -------------------------------- */}
          {/* Change Phone Number               */}
          {/* -------------------------------- */}

          <button
            type="button"
            onClick={() => navigate("/register")}
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
            ← Change phone number
          </button>

        </div>

        {/* -------------------------------- */}
        {/* Security Message                  */}
        {/* -------------------------------- */}

        <p
          className="
            mt-4
            text-center
            text-xs
            font-medium
            text-gray-400
          "
        >
          🔒 Your verification code keeps your account secure.
        </p>

      </div>
    </div>
  );
}

export default VerifyPhone;

