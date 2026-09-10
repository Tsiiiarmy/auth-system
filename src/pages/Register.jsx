import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+251",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =====================================================
     COUNTRY CODES
  ===================================================== */

  const countries = [
    { name: "Ethiopia", code: "+251", digits: 9 },
    { name: "United States", code: "+1", digits: 10 },
    { name: "Canada", code: "+1", digits: 10 },
    { name: "United Kingdom", code: "+44", digits: 10 },
    { name: "India", code: "+91", digits: 10 },
    { name: "United Arab Emirates", code: "+971", digits: 9 },
    { name: "Saudi Arabia", code: "+966", digits: 9 },
    { name: "Kenya", code: "+254", digits: 9 },
    { name: "Uganda", code: "+256", digits: 9 },
    { name: "Tanzania", code: "+255", digits: 9 },
    { name: "South Africa", code: "+27", digits: 9 },
    { name: "Nigeria", code: "+234", digits: 10 },
    { name: "Ghana", code: "+233", digits: 9 },
    { name: "Australia", code: "+61", digits: 9 },
    { name: "Germany", code: "+49", digits: 10 },
    { name: "France", code: "+33", digits: 9 },
    { name: "Italy", code: "+39", digits: 10 },
    { name: "Spain", code: "+34", digits: 9 },
    { name: "Netherlands", code: "+31", digits: 9 },
    { name: "Turkey", code: "+90", digits: 10 },
    { name: "Japan", code: "+81", digits: 10 },
    { name: "China", code: "+86", digits: 11 },
    { name: "South Korea", code: "+82", digits: 10 },
    { name: "Brazil", code: "+55", digits: 11 },
    { name: "Mexico", code: "+52", digits: 10 },
  ];

  /* =====================================================
     VALIDATION HELPERS
  ===================================================== */

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  };

  const isValidName = (name) => {
    return /^[A-Za-zÀ-ÿ]+(?:[\s'-][A-Za-zÀ-ÿ]+)*$/.test(name.trim());
  };

  const getSelectedCountry = () => {
    return countries.find(
      (country) => country.code === formData.countryCode
    );
  };

  const hasConsecutiveNumbers = (password) => {
    const numbers = password.match(/\d/g);

    if (!numbers || numbers.length < 3) {
      return false;
    }

    const uniqueNumbers = [...new Set(numbers)];

    for (let i = 0; i < uniqueNumbers.length - 2; i++) {
      const a = Number(uniqueNumbers[i]);
      const b = Number(uniqueNumbers[i + 1]);
      const c = Number(uniqueNumbers[i + 2]);

      // Ascending: 123, 234, 345...
      if (b === a + 1 && c === b + 1) {
        return true;
      }

      // Descending: 321, 210, 987...
      if (b === a - 1 && c === b - 1) {
        return true;
      }
    }

    return false;
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          error = "Please enter your full name.";
        } else if (!isValidName(value)) {
          error = "Name can only contain letters, spaces, apostrophes or hyphens.";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Please enter your email address.";
        } else if (!isValidEmail(value)) {
          error = "Please enter a valid email address.";
        }
        break;

      case "phone": {
        const country = getSelectedCountry();
        const digitsOnly = value.replace(/\D/g, "");

        if (!value.trim()) {
          error = "Please enter your phone number.";
        } else if (!country) {
          error = "Please select a valid country code.";
        } else if (digitsOnly.length !== country.digits) {
          error = `Phone number must contain ${country.digits} digits for ${country.name}.`;
        }

        break;
      }

      case "password":
        if (!value) {
          error = "Please create a password.";
        } else if (value.length < 8) {
          error = "Password must contain at least 8 characters.";
        } else if (!/[A-Z]/.test(value)) {
          error = "Password must contain at least one uppercase letter.";
        } else if (!/[0-9]/.test(value)) {
          error = "Password must contain at least one number.";
        } else if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;'`~]/.test(value)) {
          error = "Password must contain at least one special character.";
        } else if (hasConsecutiveNumbers(value)) {
          error = "Password cannot contain consecutive numbers such as 123 or 321.";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password.";
        } else if (value !== formData.password) {
          error = "Passwords do not match.";
        }
        break;

      default:
        break;
    }

    return error;
  };

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "phone") {
      // Only allow numbers
      newValue = value.replace(/\D/g, "");
    }

    if (name === "fullName") {
      // Don't allow numbers in the name field
      newValue = value.replace(/[0-9]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue),
      }));
    }

    // Confirm password must update when password changes
    if (name === "password" && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          formData.confirmPassword !== newValue
            ? "Passwords do not match."
            : "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  /* =====================================================
     PASSWORD REQUIREMENTS
  ===================================================== */

  const passwordRequirements = [
    {
      label: "At least 8 characters",
      valid: formData.password.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(formData.password),
    },
    {
      label: "One number",
      valid: /[0-9]/.test(formData.password),
    },
    {
      label: "One special character",
      valid: /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;'`~]/.test(
        formData.password
      ),
    },
    {
      label: "No consecutive numbers",
      valid:
        formData.password.length > 0 &&
        !hasConsecutiveNumbers(formData.password),
    },
  ];

  /* =====================================================
     FORM SUBMIT
  ===================================================== */

    const handleSubmit = async (e) => {
      e.preventDefault();

      const newErrors = {};

      Object.keys(formData).forEach((field) => {
        const error = validateField(field, formData[field]);

        if (error) {
          newErrors[field] = error;
        }
      });

      setErrors(newErrors);

      setTouched({
        fullName: true,
        email: true,
        phone: true,
        password: true,
        confirmPassword: true,
      });

      // Stop if frontend validation fails
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsSubmitting(true);

      try {
        // Combine country code and phone number
        const fullPhoneNumber =
          `${formData.countryCode}${formData.phone}`.replace(/\s/g, "");

        const registrationData = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phoneNumber: fullPhoneNumber,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        };

        console.log("Sending registration request:", {
          ...registrationData,
          password: "[HIDDEN]",
          confirmPassword: "[HIDDEN]",
        });

        await registerUser(registrationData);

        // Save email temporarily so the verification page knows
        // which account is being verified.
        sessionStorage.setItem(
          "registrationEmail",
          registrationData.email
        );

        // Save phone temporarily for phone verification
        sessionStorage.setItem(
          "registrationPhone",
          registrationData.phoneNumber
        );

        // Registration succeeded
        navigate("/verify-email");

      } catch (error) {
        console.error("Registration error:", error);

        setErrors({
          submit: error.message || "Registration failed. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    };


  /* =====================================================
     INPUT STYLE
  ===================================================== */

  const inputClass = (field) => `
    w-full
    h-11
    rounded-lg
    border
    px-3
    text-sm
    text-gray-800
    bg-white
    outline-none
    transition-all duration-300
    placeholder:text-gray-400

    ${
      errors[field] && touched[field]
        ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-500/10"
        : "border-gray-300 focus:border-[#D71920] focus:ring-2 focus:ring-[#D71920]/10"
    }

    hover:border-gray-400
  `;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 sm:py-12">

      {/* =====================================================
          BACKGROUND DECORATIONS
      ===================================================== */}

      <div className="fixed -top-32 -left-32 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="fixed -bottom-40 -right-40 w-120 h-120 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />


      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative w-full max-w-125">

        {/* ================= BACK BUTTON ================= */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="
            group
            mb-5
            flex items-center gap-2
            text-sm
            font-medium
            text-gray-500

            transition-all duration-300
            hover:text-[#D71920]
            hover:-translate-x-1
          "
        >
          <span
            className="
              text-lg
              transition-transform duration-300
              group-hover:-translate-x-1
            "
          >
            ←
          </span>

          <span>Back</span>
        </button>


        {/* =====================================================
            PROGRESS
        ===================================================== */}

        <div className="mb-8">

          <div className="flex items-center">

            {/* Step 1 */}
            <div className="flex flex-1 flex-col items-center">

              <div className="flex items-center w-full">

                <div className="h-0.5 flex-1 bg-transparent" />

                <div
                  className="
                    flex h-7 w-7
                    items-center justify-center
                    rounded-full
                    bg-[#D71920]
                    text-xs
                    font-bold
                    text-white
                    shadow-md
                    shadow-red-500/20
                  "
                >
                  1
                </div>

                <div className="h-0.5 flex-1 bg-gray-200" />

              </div>

              <span className="mt-2 text-xs font-semibold text-[#D71920]">
                Account
              </span>

            </div>


            {/* Step 2 */}
            <div className="flex flex-1 flex-col items-center">

              <div className="flex items-center w-full">

                <div className="h-0.5 flex-1 bg-gray-200" />

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-white">
                  2
                </div>

                <div className="h-0.5 flex-1 bg-gray-200" />

              </div>

              <span className="mt-2 text-xs text-gray-400">
                Verify Email
              </span>

            </div>


            {/* Step 3 */}
            <div className="flex flex-1 flex-col items-center">

              <div className="flex items-center w-full">

                <div className="h-0.5 flex-1 bg-gray-200" />

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-white">
                  3
                </div>

                <div className="h-0.5 flex-1 bg-gray-200" />

              </div>

              <span className="mt-2 text-xs text-gray-400">
                Verify Phone
              </span>

            </div>


            {/* Step 4 */}
            <div className="flex flex-1 flex-col items-center">

              <div className="flex items-center w-full">

                <div className="h-0.5 flex-1 bg-gray-200" />

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-white">
                  4
                </div>

              </div>

              <span className="mt-2 text-xs text-gray-400">
                Complete
              </span>

            </div>

          </div>

        </div>


        {/* =====================================================
            REGISTRATION CARD
        ===================================================== */}

        <div
          className="
            w-full
            rounded-2xl
            border border-gray-200
            bg-white
            px-6 sm:px-8
            py-7 sm:py-8
            shadow-xl shadow-gray-200/50

            transition-all duration-500
            hover:shadow-2xl hover:shadow-gray-200/70
          "
        >

          {/* ================= HEADING ================= */}

          <div className="mb-7 text-center">

            <div
              className="
                mx-auto mb-4
                flex h-12 w-12
                items-center justify-center
                rounded-xl
                bg-red-50
                text-[#D71920]
                text-xl
                shadow-sm
              "
            >
              ✦
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              Create Your Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Enter your details to get started securely.
            </p>

          </div>


          {/* ================= FORM ================= */}

          <form onSubmit={handleSubmit} className="space-y-5">


            {/* ================= FULL NAME ================= */}

            <div>

              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your full name"
                className={inputClass("fullName")}
                autoComplete="name"
              />

              {errors.fullName && touched.fullName && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  ⚠ {errors.fullName}
                </p>
              )}

            </div>


            {/* ================= EMAIL ================= */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className={inputClass("email")}
                autoComplete="email"
              />

              {errors.email && touched.email && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  ⚠ {errors.email}
                </p>
              )}

            </div>


            {/* ================= PHONE ================= */}

            <div>

              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Phone Number
              </label>

              <div className="flex gap-2">

                {/* Searchable country code */}

                <input
                  list="country-codes"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+251"
                  className="
                    h-11
                    w-26.25
                    rounded-lg
                    border border-gray-300
                    bg-white
                    px-3
                    text-sm
                    text-gray-800
                    outline-none

                    transition-all duration-300
                    focus:border-[#D71920]
                    focus:ring-2
                    focus:ring-[#D71920]/10
                    hover:border-gray-400
                  "
                />

                <datalist id="country-codes">

                  {countries.map((country, index) => (
                    <option
                      key={`${country.code}-${index}`}
                      value={country.code}
                      label={`${country.name} (${country.code})`}
                    />
                  ))}

                </datalist>


                {/* Phone */}

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="911 123 456"
                  className={inputClass("phone")}
                  autoComplete="tel"
                />

              </div>

              <p className="mt-1.5 text-[11px] text-gray-400">
                Search or enter a country code such as +251.
              </p>

              {errors.phone && touched.phone && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  ⚠ {errors.phone}
                </p>
              )}

            </div>


            {/* ================= PASSWORD ================= */}

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
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
                  placeholder="Create a strong password" 
                  className={`${inputClass("password")} pr-12`} 
                  autoComplete="new-password" 
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


              {/* Password requirements */}

              <div className="mt-3 rounded-lg bg-gray-50 border border-gray-100 p-3">

                <p className="mb-2 text-xs font-semibold text-gray-600">
                  Password requirements
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">

                  {passwordRequirements.map((requirement) => (

                    <div
                      key={requirement.label}
                      className={`
                        flex items-center gap-2
                        text-[11px]
                        transition-colors duration-200
                        ${
                          requirement.valid
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      `}
                    >

                      <span
                        className={`
                          flex h-4 w-4
                          items-center justify-center
                          rounded-full
                          text-[9px]
                          font-bold
                          transition-all duration-200
                          ${
                            requirement.valid
                              ? "bg-green-100 text-green-600 scale-105"
                              : "bg-gray-200 text-gray-400"
                          }
                        `}
                      >
                        {requirement.valid ? "✓" : "•"}
                      </span>

                      {requirement.label}

                    </div>

                  ))}

                </div>

              </div>

              {errors.password && touched.password && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  ⚠ {errors.password}
                </p>
              )}

            </div>


            {/* ================= CONFIRM PASSWORD ================= */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your password again"
                className={inputClass("confirmPassword")}
                autoComplete="new-password"
              />

              {formData.confirmPassword &&
                !errors.confirmPassword &&
                formData.confirmPassword === formData.password && (
                  <p className="mt-1.5 text-xs font-medium text-green-600">
                    ✓ Passwords match
                  </p>
                )}

              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  ⚠ {errors.confirmPassword}
                </p>
              )}

              {errors.submit && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-600">
                    ⚠ {errors.submit}
                  </p>
                </div>
              )}

            </div>


            {/* ================= CONTINUE ================= */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                group
                relative
                mt-2
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                overflow-hidden
                rounded-lg
                bg-[#D71920]
                text-sm
                font-bold
                text-white

                shadow-lg
                shadow-red-600/15

                transition-all duration-300
                hover:bg-[#b9151b]
                hover:-translate-y-0.5
                hover:shadow-xl
                hover:shadow-red-600/25

                active:scale-[0.98]
              "
            >


        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span
              className="
                h-4 w-4
                animate-spin
                rounded-full
                border-2
                border-white/30
                border-t-white
              "
            />
            Creating account...
          </span>
        ) : (
          <>
            <span>Continue</span>
            <span
              className="
                text-lg
                transition-transform duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </>
        )}

            </button>


            {/* ================= DIVIDER ================= */}

            <div className="flex items-center gap-3 py-1">

              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs text-gray-400">
                OR
              </span>

              <div className="h-px flex-1 bg-gray-200" />

            </div>


            {/* ================= GOOGLE ================= */}

            <button
              type="button"
              onClick={() => {
                window.location.href =
                 "/oauth2/authorization/google";
              }}
              className="
                group
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-3
                rounded-lg
                border border-gray-300
                bg-white
                text-sm
                font-semibold
                text-gray-700

                transition-all duration-300
                hover:border-gray-400
                hover:bg-gray-50
                hover:-translate-y-0.5
                hover:shadow-md

                active:scale-[0.98]
              "
            >

              {/* Google icon */}

              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.68-.06-1.34-.17-1.97H12v3.73h5.23a4.47 4.47 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.92-4.18 2.92-7.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 21.75c2.63 0 4.84-.87 6.45-2.33l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.55 0-4.71-1.72-5.49-4.04H3.27v2.53A9.75 9.75 0 0 0 12 21.75z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.51 13.85a5.87 5.87 0 0 1 0-3.7V7.62H3.27a9.75 9.75 0 0 0 0 8.76l3.24-2.53z"
                />
                <path
                  fill="#EA4335"
                  d="M12 6.11c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.21 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.73 5.37l3.24 2.53C7.29 7.83 9.45 6.11 12 6.11z"
                />
              </svg>

              Continue with Google

            </button>

          </form>


          {/* ================= LOGIN ================= */}

          <p className="mt-6 text-center text-sm text-gray-500">

            Already have an account?{" "}

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                font-semibold
                text-[#D71920]
                transition-all duration-200
                hover:text-[#b9151b]
                hover:underline
                underline-offset-2
              "
            >
              Login
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;

