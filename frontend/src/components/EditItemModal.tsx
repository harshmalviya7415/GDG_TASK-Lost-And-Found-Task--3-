import React, { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";
import { X } from "lucide-react";
import type { Item } from "./ItemCard";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: Item) => void;
  item: Item;
  theme?: string;
  textColor?: string;
  fontSize?: number;
  padding?: number;
}

const EditItemModal = ({
  isOpen,
  onClose,
  onEdit,
  item,
  padding,
  textColor,
  fontSize,
  theme,
}: EditItemModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"Lost" | "Found">("Lost");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (item && isOpen) {
      setTitle(item.title || "");
      setDescription(item.description || "");
      setType(item.type || "Lost");
      setLocation(item.location || "");
      setDate(item.date || "");
      setContact(item.contact || "");
      setCategory(item.category || "");
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const isDark = theme === "dark";
  const backgroundColor = isDark ? "#0f172a" : "#ffffff";
  const finalTextColor = textColor || (isDark ? "#ffffff" : "#0f172a");
  const borderColor = isDark ? "#1e293b" : "#e2e8f0";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location || !date || !contact) return;

    onEdit({
      ...item,
      title,
      description,
      type,
      location,
      date,
      contact,
      category: category || "General",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-lg rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor,
          borderColor,
          padding: padding !== undefined ? `${padding}px` : "24px",
          color: finalTextColor,
          fontSize: fontSize !== undefined ? `${fontSize}px` : undefined,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Edit Reported Item</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:opacity-80 transition-all cursor-pointer"
            style={{ color: finalTextColor }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 w-1/2 text-left">
              <label className="text-xs font-semibold uppercase tracking-wide opacity-80" style={{ color: finalTextColor }}>
                What are you reporting?
              </label>
              <div className="flex gap-2 p-1 rounded-lg border" style={{ backgroundColor: isDark ? "#1e293b" : "#f8fafc", borderColor }}>
                <button
                  type="button"
                  onClick={() => setType("Lost")}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: type === "Lost" ? (isDark ? "#ef4444" : "#fee2e2") : "transparent",
                    color: type === "Lost" ? (isDark ? "#ffffff" : "#ef4444") : (isDark ? "#94a3b8" : "#64748b"),
                  }}
                >
                  Lost
                </button>
                <button
                  type="button"
                  onClick={() => setType("Found")}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: type === "Found" ? (isDark ? "#10b981" : "#d1fae5") : "transparent",
                    color: type === "Found" ? (isDark ? "#ffffff" : "#10b981") : (isDark ? "#94a3b8" : "#64748b"),
                  }}
                >
                  Found
                </button>
              </div>
            </div>
            <div className="w-1/2">
              <Input
                label="What kind of item is it?"
                value={category}
                onChange={setCategory}
                theme={theme}
              />
            </div>
          </div>

          <Input
            label="What is the item?"
            value={title}
            onChange={setTitle}
            required
            theme={theme}
          />

          <div className="flex flex-col gap-1.5 w-full text-left">
            <label className="text-xs font-semibold uppercase tracking-wide opacity-80" style={{ color: finalTextColor }}>
              Can you describe it?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              style={{
                backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                borderColor: isDark ? "#334155" : "#e2e8f0",
                color: finalTextColor,
                padding: "10px 14px",
              }}
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <Input
                label="Where did you lose/find it?"
                value={location}
                onChange={setLocation}
                required
                theme={theme}
              />
            </div>
            <div className="w-1/2">
              <Input
                label="When did this happen?"
                type="date"
                value={date}
                onChange={setDate}
                required
                theme={theme}
              />
            </div>
          </div>

          <Input
            label="How can someone get in touch with you?"
            value={contact}
            onChange={setContact}
            required
            theme={theme}
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg hover:opacity-80 transition-all cursor-pointer"
              style={{ color: finalTextColor }}
            >
              Cancel
            </button>
            <Button
              name="Save Changes"
              theme={theme}
              textColor={isDark ? "#ffffff" : "#0f172a"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;
