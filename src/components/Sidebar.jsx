import { useNavigate } from "react-router-dom";

function Sidebar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: (
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
            d="M3 12l9-9 9 9"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10"
          />
        </svg>
      ),
    },

    {
      label: "User Management",
      path: "/users",
      roles: ["ADMIN", "MANAGER"],
      icon: (
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
            d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
          />
          <circle cx="9" cy="7" r="4" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M22 21v-2a4 4 0 00-3-3.87"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 3.13a4 4 0 010 7.75"
          />
        </svg>
      ),
    },

    {
      label: "Security",
      path: "/security",
      icon: (
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
            d="M12 3l8 4v5c0 5-3.4 8.7-8 9-4.6-.3-8-4-8-9V7l8-4z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4"
          />
        </svg>
      ),
    },

    {
      label: "Profile",
      path: "/profile",
      icon: (
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
      ),
    },

    {
      label: "Settings",
      path: "/settings",
      icon: (
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
            d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6v.1h-2.4v-.1a1.7 1.7 0 00-1-1.6l-.1.1L6 17l.1-.1A1.7 1.7 0 006.4 15a1.7 1.7 0 00-1.6-1H4.7v-2.4h.1a1.7 1.7 0 001.6-1A1.7 1.7 0 006.1 8.7L6 8.6l1.7-1.7.1.1a1.7 1.7 0 001.9.3 1.7 1.7 0 001-1.6v-.1h2.4v.1a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.6 1h.1V14h-.1a1.7 1.7 0 00-1.6 1z"
          />
        </svg>
      ),
    },
  ];

  const visibleNavigationItems = navigationItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  const currentPath = window.location.pathname;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-100 bg-white lg:block">
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-gray-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <svg
                className="h-6 w-6 text-[#D71920]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l8 4v5c0 5-3.4 8.7-8 9-4.6-.3-8-4-8-9V7l8-4z"
                />
              </svg>
            </div>

            <div>
              <p className="text-base font-bold tracking-tight text-gray-800">
                Auth System
              </p>
              <p className="text-xs font-medium text-gray-400">
                Secure account
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Menu
          </p>

          <div className="space-y-1">
            {visibleNavigationItems.map((item) => {
              const active = currentPath === item.path;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 ${
                    active
                      ? "bg-red-50 font-bold text-[#D71920]"
                      : "font-semibold text-gray-500 hover:bg-red-50 hover:text-[#D71920]"
                  }`}
                >
                  <span
                    className={`transition-transform duration-200 ${
                      !active ? "group-hover:scale-105" : ""
                    }`}
                  >
                    {item.icon}
                  </span>

                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sign out */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-[#D71920]"
          >
            <svg
              className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 17l5-5-5-5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H3"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 19V5a2 2 0 00-2-2h-4"
              />
            </svg>

            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
              <svg
                className="h-5 w-5 text-[#D71920]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l8 4v5c0 5-3.4 8.7-8 9-4.6-.3-8-4-8-9V7l8-4z"
                />
              </svg>
            </div>

            <span className="text-base font-bold text-gray-800">
              Auth System
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-[#D71920]"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {visibleNavigationItems.map((item) => {
            const active = currentPath === item.path;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                className={`group flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition-all duration-200 ${
                  active
                    ? "text-[#D71920]"
                    : "text-gray-400 hover:text-[#D71920]"
                }`}
              >
                <span
                  className={`transition-transform duration-200 group-active:scale-90 ${
                    active ? "" : "group-hover:scale-105"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="text-[11px] font-bold">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default Sidebar;