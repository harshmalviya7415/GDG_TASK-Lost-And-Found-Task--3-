import React, { useState } from "react";
import type { Item } from "./ItemCard";
import Input from "./Input";
import Button from "./Button";

interface ReportFoundFormProps {
  item: Item;
  onBack: () => void;
  onSubmitReport: (reportDetails: {
    finderName: string;
    contactInfo: string;
    foundLocation: string;
    foundDate: string;
    additionalNotes: string;
  }) => void;
  theme?: "dark" | "light";
}

const ReportFoundForm = ({ item, onBack, onSubmitReport, theme }: ReportFoundFormProps) => {
  const [finderName, setFinderName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [foundLocation, setFoundLocation] = useState("");
  const [foundDate, setFoundDate] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-gray-950 text-white" : "bg-slate-50 text-slate-900";
  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const borderColor = isDark ? "border-slate-800" : "border-slate-200";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finderName || !contactInfo || !foundLocation || !foundDate) return;

    onSubmitReport({
      finderName,
      contactInfo,
      foundLocation,
      foundDate,
      additionalNotes,
    });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className={`min-h-[70vh] flex items-center justify-center p-4 ${bgClass}`}>
        <div className={`max-w-md w-full p-6 rounded-xl border text-center ${cardBg} ${borderColor}`}>
          <div className="text-emerald-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2">Report Submitted</h2>
          <p className="text-sm opacity-80 mb-6">
            Thanks! We saved your found report for <strong>{item.title}</strong>. The owner ({item.contact}) has been notified.
          </p>
          <button
            onClick={onBack}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 py-6 ${bgClass}`}>
      <button
        onClick={onBack}
        className={`mb-4 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
          isDark ? "bg-slate-800 text-slate-200" : "bg-slate-200 text-slate-700"
        }`}
      >
        Back to List
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
       
        <div className={`md:col-span-5 p-5 rounded-xl border ${cardBg} ${borderColor}`}>
          <span className="text-xs uppercase font-bold text-red-500">Lost Item Info</span>
          <h3 className="text-xl font-bold mt-2 mb-1">{item.title}</h3>
          <p className="text-xs opacity-75 mb-4">{item.description}</p>
          
          <div className="border-t pt-4 space-y-2 text-xs opacity-90">
            <p><strong>Last Location:</strong> {item.location}</p>
            <p><strong>Date Lost:</strong> {item.date}</p>
            {item.category && <p><strong>Category:</strong> {item.category}</p>}
            <p><strong>Owner Contact:</strong> {item.contact}</p>
          </div>
        </div>

       
        <div className={`md:col-span-7 p-6 rounded-xl border ${cardBg} ${borderColor}`}>
          <h2 className="text-xl font-bold mb-4">I Found This</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              value={finderName}
              onChange={setFinderName}
              required
              theme={theme}
            />

            <Input
              label="Mobile no"
              value={contactInfo}
              onChange={setContactInfo}
              required
              theme={theme}
            />

            <div className="flex gap-4">
              <div className="w-1/2 flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold opacity-90">When did you find it?</label>
                <input
                  type="date"
                  value={foundDate}
                  onChange={(e) => setFoundDate(e.target.value)}
                  required
                  className={`w-full rounded-lg border p-2 text-sm bg-transparent ${
                    isDark ? "border-slate-700 text-white" : "border-slate-200 text-slate-900"
                  }`}
                  style={{ backgroundColor: isDark ? "#1e293b" : "#f8fafc" }}
                />
              </div>
              <div className="w-1/2">
                <Input
                  label="Where did you lost the item"
                  value={foundLocation}
                  onChange={setFoundLocation}
                  required
                  theme={theme}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full text-left">
              <label className="text-xs font-semibold opacity-90">Any extra notes about its condition or where you found it?</label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={4}
                className={`w-full rounded-lg border p-2 text-sm bg-transparent ${
                  isDark ? "border-slate-700 text-white" : "border-slate-200 text-slate-900"
                }`}
                style={{ backgroundColor: isDark ? "#1e293b" : "#f8fafc" }}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800/10 dark:border-slate-850">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 text-xs font-semibold rounded hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <Button
                name="Submit Report"
                theme={theme}
                textColor={isDark ? "#ffffff" : "#0f172a"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportFoundForm;
