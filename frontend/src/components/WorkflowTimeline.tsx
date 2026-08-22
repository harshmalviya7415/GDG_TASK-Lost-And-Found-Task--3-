
interface WorkflowTimelineProps {
  currentStep: string;
  history: Array<{ step: string; timestamp: string }>;
}

const WorkflowTimeline = ({ currentStep, history }: WorkflowTimelineProps) => {
  const steps = [
    { key: "REPORTED", label: "Item reported" },
    { key: "WAITING_FOR_CLAIM", label: "Waiting for claim" },
    { key: "WAITING_FOR_VERIFICATION", label: "Waiting for verification" },
    { key: "WAITING_FOR_HANDOVER", label: "Waiting for handover" },
    { key: "WAITING_FOR_RECEIVER_CONFIRMATION", label: "Waiting for receiver confirmation" },
    { key: "COMPLETED", label: "Completed" },
  ];

  const getStepStatus = (stepKey: string) => {
    const stepOrder = ["REPORTED", "WAITING_FOR_CLAIM", "WAITING_FOR_VERIFICATION", "WAITING_FOR_HANDOVER", "WAITING_FOR_RECEIVER_CONFIRMATION", "COMPLETED"];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepKey);

    if (stepIndex < currentIndex || currentStep === "COMPLETED") {
      return "completed";
    }
    if (stepKey === currentStep) {
      return "active";
    }
    return "pending";
  };

  const getStepTime = (stepKey: string) => {
    const entry = history.find((h) => h.step === stepKey);
    if (entry) {
      return new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return null;
  };

  return (
    <div className="py-6 px-4 border rounded-xl bg-white shadow-sm text-left">
      <h3 className="font-bold text-sm mb-6 text-slate-800">Workflow Progress</h3>
      <div className="flex flex-col gap-6 relative pl-6 border-l-2 border-slate-100">
        {steps.map((step) => {
          const status = getStepStatus(step.key);
          const time = getStepTime(step.key);

          return (
            <div key={step.key} className="relative flex items-start gap-4">
              <div
                className={`absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all duration-300 ${
                  status === "completed"
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : status === "active"
                    ? "bg-blue-600 border-blue-600 text-white animate-pulse"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {status === "completed" ? "✓" : "●"}
              </div>
              <div className="flex-1">
                <h4
                  className={`text-xs font-bold leading-none ${
                    status === "active" ? "text-blue-600 text-sm" : status === "completed" ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </h4>
                {time && (
                  <span className="text-[10px] text-slate-450 block mt-1">
                    {time}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowTimeline;
