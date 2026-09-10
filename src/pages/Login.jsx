import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";

const countries = [
  { name: "Ethiopia", code: "+251", digits: 9 },
  { name: "United States", code: "+1", digits: 10 },
  { name: "Canada", code: "+1", digits: 10 },
  { name: "United Kingdom", code: "+44", digits: 10 },
  { name: "Germany", code: "+49", digits: 10 },
  { name: "France", code: "+33", digits: 9 },
  { name: "Italy", code: "+39", digits: 10 },
  { name: "Spain", code: "+34", digits: 9 },
  { name: "Australia", code: "+61", digits: 9 },
  { name: "India", code: "+91", digits: 10 },
  { name: "China", code: "+86", digits: 11 },
  { name: "Japan", code: "+81", digits: 10 },
  { name: "South Korea", code: "+82", digits: 9 },
  { name: "United Arab Emirates", code: "+971", digits: 9 },
  { name: "Saudi Arabia", code: "+966", digits: 9 },
  { name: "Kenya", code: "+254", digits: 9 },
  { name: "Uganda", code: "+256", digits: 9 },
  { name: "Tanzania", code: "+255", digits: 9 },
  { name: "Nigeria", code: "+234", digits: 10 },
  { name: "South Africa", code: "+27", digits: 9 },
];

