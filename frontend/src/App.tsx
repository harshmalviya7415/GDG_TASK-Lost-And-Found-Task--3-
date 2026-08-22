import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import ItemCard from "./components/ItemCard";
import type { Item } from "./components/ItemCard";
import AddItemModal from "./components/AddItemModal";
import EditItemModal from "./components/EditItemModal";
import ClaimItemForm from "./components/ClaimItemForm";
import ReportFoundForm from "./components/ReportFoundForm";
import WorkflowTimeline from "./components/WorkflowTimeline";
import AuthScreen from "./components/AuthScreen";
import { Search, Info, Plus } from "lucide-react";

axios.defaults.withCredentials = true;

const API = axios.create({
  baseURL: "http://localhost:1500/api",
});

type ViewState =
  | { type: "list" }
  | { type: "claim"; item: Item }
  | { type: "found"; item: Item }
  | { type: "detail"; item: Item };

function App() {
  const theme = "light";
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Lost" | "Found">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [view, setView] = useState<ViewState>({ type: "list" });
  
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [authLoading, setAuthLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await API.get("/auth/me");
      setCurrentUser(res.data);
    } catch (err) {
      console.error(err);
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchItems();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  useEffect(() => {
    const handleHashChange = async () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/item/")) {
        const parts = hash.replace("#/item/", "").split("/");
        const itemId = parts[0];
        const subAction = parts[1];

        try {
          const itemRes = await API.get(`/items/${itemId}`);
          const workflowRes = await API.get(`/workflows/${itemId}`);
          setSelectedWorkflow(workflowRes.data);

          if (subAction === "claim" || subAction === "found") {
            const currentUserId = currentUser?.id || currentUser?._id;
            const claimantIds = workflowRes.data?.claims?.map((c: any) => (c.claimantId?._id || c.claimantId)?.toString()) || [];
            const hasUserClaimed = currentUserId && claimantIds.includes(currentUserId.toString());
            
            const isFinalized = workflowRes.data && 
              ["WAITING_FOR_HANDOVER", "WAITING_FOR_RECEIVER_CONFIRMATION", "COMPLETED"].includes(workflowRes.data.currentStep);

            if (isFinalized || hasUserClaimed) {
              window.location.hash = `#/item/${itemId}`;
              setView({ type: "detail", item: itemRes.data });
            } else {
              setView({ type: subAction === "claim" ? "claim" : "found", item: itemRes.data });
            }
          } else {
            setView({ type: "detail", item: itemRes.data });
          }
        } catch (err) {
          console.error(err);
          window.location.hash = "";
        }
      } else if (hash === "#about") {
        setFilter("Lost");
        setView({ type: "list" });
      } else if (hash === "#features") {
        setFilter("Found");
        setView({ type: "list" });
      } else {
        setFilter("All");
        setView({ type: "list" });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleCardClick = (item: Item) => {
    const itemId = item._id || item.id || "";
    window.location.hash = `#/item/${itemId}`;
  };

  const handleAddItem = async (newItem: Omit<Item, "id">) => {
    try {
      const res = await API.post("/items", newItem);
      setIsModalOpen(false);
      await fetchItems();
      const createdItemId = res.data.item._id || res.data.item.id;
      window.location.hash = `#/item/${createdItemId}`;
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditItem = async (updatedItem: Item) => {
    try {
      const id = updatedItem._id || updatedItem.id;
      const res = await API.post("/items/edit", {
        id,
        title: updatedItem.title,
        type: updatedItem.type,
        category: updatedItem.category,
        description: updatedItem.description,
        location: updatedItem.location,
        date: updatedItem.date,
        contact: updatedItem.contact,
      });
      setIsEditModalOpen(false);
      await fetchItems();
      
      if (view.type === "detail" && (view.item._id === id || view.item.id === id)) {
        setView({ type: "detail", item: { ...view.item, ...updatedItem } });
      }
      
      console.log(res.data.mess);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const res = await API.post("/items/delete", { id: itemId });
      console.log(res.data.mess);
      await fetchItems();
      window.location.hash = "";
      setView({ type: "list" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaimSubmit = async (claimDetails: {
    claimantName: string;
    contactInfo: string;
    proofOfOwnership: string;
    lossDate: string;
    itemId: string;
  }) => {
    try {
      const itemId = claimDetails.itemId;
      const res = await API.post(`/workflows/${itemId}/claim`, {
        claimantName: claimDetails.claimantName,
        contactInfo: claimDetails.contactInfo,
        reason: claimDetails.proofOfOwnership,
        privateVerification: claimDetails.proofOfOwnership,
      });
      setSelectedWorkflow(res.data);
      await fetchItems();
      window.location.hash = `#/item/${itemId}`;
    } catch (err) {
      console.error(err);
    }
  };

  const handleFoundReportSubmit = async (reportDetails: {
    finderName: string;
    contactInfo: string;
    foundLocation: string;
    foundDate: string;
    additionalNotes: string;
    itemId: string;
  }) => {
    try {
      const itemId = reportDetails.itemId;
      const res = await API.post(`/workflows/${itemId}/claim`, {
        claimantName: reportDetails.finderName,
        contactInfo: reportDetails.contactInfo,
        reason: `Found at ${reportDetails.foundLocation}`,
        privateVerification: reportDetails.additionalNotes,
      });
      setSelectedWorkflow(res.data);
      await fetchItems();
      window.location.hash = `#/item/${itemId}`;
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (itemId: string, claimantId: string) => {
    try {
      const res = await API.post(`/workflows/${itemId}/approve`, { claimantId });
      setSelectedWorkflow(res.data);
      await fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleHandover = async (itemId: string) => {
    try {
      const res = await API.post(`/workflows/${itemId}/handover`);
      setSelectedWorkflow(res.data);
      await fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirm = async (itemId: string) => {
    try {
      const res = await API.post(`/workflows/${itemId}/confirm`);
      setSelectedWorkflow(res.data);
      await fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await API.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put("/notifications/mark-all-read");
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.error(err);
    }
    setCurrentUser(null);
    setNotifications([]);
    window.location.hash = "";
  };

  const handleAuthSuccess = (_token: string, user: any) => {
    setCurrentUser(user);
    fetchItems();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  const filteredItems = items.filter((item) => {
    const itemType = item.type || "Found";
    const matchesFilter = filter === "All" || itemType.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const isDark = false;
  const bgClass = "bg-slate-50 text-slate-900";
  const heroTextColor = "text-slate-600";

  const navLinks = [
    { label: "Lost", href: "#about" },
    { label: "Found", href: "#features" },
  ];

  const creatorId = view.type === "detail" ? (view.item.createdBy?._id || view.item.createdBy) : null;
  const currentUserId = currentUser?.id || currentUser?._id;
  const isCreator = view.type === "detail" && creatorId === currentUserId;

  const isFinder = selectedWorkflow && (
    (view.type === "detail" && view.item.type === "Found" && creatorId === currentUserId) ||
    ((selectedWorkflow.claimantId?._id || selectedWorkflow.claimantId) === currentUserId && view.type === "detail" && view.item.type === "Lost")
  );

  const isClaimant = selectedWorkflow && (
    (view.type === "detail" && view.item.type === "Lost" && creatorId === currentUserId) ||
    ((selectedWorkflow.claimantId?._id || selectedWorkflow.claimantId) === currentUserId && view.type === "detail" && view.item.type === "Found")
  );

  const userClaim = selectedWorkflow?.claims?.find((c: any) => (c.claimantId?._id || c.claimantId)?.toString() === currentUserId?.toString());
  const hasPendingClaim = !!(userClaim && userClaim.status === "PENDING");

  return (
    <div className={`min-h-screen ${bgClass} transition-all duration-300 flex flex-col font-sans`}>
      <Navbar 
        brandName="Foundly" 
        links={navLinks} 
        theme={theme} 
        currentUser={currentUser}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
        onLogout={handleLogout}
        onAddClick={() => {
          setView({ type: "list" });
          setIsModalOpen(true);
        }}
        onBrandClick={() => {
          window.location.hash = "";
        }}
      />

      {view.type === "claim" ? (
        <div className="flex-1">
          <ClaimItemForm
            item={view.item}
            onBack={() => {
              window.location.hash = `#/item/${view.item._id || view.item.id}`;
            }}
            onSubmitClaim={(claimDetails) => handleClaimSubmit({ ...claimDetails, itemId: view.item._id || view.item.id || "" })}
            theme={theme}
          />
        </div>
      ) : view.type === "found" ? (
        <div className="flex-1">
          <ReportFoundForm
            item={view.item}
            onBack={() => {
              window.location.hash = `#/item/${view.item._id || view.item.id}`;
            }}
            onSubmitReport={(reportDetails) => handleFoundReportSubmit({ ...reportDetails, itemId: view.item._id || view.item.id || "" })}
            theme={theme}
          />
        </div>
      ) : view.type === "detail" ? (
        <div className="w-full max-w-4xl mx-auto px-4 py-6 text-left">
          <button
            onClick={() => {
              window.location.hash = "";
            }}
            className="mb-6 px-3 py-1.5 rounded text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all cursor-pointer"
          >
            ← Back to List
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize border border-blue-100">
                    {view.item.type || "Found"}
                  </span>
                  <span className="text-xs text-slate-500">{view.item.category}</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">{view.item.title}</h2>
                <p className="text-slate-600 text-sm mb-6 whitespace-pre-wrap">{view.item.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg">
                  <p><strong>Location:</strong> {view.item.location}</p>
                  <p><strong>Date:</strong> {view.item.date}</p>
                  <p><strong>Contact:</strong> {view.item.contact}</p>
                  <p><strong>Reported By:</strong> {view.item.createdBy?.username || "Legacy User"}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="font-bold text-base mb-4">Actions</h3>

                {isCreator && (
                  <div className="flex gap-3 mb-4 pb-4 border-b border-dashed border-slate-200">
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded transition-all cursor-pointer text-xs"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this reported item?")) {
                          handleDeleteItem(view.item._id || view.item.id || "");
                        }
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-all cursor-pointer text-xs"
                    >
                      Delete Report
                    </button>
                  </div>
                )}

                {selectedWorkflow && (
                  <div className="text-sm">
                    {selectedWorkflow.currentStep === "WAITING_FOR_CLAIM" && (
                      <div>
                        {view.item.type === "Found" ? (
                          creatorId === currentUserId ? (
                            <p className="text-xs text-slate-500">Waiting for a claim to be submitted by the owner.</p>
                          ) : (
                            <button
                              onClick={() => {
                                const itemId = view.item._id || view.item.id || "";
                                window.location.hash = `#/item/${itemId}/claim`;
                              }}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-all cursor-pointer text-xs"
                            >
                              Claim This Item
                            </button>
                          )
                        ) : (
                          creatorId === currentUserId ? (
                            <p className="text-xs text-slate-500">Waiting for a finder to report that they found this item.</p>
                          ) : (
                            <button
                              onClick={() => {
                                const itemId = view.item._id || view.item.id || "";
                                window.location.hash = `#/item/${itemId}/found`;
                              }}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded transition-all cursor-pointer text-xs"
                            >
                              I Found This
                            </button>
                          )
                        )}
                      </div>
                    )}

                    {selectedWorkflow.currentStep === "WAITING_FOR_VERIFICATION" && (
                      <div className="space-y-6">
                        {isFinder ? (
                          <div className="space-y-4">
                            <h4 className="font-bold text-sm text-slate-800">Pending Claims ({selectedWorkflow.claims?.length || 0})</h4>
                            {selectedWorkflow.claims && selectedWorkflow.claims.length > 0 ? (
                              selectedWorkflow.claims.map((claim: any) => (
                                <div key={claim.claimantId} className="bg-slate-50 p-4 rounded-lg text-xs space-y-2 border">
                                  <div className="flex justify-between items-center border-b pb-2 mb-2">
                                    <span className="font-bold text-slate-700">Claimant: {claim.claimantName}</span>
                                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">Pending</span>
                                  </div>
                                  <p><strong>Contact Info:</strong> {claim.contactInfo}</p>
                                  <p><strong>Reason:</strong> {claim.reason}</p>
                                  <p className="p-2 bg-white rounded border border-dashed">
                                    <strong>Private Verification Notes:</strong> {claim.privateVerification}
                                  </p>
                                  <button
                                    onClick={() => handleApprove(view.item._id || view.item.id || "", claim.claimantId)}
                                    className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded transition-all cursor-pointer text-[10px]"
                                  >
                                    Approve This Claim
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-500">No claims submitted yet.</p>
                            )}
                          </div>
                        ) : hasPendingClaim ? (
                          <p className="text-xs text-slate-500">Your claim has been submitted. Waiting for the finder to verify details.</p>
                        ) : (
                          <p className="text-xs text-slate-500">This item is pending claim verification.</p>
                        )}
                      </div>
                    )}

                    {selectedWorkflow.currentStep === "WAITING_FOR_HANDOVER" && (
                      <div>
                        {isFinder ? (
                          <button
                            onClick={() => handleHandover(view.item._id || view.item.id || "")}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-all cursor-pointer text-xs"
                          >
                            Mark as Handed Over
                          </button>
                        ) : isClaimant ? (
                          <p className="text-xs text-slate-500">Claim approved! Waiting for the finder to complete handover.</p>
                        ) : (
                          <p className="text-xs text-slate-500">Claim approved. Handover in progress.</p>
                        )}
                      </div>
                    )}

                    {selectedWorkflow.currentStep === "WAITING_FOR_RECEIVER_CONFIRMATION" && (
                      <div>
                        {isClaimant ? (
                          <button
                            onClick={() => handleConfirm(view.item._id || view.item.id || "")}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded transition-all cursor-pointer text-xs"
                          >
                            Confirm Received
                          </button>
                        ) : isFinder ? (
                          <p className="text-xs text-slate-500">Item handed over. Waiting for claimant to confirm receipt.</p>
                        ) : (
                          <p className="text-xs text-slate-500">Handover done. Waiting for claimant to confirm receipt.</p>
                        )}
                      </div>
                    )}

                    {selectedWorkflow.currentStep === "COMPLETED" && (
                      <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                        Workflow Completed! The item has been returned to its owner.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-4">
              <WorkflowTimeline 
                currentStep={selectedWorkflow?.currentStep || "WAITING_FOR_CLAIM"} 
                history={selectedWorkflow?.history || []}
              />
            </div>
          </div>
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
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto px-6 pb-20">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard 
                    key={item._id || item.id} 
                    item={item} 
                    theme={theme} 
                    currentUser={currentUser}
                    onClaimClick={() => {
                      const itemId = item._id || item.id || "";
                      window.location.hash = `#/item/${itemId}/claim`;
                    }}
                    onFoundClick={() => {
                      const itemId = item._id || item.id || "";
                      window.location.hash = `#/item/${itemId}/found`;
                    }}
                    onCardClick={() => handleCardClick(item)}
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

      {view.type === "detail" && (
        <EditItemModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={handleEditItem}
          item={view.item}
          theme={theme}
        />
      )}
    </div>
  );
}

export default App;