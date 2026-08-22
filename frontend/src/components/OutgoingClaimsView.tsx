import type { Item } from "./ItemCard";
import type { Claim } from "./IncomingClaimsView";

interface OutgoingClaimsViewProps {
  claims: Claim[];
  items: Item[];
  onBack: () => void;
  theme?: "dark" | "light";
}

const OutgoingClaimsView = ({ claims, items, onBack, theme }: OutgoingClaimsViewProps) => {
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
        <h2 className="text-2xl font-bold">My Claims Status</h2>
        <p className="text-xs opacity-75 mt-1">
          Track the validation progress of ownership claims you filed for found items on campus.
        </p>
      </div>

      {claims.length === 0 ? (
        <div className={`text-center py-12 border rounded-xl p-4 ${cardBg} ${borderColor}`}>
          <p className="text-sm font-semibold">No Claims Made</p>
          <p className="text-xs opacity-75 mt-1">
            You haven't filed any claims yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => {
            const item = getItem(claim.itemId);
            if (!item) return null;

            return (
              <div
                key={claim.id}
                className={`p-5 rounded-xl border ${cardBg} ${borderColor}`}
              >
                <div className="flex justify-between items-center border-b pb-3 mb-3 border-slate-800/10 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold">{item.title}</h3>
                    <p className="text-xs opacity-75">Found at: {item.location}</p>
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


                <div className="text-xs space-y-1 mb-3">
                  <p><strong>Claim Date:</strong> {new Date(claim.dateSubmitted).toLocaleDateString()}</p>
                  <p><strong>Proof Sent:</strong> {claim.proofOfOwnership}</p>
                  <p><strong>Contact info:</strong> {claim.contactInfo}</p>
                </div>

                {claim.status === "Approved" && (
                  <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded text-xs">
                    <strong>Approved:</strong> Coordinate recovery directly with the reporter via: <strong>{item.contact}</strong>.
                  </div>
                )}

                {claim.status === "Declined" && (
                  <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded text-xs">
                    <strong>Declined:</strong> The reporter declined this claim. Double check details or contact them directly.
                  </div>
                )}

                {claim.status === "Pending" && (
                  <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded text-xs">
                    <strong>Pending:</strong> The finder is currently reviewing your details.
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

export default OutgoingClaimsView;
