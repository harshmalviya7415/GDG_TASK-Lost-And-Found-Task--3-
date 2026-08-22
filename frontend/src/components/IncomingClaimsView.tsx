import type { Item } from "./ItemCard";

export interface Claim {
  id: string;
  itemId: string;
  claimantName: string;
  contactInfo: string;
  proofOfOwnership: string;
  lossDate: string;
  status: "Pending" | "Approved" | "Declined";
  dateSubmitted: string;
}

interface IncomingClaimsViewProps {
  claims: Claim[];
  items: Item[];
  onBack: () => void;
  onApproveClaim: (claimId: string) => void;
  onDeclineClaim: (claimId: string) => void;
  theme?: "dark" | "light";
}

const IncomingClaimsView = ({
  claims,
  items,
  onBack,
  onApproveClaim,
  onDeclineClaim,
  theme,
}: IncomingClaimsViewProps) => {
  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-gray-950 text-white" : "bg-slate-50 text-slate-900";
  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const borderColor = isDark ? "border-slate-800" : "border-slate-200";

  const getItem = (itemId: string) => {
    return items.find((item) => item.id === itemId);
  };

  return (
    <div className={`w-full max-w-3xl mx-auto px-4 py-6 ${bgClass}`}>
      <button
        onClick={onBack}
        className={`mb-4 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${isDark ? "bg-slate-800 text-slate-200" : "bg-slate-200 text-slate-700"
          }`}
      >
        ← Back to List
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold">Claims on My Listed Items</h2>
        <p className="text-xs opacity-75 mt-1">
          Review ownership claims submitted by other students for the items you found and listed.
        </p>
      </div>

      {claims.length === 0 ? (
        <div className={`text-center py-12 border rounded-xl p-4 ${cardBg} ${borderColor}`}>
          <p className="text-sm font-semibold">No Claims Found</p>
          <p className="text-xs opacity-75 mt-1">
            No claims have been submitted yet for the items you posted.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => {
            const item = getItem(claim.itemId);
            if (!item) return null;

            const isPending = claim.status === "Pending";

            return (
              <div
                key={claim.id}
                className={`p-5 rounded-xl border ${cardBg} ${borderColor}`}
              >
                <div className="flex justify-between items-center border-b pb-3 mb-3 border-slate-800/10 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-500">Item</span>
                    <h3 className="text-base font-bold">{item.title}</h3>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${claim.status === "Pending"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                          : claim.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                        }`}
                    >
                      {claim.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs mb-3">
                  <p><strong>Claimant Name:</strong> {claim.claimantName}</p>
                  <p><strong>Contact Info:</strong> {claim.contactInfo}</p>
                  <p><strong>Date Submitted:</strong> {new Date(claim.dateSubmitted).toLocaleDateString()}</p>
                  <p><strong>Estimated Loss Date:</strong> {new Date(claim.lossDate).toLocaleDateString()}</p>
                </div>

                <div className={`p-3 rounded border text-xs ${isDark ? "bg-slate-950 border-slate-900" : "bg-slate-100 border-slate-200"}`}>
                  <p className="font-semibold mb-1">Proof Submitted:</p>
                  <p className="font-mono whitespace-pre-wrap">{claim.proofOfOwnership}</p>
                </div>

                {isPending && (
                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-800/10 dark:border-slate-800">
                    <button
                      onClick={() => onDeclineClaim(claim.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => onApproveClaim(claim.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IncomingClaimsView;
