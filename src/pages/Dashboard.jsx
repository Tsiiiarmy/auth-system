import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------
  // Fetch current user
  // --------------------------------

  useEffect(() => {
    const fetchUser = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load user information.");
        }

        const data = await response.json();

        console.log("CURRENT USER:", data);

        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // --------------------------------
  // Logout
  // --------------------------------

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  // --------------------------------
  // User initials
  // --------------------------------

  const getInitials = (name) => {
    if (!name) return "U";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 font-sans">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#D71920]" />

          <p className="mt-4 text-sm font-semibold text-gray-600">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials = getInitials(user.fullName);
  const allVerified = user.emailVerified && user.phoneVerified;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* =========================================
          SHARED NAVIGATION
      ========================================= */}

      <Sidebar user={user} onLogout={handleLogout} />

      {/* =========================================
          SOFT BACKGROUND GLOW
      ========================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="relative min-h-screen lg:ml-64">
        <div className="mx-auto max-w-7xl px-4 pb-28 pt-24 sm:px-6 lg:px-8 lg:pb-10 lg:pt-10">

          {/* =====================================
              TOP HEADER
          ===================================== */}

          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold text-[#D71920]">
                Account dashboard
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
                Welcome back, {user.fullName?.split(" ")[0] || "User"}!
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
                Manage your account and keep your security settings up to date.
              </p>
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-gray-800">
                  {user.fullName}
                </p>

                <p className="text-xs font-medium text-gray-500">
                  {user.email}
                </p>
              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-[#D71920]
                  text-sm
                  font-bold
                  text-white
                  shadow-md
                  shadow-red-200
                "
              >
                {initials}
              </div>
            </div>
          </div>

          {/* =====================================
              ACCOUNT STATUS BANNER
          ===================================== */}

          <div
            className={`
              mb-6
              rounded-2xl
              border
              px-5
              py-4
              transition-all
              duration-300
              ${
                allVerified
                  ? "border-green-100 bg-green-50/70"
                  : "border-red-100 bg-red-50/70"
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div
                className={`
                  mt-0.5
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  ${
                    allVerified
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-[#D71920]"
                  }
                `}
              >
                {allVerified ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v4"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 17h.01"
                    />

                    <circle cx="12" cy="12" r="9" />
                  </svg>
                )}
              </div>

              <div>
                <p
                  className={`
                    text-sm
                    font-bold
                    ${allVerified ? "text-green-700" : "text-[#D71920]"}
                  `}
                >
                  {allVerified
                    ? "Your account is verified"
                    : "Your account needs attention"}
                </p>

                <p className="mt-1 text-sm leading-5 text-gray-600">
                  {allVerified
                    ? "Your email address and phone number have both been verified."
                    : "Please complete the required verification steps to secure your account."}
                </p>
              </div>
            </div>
          </div>

          {/* =====================================
              ACCOUNT OVERVIEW
          ===================================== */}

          <section className="mb-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Account Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your current account information.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Personal Information */}

              <div
                className="
                  group
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-5
                  shadow-xl
                  shadow-gray-200/40
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-xl
                "
              >
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-red-50
                      text-[#D71920]
                      transition-all
                      duration-200
                      group-hover:scale-105
                      group-hover:bg-red-100
                    "
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 21a8 8 0 00-16 0"
                      />

                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-800">
                      Personal Information
                    </h3>

                    <p className="text-xs font-medium text-gray-500">
                      Your registered details
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      Full name
                    </p>

                    <p className="mt-1 text-base font-semibold text-gray-800">
                      {user.fullName || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      Email address
                    </p>

                    <p className="mt-1 break-all text-base font-semibold text-gray-800">
                      {user.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      Phone number
                    </p>

                    <p className="mt-1 text-base font-semibold text-gray-800">
                      {user.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Status */}

              <div
                className="
                  group
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-5
                  shadow-xl
                  shadow-gray-200/40
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-xl
                "
              >
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-red-50
                      text-[#D71920]
                      transition-all
                      duration-200
                      group-hover:scale-105
                      group-hover:bg-red-100
                    "
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3l8 4v5c0 5-3.4 8.7-8 9-4.6-.3-8-4-8-9V7l8-4z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-800">
                      Verification Status
                    </h3>

                    <p className="text-xs font-medium text-gray-500">
                      Account verification
                    </p>
                  </div>
                </div>

                <div className="space-y-3">

                  {/* Email */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-gray-100
                      bg-gray-50
                      px-4
                      py-3
                    "
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Email verification
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-bold
                        ${
                          user.emailVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-[#D71920]"
                        }
                      `}
                    >
                      {user.emailVerified ? "Verified" : "Not verified"}
                    </span>
                  </div>

                  {/* Phone */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-gray-100
                      bg-gray-50
                      px-4
                      py-3
                    "
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Phone verification
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {user.phoneNumber || "No phone number"}
                      </p>
                    </div>

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-bold
                        ${
                          user.phoneVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-[#D71920]"
                        }
                      `}
                    >
                      {user.phoneVerified ? "Verified" : "Not verified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================
              SECURITY
          ===================================== */}

          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Security
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Keep your account protected.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/security")}
                className="
                  hidden
                  text-sm
                  font-bold
                  text-[#D71920]
                  transition-all
                  duration-200
                  hover:text-[#b9151b]
                  hover:underline
                  sm:block
                "
              >
                Manage security →
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Password */}

              <div
                className="
                  group
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-5
                  shadow-xl
                  shadow-gray-200/40
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-xl
                "
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-red-50
                        text-[#D71920]
                        transition-all
                        duration-200
                        group-hover:scale-105
                        group-hover:bg-red-100
                      "
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="4"
                          y="10"
                          width="16"
                          height="10"
                          rx="2"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 10V7a4 4 0 018 0v3"
                        />
                      </svg>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-gray-800">
                        Password
                      </h3>

                      <p className="mt-0.5 text-sm text-gray-500">
                        Your password is protected.
                      </p>
                    </div>
                  </div>

                  <span
                    className="
                      rounded-full
                      bg-green-100
                      px-3
                      py-1
                      text-xs
                      font-bold
                      text-green-700
                    "
                  >
                    Protected
                  </span>
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/security")}
                    className="
                      text-sm
                      font-bold
                      text-[#D71920]
                      transition-all
                      duration-200
                      hover:text-[#b9151b]
                      hover:underline
                    "
                  >
                    Change password →
                  </button>
                </div>
              </div>

              {/* Two Factor Authentication */}

              <div
                className="
                  group
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-5
                  shadow-xl
                  shadow-gray-200/40
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-xl
                "
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-red-50
                        text-[#D71920]
                        transition-all
                        duration-200
                        group-hover:scale-105
                        group-hover:bg-red-100
                      "
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="5"
                          y="11"
                          width="14"
                          height="9"
                          rx="2"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 11V8a4 4 0 018 0v3"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 15v2"
                        />
                      </svg>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-gray-800">
                        Two-Factor Authentication
                      </h3>

                      <p className="mt-0.5 text-sm text-gray-500">
                        Add another layer of security.
                      </p>
                    </div>
                  </div>

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-bold
                      ${
                        user.twoFactorEnabled
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                  >
                    {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  {user.twoFactorEnabled ? (
                    <button
                      type="button"
                      onClick={() => navigate("/security")}
                      className="
                        text-sm
                        font-bold
                        text-[#D71920]
                        transition-all
                        duration-200
                        hover:text-[#b9151b]
                        hover:underline
                      "
                    >
                      Manage 2FA →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate("/2fa-setup")}
                      className="
                        text-sm
                        font-bold
                        text-[#D71920]
                        transition-all
                        duration-200
                        hover:text-[#b9151b]
                        hover:underline
                      "
                    >
                      Enable 2FA →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* =====================================
              SECURITY RECOMMENDATION
          ===================================== */}

          {!user.twoFactorEnabled && (
            <div
              className="
                group
                mt-6
                rounded-2xl
                border
                border-red-100
                bg-white
                p-5
                shadow-xl
                shadow-gray-200/40
                transition-all
                duration-300
                hover:shadow-xl
                sm:p-6
              "
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-red-50
                      text-[#D71920]
                      transition-all
                      duration-200
                      group-hover:scale-105
                      group-hover:bg-red-100
                    "
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3l8 4v5c0 5-3.4 8.7-8 9-4.6-.3-8-4-8-9V7l8-4z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16h.01"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-800">
                      Strengthen your account security
                    </h3>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                      Two-factor authentication adds an additional verification
                      step when signing in to your account.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/2fa-setup")}
                  className="
                    flex
                    h-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#D71920]
                    px-5
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
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {/* =====================================
              FOOTER
          ===================================== */}

          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-gray-200 pt-5 sm:flex-row">
            <p className="text-xs font-medium text-gray-400">
              © 2026 Auth System. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                ✓
              </span>

              Account protected
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
