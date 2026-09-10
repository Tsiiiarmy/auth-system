import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import securityImage from "../assets/security.png";

function Welcome() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">

      {/* =====================================================
          LEFT SIDE
      ===================================================== */}
      <div
        className="
          relative w-full lg:w-1/2
          min-h-screen
          bg-[#333333]
          text-white
          px-8 sm:px-12 lg:px-16
          py-8 lg:py-10
          flex flex-col justify-between
          overflow-hidden
        "
      >

        {/* Background glow */}
        <div
          className="
            absolute -top-32 -right-32
            w-96 h-96
            bg-red-600/10
            rounded-full
            blur-3xl
            animate-pulse
            pointer-events-none
          "
        />

        <div
          className="
            absolute -bottom-40 -left-40
            w-120 h-120
            bg-red-500/5
            rounded-full
            blur-3xl
            pointer-events-none
          "
        />

        {/* Small decorative circle */}
        <div
          className="
            absolute top-1/2 right-10
            w-2 h-2
            bg-red-500/40
            rounded-full
            animate-ping
            pointer-events-none
          "
        />

        {/* ================= LOGO ================= */}
        <div className="relative z-10">

          <img
            src={logo}
            alt="AuthSystem"
            className="
              w-28 sm:w-32
              transition-all duration-500
              hover:scale-105
              hover:-translate-y-1
            "
          />

        </div>


        {/* ================= MAIN CONTENT ================= */}
        <div className="relative z-10 max-w-md my-12 lg:my-0">

          {/* Security badge */}
          <div
            className="
              inline-flex items-center gap-2
              px-3 py-1.5
              mb-6
              rounded-full
              bg-white/5
              border border-white/10
              backdrop-blur-sm
              transition-all duration-300
              hover:bg-white/10
              hover:border-red-500/30
            "
          >
            <span
              className="
                w-2 h-2
                bg-red-500
                rounded-full
                animate-pulse
              "
            />

            <span className="text-[11px] font-semibold tracking-[0.2em] text-gray-300">
              SECURE AUTHENTICATION
            </span>
          </div>


          {/* ================= HEADING ================= */}
          <h1
            className="
              text-5xl sm:text-6xl
              font-extrabold
              leading-[1.05]
              tracking-tight
            "
          >
            <span
              className="
                block
                transition-transform duration-500
                hover:translate-x-2
              "
            >
              Secure.
            </span>

            <span
              className="
                block
                transition-transform duration-500 delay-75
                hover:translate-x-3
              "
            >
              Simple.
            </span>

            <span
              className="
                block text-red-500
                transition-all duration-500
                hover:text-red-400
                hover:translate-x-4
              "
            >
              Connected.
            </span>
          </h1>


          {/* ================= DESCRIPTION ================= */}
          <p
            className="
              mt-6
              text-gray-300
              leading-relaxed
              text-sm sm:text-base
              max-w-sm
            "
          >
            Create your account or login
            <br className="hidden sm:block" />
            to continue to your dashboard.
          </p>


          {/* ================= FEATURES ================= */}
          <div className="mt-8 lg:mt-10 space-y-2">

            {/* Feature 1 */}
            <div
              className="
                group
                flex items-center gap-4
                px-3 py-3
                rounded-lg
                cursor-default
                transition-all duration-300
                hover:bg-white/5
                hover:translate-x-2
              "
            >
              <span
                className="
                  flex items-center justify-center
                  w-8 h-8
                  rounded-full
                  bg-red-500/10
                  border border-red-500/20
                  text-red-500
                  text-sm font-bold
                  transition-all duration-300
                  group-hover:bg-red-500/20
                  group-hover:border-red-500/40
                  group-hover:scale-110
                  group-hover:rotate-6
                  group-hover:shadow-lg
                  group-hover:shadow-red-500/10
                "
              >
                ✓
              </span>

              <span
                className="
                  text-sm text-gray-200
                  transition-colors duration-300
                  group-hover:text-white
                "
              >
                Secure Authentication
              </span>
            </div>


            {/* Feature 2 */}
            <div
              className="
                group
                flex items-center gap-4
                px-3 py-3
                rounded-lg
                cursor-default
                transition-all duration-300
                hover:bg-white/5
                hover:translate-x-2
              "
            >
              <span
                className="
                  flex items-center justify-center
                  w-8 h-8
                  rounded-full
                  bg-red-500/10
                  border border-red-500/20
                  text-red-500
                  text-sm font-bold
                  transition-all duration-300
                  group-hover:bg-red-500/20
                  group-hover:border-red-500/40
                  group-hover:scale-110
                  group-hover:rotate-6
                  group-hover:shadow-lg
                  group-hover:shadow-red-500/10
                "
              >
                ✓
              </span>

              <span
                className="
                  text-sm text-gray-200
                  transition-colors duration-300
                  group-hover:text-white
                "
              >
                Email & Phone Verification
              </span>
            </div>


            {/* Feature 3 */}
            <div
              className="
                group
                flex items-center gap-4
                px-3 py-3
                rounded-lg
                cursor-default
                transition-all duration-300
                hover:bg-white/5
                hover:translate-x-2
              "
            >
              <span
                className="
                  flex items-center justify-center
                  w-8 h-8
                  rounded-full
                  bg-red-500/10
                  border border-red-500/20
                  text-red-500
                  text-sm font-bold
                  transition-all duration-300
                  group-hover:bg-red-500/20
                  group-hover:border-red-500/40
                  group-hover:scale-110
                  group-hover:rotate-6
                  group-hover:shadow-lg
                  group-hover:shadow-red-500/10
                "
              >
                ✓
              </span>

              <span
                className="
                  text-sm text-gray-200
                  transition-colors duration-300
                  group-hover:text-white
                "
              >
                Two-Factor Authentication
              </span>
            </div>

          </div>

        </div>


        {/* ================= BUTTONS ================= */}
        <div
          className="
            relative z-10
            flex flex-col sm:flex-row
            gap-3 sm:gap-4
          "
        >

          {/* Create Account */}
          <Link
            to="/register"
            viewTransition
            className="
              group
              relative
              inline-flex items-center justify-center gap-2
              min-h-12
              px-7 sm:px-8
              rounded-lg
              bg-red-600
              text-white
              font-semibold text-sm

              shadow-lg shadow-red-600/10

              transition-all duration-300
              hover:bg-red-500
              hover:-translate-y-1
              hover:shadow-xl
              hover:shadow-red-600/25

              active:scale-95
            "
          >
            <span>Create Account</span>

            <span
              className="
                text-lg leading-none
                transition-transform duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>


          {/* Login */}
          <Link
            to="/login"
            viewTransition
            className="
              inline-flex items-center justify-center
              min-h-12
              px-8 sm:px-10
              rounded-lg
              bg-white
              text-gray-900
              font-semibold text-sm

              shadow-lg shadow-black/10

              transition-all duration-300
              hover:bg-gray-100
              hover:-translate-y-1
              hover:shadow-xl
              hover:shadow-black/15

              active:scale-95
            "
          >
            Login
          </Link>

        </div>

      </div>


      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}
      <div
        className="
          relative
          w-full lg:w-1/2
          min-h-140 lg:min-h-screen
          flex items-center justify-center
          overflow-hidden
        "
      >

        {/* Background decorations */}

        <div
          className="
            absolute
            -top-20 -right-20
            w-72 h-72
            bg-red-500/5
            rounded-full
            blur-3xl
            pointer-events-none
          "
        />

        <div
          className="
            absolute
            -bottom-32 -left-32
            w-96 h-96
            bg-gray-400/5
            rounded-full
            blur-3xl
            pointer-events-none
          "
        />


        {/* Content */}
        <div className="relative z-10 text-center px-6">

          {/* Heading */}

          <div>

            <span
              className="
                text-xs
                font-bold
                tracking-[0.3em]
                text-red-500
                uppercase
              "
            >
              Welcome
            </span>

            <h2
              className="
                mt-3
                text-3xl sm:text-4xl
                font-extrabold
                text-gray-900
                tracking-tight
              "
            >
              Your security starts here.
            </h2>

            <p
              className="
                mt-4
                text-sm sm:text-base
                text-gray-500
                max-w-sm
                mx-auto
                leading-relaxed
              "
            >
              A simple and secure way to manage your account.
            </p>

          </div>


          {/* ================= SECURITY IMAGE ================= */}

          <div className="mt-8 flex justify-center">

            <div
              className="
                relative
                group
              "
            >

              {/* Glow */}

              <div
                className="
                  absolute
                  inset-8
                  rounded-full
                  bg-red-500/10
                  blur-3xl
                  transition-all duration-700
                  group-hover:bg-red-500/20
                  group-hover:scale-110
                "
              />

            {/* Floating image */}
            <img
              src={securityImage}
              alt="Secure authentication"
              className="
                relative
                w-64 sm:w-72 lg:w-80
                h-64 sm:h-72 lg:h-80
                object-contain

                transition-all duration-700 ease-out

                animate-[float_5s_ease-in-out_infinite]   

                group-hover:scale-105
                group-hover:-rotate-2
                group-hover:drop-shadow-2xl
              "
            />

            </div>

          </div>


          {/* ================= BOTTOM TEXT ================= */}

          <div className="mt-3">

            <h3
              className="
                text-lg
                font-bold
                text-gray-900
                transition-colors duration-300
                hover:text-red-600
              "
            >
              Simple, clean and secure
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Authentication for your users
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Welcome;
