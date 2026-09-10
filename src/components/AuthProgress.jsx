import React from "react";

function AuthProgress({ currentStep }) {
  const steps = [
    { id: 1, label: "Account" },
    { id: 2, label: "Verify Email" },
    { id: 3, label: "Verify Phone" },
    { id: 4, label: "Complete" },
  ];

  return (
    <div className="mx-auto mb-8 flex w-full max-w-130 items-start justify-between">
      {steps.map((step, index) => {
        const active = currentStep === step.id;

        return (
          <div
            key={step.id}
            className="flex flex-1 flex-col items-center"
          >
            <div className="flex w-full items-center">
              {index !== 0 && (
                <div className="h-px flex-1 bg-gray-300" />
              )}

              <div
                className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                  active
                    ? "bg-[#D71920] text-white"
                    : "bg-gray-300 text-white"
                }`}
              >
                {step.id}
              </div>

              {index !== steps.length - 1 && (
                <div className="h-px flex-1 bg-gray-300" />
              )}
            </div>

            <span
              className={`mt-2 text-[11px] ${
                active
                  ? "font-semibold text-[#D71920]"
                  : "font-medium text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default AuthProgress;