import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ItemCard from "./components/ItemCard";
import type { Item } from "./components/ItemCard";
import AddItemModal from "./components/AddItemModal";
import ClaimItemForm from "./components/ClaimItemForm";
import ReportFoundForm from "./components/ReportFoundForm";
import IncomingClaimsView from "./components/IncomingClaimsView";
import type { Claim } from "./components/IncomingClaimsView";
import OutgoingClaimsView from "./components/OutgoingClaimsView";
import { Search, Info, Plus } from "lucide-react";

type ViewState =
  | { type: "list" }
  | { type: "claim"; item: Item }
  | { type: "found"; item: Item }
  | { type: "incoming-claims" }
  | { type: "outgoing-claims" };

const initialItems: Item[] = [
  {
    id: "1",
    title: "iPhone 15 Pro",
    description: "Titanium blue iPhone 15 Pro found near the cafeteria. It has a transparent case with a sticker on the back.",
    type: "Found",
    location: "Student Cafeteria",
    date: "2026-08-20",
    contact: "cafeteria-staff@foundly.com",
    category: "Electronics",
  },
  {
    id: "2",
    title: "Black Leather Wallet",
    description: "Lost my leather wallet containing college ID and some cash. Probably dropped it between the Library and Science block.",
    type: "Lost",
    location: "Library pathway",
    date: "2026-08-19",
    contact: "john.doe@university.edu",
    category: "Accessories",
  },
  {
    id: "3",
    title: "Mechanical Car Keys",
    description: "Toyota car key fob found on the bench in the central lawn. Has a red leather keychain attached.",
    type: "Found",
    location: "Central Lawn",
    date: "2026-08-20",
    contact: "lawn-security@foundly.com",
    category: "Keys",
  },
  {
    id: "4",
    title: "Blue Nike Backpack",
    description: "Lost a blue Nike backpack containing a laptop charger, notebooks, and a blue water bottle.",
    type: "Lost",
    location: "Block C, Room 204",
    date: "2026-08-18",
    contact: "sarah.smith@student.edu",
    category: "Bags",
  },
  {
    id: "5",
    title: "Sony WH-1000XM4 Headphones",
    description: "Found grey Sony noise-canceling headphones left on a desk in the computer science lab.",
    type: "Found",
    location: "CS Lab 3",
    date: "2026-08-21",
    contact: "lab-assistant@foundly.com",
    category: "Electronics",
  },
];

