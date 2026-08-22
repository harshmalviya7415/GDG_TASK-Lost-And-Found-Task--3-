import React, { useState } from "react";
import type { Item } from "./ItemCard";
import Input from "./Input";
import Button from "./Button";

interface ClaimItemFormProps {
  item: Item;
  onBack: () => void;
  onSubmitClaim: (claimDetails: {
    claimantName: string;
    contactInfo: string;
    proofOfOwnership: string;
    lossDate: string;
  }) => void;
  theme?: "dark" | "light";
}

const ClaimItemForm = ({ item, onBack, onSubmitClaim, theme }: ClaimItemFormProps) => {
  const [claimantName, setClaimantName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [proofOfOwnership, setProofOfOwnership] = useState("");
  const [lossDate, setLossDate] = useState("");
  const [agree, setAgree] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [claimId] = useState(() => Math.floor(100000 + Math.random() * 900000));

  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-gray-950 text-white" : "bg-slate-50 text-slate-900";
  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const borderColor = isDark ? "border-slate-800" : "border-slate-200";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantName || !contactInfo || !proofOfOwnership || !lossDate || !agree) return;

    onSubmitClaim({
      claimantName,
      contactInfo,
      proofOfOwnership,
      lossDate,
    });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className={`min-h-[70vh] flex items-center justify-center p-4 ${bgClass}`}>
        <div className={`max-w-md w-full p-6 rounded-xl border text-center ${cardBg} ${borderColor}`}>
          <div className="text-emerald-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2">Claim Submitted</h2>
          <p className="text-sm opacity-80 mb-4">
            Your claim for <strong>{item.title}</strong> is saved. The owner/finder ({item.contact}) has been notified.
          </p>

          <div className={`p-3 rounded-lg border mb-6 text-left text-xs ${isDark ? "bg-slate-950" : "bg-slate-100"}`}>
            <p className="font-bold text-blue-500">Claim ID: CLAIM-{claimId}</p>
            <p className="opacity-75 mt-1">Write this down to check the status of your claim later.</p>
          </div>

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
        ← Back to List
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className={`md:col-span-5 p-5 rounded-xl border ${cardBg} ${borderColor}`}>
          <span className="text-xs uppercase font-bold text-blue-500">Item being claimed</span>
          <h3 className="text-xl font-bold mt-2 mb-1">{item.title}</h3>
          <p className="text-xs opacity-75 mb-4">{item.description}</p>
          
          <div className="border-t pt-4 space-y-2 text-xs opacity-90">
            <p><strong>Found Location:</strong> {item.location}</p>
            <p><strong>Found Date:</strong> {item.date}</p>
            {item.category && <p><strong>Category:</strong> {item.category}</p>}
            <p><strong>Contact:</strong> {item.contact}</p>
          </div>
        </div>

        <div className={`md:col-span-7 p-6 rounded-xl border ${cardBg} ${borderColor}`}>
          <h2 className="text-xl font-bold mb-4">Claim Form</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              value={claimantName}
              onChange={setClaimantName}
              required
              theme={theme}
            />

            <Input
              label="mobile no"
              value={contactInfo}
              onChange={setContactInfo}
              required
              theme={theme}
            />

            <div className="flex flex-col gap-1.5 w-full text-left">
              <label className="text-xs font-semibold opacity-90">Around when did you lose this item?</label>
              <input
                type="date"
                value={lossDate}
                onChange={(e) => setLossDate(e.target.value)}
                required
                className={`w-full rounded-lg border p-2 text-sm bg-transparent ${
                  isDark ? "border-slate-700 text-white" : "border-slate-200 text-slate-900"
                }`}
                style={{ backgroundColor: isDark ? "#1e293b" : "#f8fafc" }}
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full text-left">
              <label className="text-xs font-semibold opacity-90">How can you prove this item belongs to you?</label>
              <textarea
                value={proofOfOwnership}
                onChange={(e) => setProofOfOwnership(e.target.value)}
                required
                rows={4}
                className={`w-full rounded-lg border p-2 text-sm bg-transparent ${
                  isDark ? "border-slate-700 text-white" : "border-slate-200 text-slate-900"
                }`}
                style={{ backgroundColor: isDark ? "#1e293b" : "#f8fafc" }}
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 cursor-pointer"
                required
              />
              <label htmlFor="agree" className="text-xs opacity-75 select-none leading-tight">
                I promise this is actually my item and everything I wrote is true.
              </label>
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
                name="Submit Claim"
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

export default ClaimItemForm;