function Login() {
  const navigate = useNavigate();

  const [loginMethod, setLoginMethod] = useState("email");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    countryCode: "+251",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -----------------------------
  // Validation helpers
  // -----------------------------

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidUsername = (username) => {
    return /^[A-Za-z0-9._-]{3,30}$/.test(username);
  };

  const getSelectedCountry = () => {
    return countries.find(
      (country) => country.code === formData.countryCode
    );
  };

  const validateField = (name, value) => {
    switch (name) {
      case "identifier":
        if (!value.trim()) {
          return loginMethod === "email"
            ? "Email or username is required."
            : "Phone number is required.";
        }

        // Email / Username validation
        if (loginMethod === "email") {
          const emailValid = isValidEmail(value.trim());
          const usernameValid = isValidUsername(value.trim());

          if (!emailValid && !usernameValid) {
            return "Enter a valid email address or username.";
          }
        }

        // Phone validation
        if (loginMethod === "phone") {
          const selectedCountry = getSelectedCountry();

          if (!/^\d+$/.test(value)) {
            return "Phone number can only contain digits.";
          }

          if (
            selectedCountry &&
            value.length !== selectedCountry.digits
          ) {
            return `Phone number must contain exactly ${selectedCountry.digits} digits.`;
          }
        }

        return "";

      case "password":
        if (!value) {
          return "Password is required.";
        }

        if (value.length < 8) {
          return "Password must contain at least 8 characters.";
        }

        return "";

      default:
        return "";
    }
  };

  // -----------------------------
  // Input change
  // -----------------------------

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = type === "checkbox" ? checked : value;

    if (name === "identifier" && loginMethod === "phone") {
      newValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (touched[name] && type !== "checkbox") {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue),
      }));
    }
  };

  // -----------------------------
  // Input blur
  // -----------------------------

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (name !== "countryCode") {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  // -----------------------------
  // Change login method
  // -----------------------------

  const changeLoginMethod = (method) => {
    setLoginMethod(method);

    setFormData((prev) => ({
      ...prev,
      identifier: "",
    }));

    setErrors({});
    setTouched({});
  };

  // -----------------------------
  // Submit
  // -----------------------------

    const handleSubmit = async (e) => {
      e.preventDefault();

      const identifierError = validateField(
        "identifier",
        formData.identifier
      );

      const passwordError = validateField(
        "password",
        formData.password
      );

      const newErrors = {};

      if (identifierError) {
        newErrors.identifier = identifierError;
      }

      if (passwordError) {
        newErrors.password = passwordError;
      }

      setErrors(newErrors);

      setTouched({
        identifier: true,
        password: true,
      });

      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsSubmitting(true);
      setErrors({});

      try {
        const identifier =
          loginMethod === "phone"
            ? `${formData.countryCode}${formData.identifier}`.replace(/\s/g, "")
            : formData.identifier.trim();

        const result = await loginUser(
          identifier,
          formData.password
        );

        // Normal login — no 2FA required
        if (formData.rememberMe) {
          localStorage.setItem("token", result.token);
          sessionStorage.removeItem("token");
        } else {
          sessionStorage.setItem("token", result.token);
          localStorage.removeItem("token");
        }

        sessionStorage.removeItem("loginEmail");
        sessionStorage.removeItem("loginRememberMe");

        navigate("/dashboard");

      } catch (error) {

        if (error.message === "2FA verification required") {

          /*
          * The backend has already generated and sent
          * the 2FA code at this point.
          *
          * Save the information needed by the 2FA page
          * BEFORE navigating away.
          */

          let emailFor2FA = "";

          if (loginMethod === "email") {
            emailFor2FA = formData.identifier.trim().toLowerCase();
          }

          sessionStorage.setItem(
            "loginEmail",
            emailFor2FA
          );

          sessionStorage.setItem(
            "loginRememberMe",
            String(formData.rememberMe)
          );

          navigate("/2fa-verification");

          return;
        }

        setErrors({
          submit:
            error.message ||
            "Login failed. Please try again.",
        });

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
        {/* Progress Indicator                */}
        {/* Login = Complete                 */}
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

            {/* Step 3 - Completed */}
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
                Verify Phone
              </span>
            </div>

            {/* Connector */}
            <div className="mx-2 h-px flex-1 bg-gray-200 sm:mx-3" />

            {/* Step 4 - Active / Complete */}
            <div className="flex flex-col items-center">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-red-600
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                "
              >
                4
              </div>

              <span
                className="
                  mt-2
                  text-xs
                  font-medium
                  text-red-600
                  sm:text-sm
                "
              >
                Complete
              </span>
            </div>

          </div>
        </div>

        {/* -------------------------------- */}
        {/* Main Card                         */}
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

          <div className="mb-7 text-center">

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
                text-2xl
                transition-all
                duration-300
                hover:scale-105
                hover:bg-red-100
              "
            >
              🔐
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
              Welcome Back
            </h1>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-gray-500
                sm:text-base
              "
            >
              Sign in to continue to your secure account.
            </p>

          </div>

          {/* -------------------------------- */}
          {/* Login Method Tabs                 */}
          {/* -------------------------------- */}

          <div className="mb-6">
            <div className="flex rounded-xl bg-gray-100 p-1">

              {/* Email / Username */}
              <button
                type="button"
                onClick={() => changeLoginMethod("email")}
                className={`
                  flex-1
                  rounded-lg
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  ${
                    loginMethod === "email"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                Email / Username
              </button>

              {/* Phone */}
              <button
                type="button"
                onClick={() => changeLoginMethod("phone")}
                className={`
                  flex-1
                  rounded-lg
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  ${
                    loginMethod === "phone"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                Phone Number
              </button>

            </div>
          </div>

          {/* -------------------------------- */}
          {/* Form                              */}
          {/* -------------------------------- */}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Country Code */}
            {loginMethod === "phone" && (
              <div>
                <label
                  htmlFor="countryCode"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  Country Code
                </label>

                <input
                  id="countryCode"
                  name="countryCode"
                  list="country-codes"
                  value={formData.countryCode}
                  onChange={handleChange}
                  placeholder="+251"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    text-sm
                    text-gray-700
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-gray-400
                    focus:border-red-300
                    focus:ring-4
                    focus:ring-red-50
                  "
                />

                <datalist id="country-codes">
                  {countries.map((country) => (
                    <option
                      key={`${country.name}-${country.code}`}
                      value={country.code}
                    >
                      {country.name}
                    </option>
                  ))}
                </datalist>
              </div>
            )}

            {/* Identifier */}
            <div>
              <label
                htmlFor="identifier"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                {loginMethod === "email"
                  ? "Email or Username"
                  : "Phone Number"}
              </label>

              <input
                id="identifier"
                name="identifier"
                type={
                  loginMethod === "phone"
                    ? "tel"
                    : "text"
                }
                value={formData.identifier}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={
                  loginMethod === "email"
                    ? "Enter your email or username"
                    : "Enter your phone number"
                }
                className={`
                  h-11
                  w-full
                  rounded-xl
                  border
                  bg-white
                  px-4
                  text-sm
                  text-gray-700
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-gray-400
                  focus:ring-4
                  ${
                    errors.identifier &&
                    touched.identifier
                      ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                      : "border-gray-200 focus:border-red-300 focus:ring-red-50"
                  }
                `}
              />

              {errors.identifier &&
                touched.identifier && (
                  <p
                    className="
                      mt-2
                      text-xs
                      font-medium
                      text-red-500
                    "
                  >
                    ⚠ {errors.identifier}
                  </p>
                )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Password
              </label>

             <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              className={`
                h-11
                w-full
                rounded-xl
                border
                bg-white
                px-4
                pr-12
                text-sm
                text-gray-700
                outline-none
                transition-all
                duration-200
                placeholder:text-gray-400
                focus:ring-4
                ${
                  errors.password &&
                  touched.password
                    ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                    : "border-gray-200 focus:border-red-300 focus:ring-red-50"
                }
              `}
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
                  aria-hidden="true"
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
                  aria-hidden="true"
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

              {errors.password &&
                touched.password && (
                  <p
                    className="
                      mt-2
                      text-xs
                      font-medium
                      text-red-500
                    "
                  >
                    ⚠ {errors.password}
                  </p>
                )}
            </div>

            {/* Remember Me / Forgot Password */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <label
                className="
                  group
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                "
              >
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="
                    h-4
                    w-4
                    cursor-pointer
                    rounded
                    border-gray-300
                    accent-red-600
                  "
                />

                <span
                  className="
                    text-sm
                    text-gray-500
                    transition-colors
                    group-hover:text-gray-700
                  "
                >
                  Remember me
                </span>
              </label>

            <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm font-medium text-[#D71920] hover:underline"
              >
                Forgot password?
            </button>
            </div>


              {errors.submit && (
                  <div
                    className="
                      rounded-xl
                      border
                      border-red-200
                      bg-red-50
                      px-4
                      py-3
                      text-sm
                      font-medium
                      text-red-600
                    "
                  >
                    ⚠ {errors.submit}
                  </div>
                )}  
                
            {/* -------------------------------- */}
            {/* Login Button                      */}
            {/* -------------------------------- */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                group
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-red-600
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-red-200
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-red-700
                hover:shadow-xl
                hover:shadow-red-200
                active:translate-y-0
                active:scale-[0.99]
              "
            >

          {isSubmitting ? (
            <span
              className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
              aria-label="Loading"
            />
          ) : (
            <>
              <span>Sign In</span>

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

          {/* -------------------------------- */}
          {/* Divider                           */}
          {/* -------------------------------- */}

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs font-medium text-gray-400">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* -------------------------------- */}
          {/* Google Login                      */}
          {/* -------------------------------- */}

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "http://localhost:8080/oauth2/authorization/google";
            }}
            className="
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-3
              rounded-xl
              border
              border-gray-200
              bg-white
              text-sm
              font-semibold
              text-gray-700
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-gray-300
              hover:bg-gray-50
              hover:shadow-md
              active:translate-y-0
            "
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.805 10.023H12v3.954h5.64c-.243 1.27-.97 2.347-2.068 3.068v2.548h3.347c1.96-1.805 3.086-4.467 3.086-7.61 0-.724-.065-1.425-.2-1.96Z"
                fill="#4285F4"
              />

              <path
                d="M12 22c2.805 0 5.16-.93 6.88-2.407l-3.347-2.548c-.93.624-2.117.993-3.533.993-2.717 0-5.023-1.837-5.846-4.307H2.694v2.63A10.39 10.39 0 0 0 12 22Z"
                fill="#34A853"
              />

              <path
                d="M6.154 13.731A6.25 6.25 0 0 1 5.827 12c0-.6.103-1.183.327-1.731v-2.63H2.694A10.003 10.003 0 0 0 1.61 12c0 1.61.386 3.133 1.084 4.361l3.46-2.63Z"
                fill="#FBBC05"
              />

              <path
                d="M12 5.962c1.528 0 2.897.526 3.977 1.558l2.98-2.98C17.155 2.915 14.8 2 12 2a10.39 10.39 0 0 0-9.306 5.639l3.46 2.63C6.977 7.8 9.283 5.962 12 5.962Z"
                fill="#EA4335"
              />
            </svg>

            Continue with Google
          </button>

          {/* -------------------------------- */}
          {/* Register Link                     */}
          {/* -------------------------------- */}

          <div className="mt-7 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="
                  font-semibold
                  text-red-600
                  transition-colors
                  duration-200
                  hover:text-red-700
                  hover:underline
                "
              >
                Create an account
              </button>
            </p>
          </div>

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
          🔒 Your account is protected with secure authentication.
        </p>

      </div>
    </div>
  );
}

export default Login;