function App() {
  const theme = "light";
  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem("foundly_items");
    return saved ? JSON.parse(saved) : initialItems;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Lost" | "Found">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<ViewState>({ type: "list" });

  const [claims, setClaims] = useState<Claim[]>(() => {
    const saved = localStorage.getItem("foundly_claims");
    if (saved) return JSON.parse(saved);
    
    const mockClaims: Claim[] = [
      {
        id: "mock-claim-1",
        itemId: "1",
        claimantName: "Alex Mercer",
        contactInfo: "alex.mercer@gmail.com",
        proofOfOwnership: "It has a customized lockscreen with a photo of a husky dog. Also, the charging port has a tiny scratch on the left side.",
        lossDate: "2026-08-20",
        status: "Pending",
        dateSubmitted: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "mock-claim-2",
        itemId: "2",
        claimantName: "You (Finder)",
        contactInfo: "john.doe@university.edu",
        proofOfOwnership: "Found it near the library pathway. Handed it to the librarian at the front desk.",
        lossDate: "2026-08-19",
        status: "Approved",
        dateSubmitted: new Date(Date.now() - 7200000).toISOString(),
      }
    ];
    localStorage.setItem("foundly_claims", JSON.stringify(mockClaims));
    return mockClaims;
  });

  const [myReportedItemIds, setMyReportedItemIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("my_reported_item_ids");
    if (saved) return JSON.parse(saved);
    
    const defaultIds = ["1"];
    localStorage.setItem("my_reported_item_ids", JSON.stringify(defaultIds));
    return defaultIds;
  });

  const [myClaimIds, setMyClaimIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("my_claim_ids");
    if (saved) return JSON.parse(saved);
    
    const defaultIds = ["mock-claim-2"];
    localStorage.setItem("my_claim_ids", JSON.stringify(defaultIds));
    return defaultIds;
  });

  useEffect(() => {
    localStorage.setItem("foundly_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("foundly_claims", JSON.stringify(claims));
  }, [claims]);

  useEffect(() => {
    localStorage.setItem("my_reported_item_ids", JSON.stringify(myReportedItemIds));
  }, [myReportedItemIds]);

  useEffect(() => {
    localStorage.setItem("my_claim_ids", JSON.stringify(myClaimIds));
  }, [myClaimIds]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#about") {
        setFilter("Lost");
        setView({ type: "list" });
      } else if (hash === "#features") {
        setFilter("Found");
        setView({ type: "list" });
      } else {
        setFilter("All");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleAddItem = (newItem: Omit<Item, "id">) => {
    const itemWithId: Item = {
      ...newItem,
      id: crypto.randomUUID(),
    };
    setItems((prev) => [itemWithId, ...prev]);
    setMyReportedItemIds((prev) => [...prev, itemWithId.id]);
  };

  const handleClaimSubmit = (claimDetails: {
    claimantName: string;
    contactInfo: string;
    proofOfOwnership: string;
    lossDate: string;
    itemId: string;
  }) => {
    console.log("Ownership claim details logged:", claimDetails);
    const newClaim: Claim = {
      id: crypto.randomUUID(),
      dateSubmitted: new Date().toISOString(),
      status: "Pending",
      ...claimDetails
    };
    setClaims((prev) => [newClaim, ...prev]);
    setMyClaimIds((prev) => [...prev, newClaim.id]);
  };

  const handleFoundReportSubmit = (reportDetails: {
    finderName: string;
    contactInfo: string;
    foundLocation: string;
    foundDate: string;
    additionalNotes: string;
    itemId: string;
  }) => {
    console.log("Found report details logged:", reportDetails);
    const newClaim: Claim = {
      id: crypto.randomUUID(),
      itemId: reportDetails.itemId,
      claimantName: reportDetails.finderName,
      contactInfo: reportDetails.contactInfo,
      proofOfOwnership: `Found at: ${reportDetails.foundLocation}\nNotes: ${reportDetails.additionalNotes}`,
      lossDate: reportDetails.foundDate,
      status: "Pending",
      dateSubmitted: new Date().toISOString(),
    };
    setClaims((prev) => [newClaim, ...prev]);
    setMyClaimIds((prev) => [...prev, newClaim.id]);
  };

  const handleApproveClaim = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: "Approved" } : c))
    );
  };

  const handleDeclineClaim = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: "Declined" } : c))
    );
  };

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "All" || item.type === filter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const incomingClaims = claims.filter((claim) =>
    myReportedItemIds.includes(claim.itemId)
  );

  const outgoingClaims = claims.filter((claim) =>
    myClaimIds.includes(claim.id)
  );

  const pendingIncomingCount = incomingClaims.filter(
    (c) => c.status === "Pending"
  ).length;

  const navLinks = [
    { label: "Lost", href: "#about" },
    { label: "Found", href: "#features" },
  ];

  const isDark = false;
  const bgClass = "bg-slate-50 text-slate-900";
  const heroTextColor = "text-slate-600";

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300 flex flex-col font-sans`}>
      <Navbar 
        brandName="Foundly" 
        links={navLinks} 
        theme={theme} 
        onAddClick={() => {
          setView({ type: "list" });
          setIsModalOpen(true);
        }}
        onBrandClick={() => setView({ type: "list" })}
      />

      {view.type === "claim" ? (
        <div className="flex-1">
          <ClaimItemForm
            item={view.item}
            onBack={() => setView({ type: "list" })}
            onSubmitClaim={(claimDetails) => handleClaimSubmit({ ...claimDetails, itemId: view.item.id })}
            theme={theme}
          />
        </div>
      ) : view.type === "found" ? (
        <div className="flex-1">
          <ReportFoundForm
            item={view.item}
            onBack={() => setView({ type: "list" })}
            onSubmitReport={(reportDetails) => handleFoundReportSubmit({ ...reportDetails, itemId: view.item.id })}
            theme={theme}
          />
        </div>
      ) : view.type === "incoming-claims" ? (
        <div className="flex-1">
          <IncomingClaimsView
            claims={incomingClaims}
            items={items}
            onBack={() => setView({ type: "list" })}
            onApproveClaim={handleApproveClaim}
            onDeclineClaim={handleDeclineClaim}
            theme={theme}
          />
        </div>
      ) : view.type === "outgoing-claims" ? (
        <div className="flex-1">
          <OutgoingClaimsView
            claims={outgoingClaims}
            items={items}
            onBack={() => setView({ type: "list" })}
            theme={theme}
          />
        </div>
      ) : (
        <>
          <header className="py-12 md:py-16 text-center max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Lost something? <br className="md:hidden" /> We'll help you{" "}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                find it.
              </span>
            </h1>
            <p className={`text-base md:text-lg ${heroTextColor} max-w-xl mx-auto mb-8`}>
              A centralized campus platform to report lost items, browse found belongings, and claim your items back.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center max-w-2xl mx-auto w-full p-2 rounded-2xl border backdrop-blur-md" 
                 style={{ 
                   backgroundColor: isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.8)", 
                   borderColor: isDark ? "#334155" : "#e2e8f0" 
                 }}>
              
              <div className="flex items-center gap-2 px-3 py-2 w-full md:w-auto flex-1 rounded-xl"
                   style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9" }}>
                <Search className="text-blue-500 shrink-0" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-0 focus:outline-none w-full text-sm font-medium"
                  style={{ color: isDark ? "#ffffff" : "#0f172a" }}
                />
              </div>

              <div className="flex p-1 rounded-xl w-full md:w-auto" style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9" }}>
                {(["All", "Lost", "Found"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setFilter(tab);
                      if (tab === "Lost") window.location.hash = "#about";
                      else if (tab === "Found") window.location.hash = "#features";
                      else window.location.hash = "";
                    }}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: filter === tab ? (isDark ? "#2563eb" : "#ffffff") : "transparent",
                      color: filter === tab ? (isDark ? "#ffffff" : "#2563eb") : (isDark ? "#94a3b8" : "#64748b"),
                      boxShadow: filter === tab && !isDark ? "0 1px 3px rgba(0,0,0,0.1)" : undefined
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-center items-center mt-6">
              <button
                onClick={() => setView({ type: "incoming-claims" })}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold cursor-pointer ${
                  isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                📥 Claims on My Items
                {pendingIncomingCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-500 text-[10px] text-white">
                    {pendingIncomingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setView({ type: "outgoing-claims" })}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold cursor-pointer ${
                  isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                📋 My Claims Status
                {outgoingClaims.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px]">
                    {outgoingClaims.length}
                  </span>
                )}
              </button>
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto px-6 pb-20">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    theme={theme} 
                    onClaimClick={() => setView({ type: "claim", item })}
                    onFoundClick={() => setView({ type: "found", item })}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto">
                <div className="p-4 rounded-full bg-blue-500/10 text-blue-500 mb-4">
                  <Info size={32} />
                </div>
                <h3 className="text-xl font-bold mb-1">No items found</h3>
                <p className={`text-sm ${heroTextColor} mb-6`}>
                  We couldn't find any reports matching "{searchQuery}" under the "{filter}" category.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  <Plus size={18} />
                  Report New Item
                </button>
              </div>
            )}
          </main>
        </>
      )}

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
        theme={theme}
      />
    </div>
  );
}

export default App;