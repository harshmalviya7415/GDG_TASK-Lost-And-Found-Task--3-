import { MapPin, Calendar, Mail, Tag } from "lucide-react";
import Button from "./Button";

export interface Item {
  id: string;
  _id?: string;
  title: string;
  description: string;
  type: "Lost" | "Found";
  location: string;
  date: string;
  contact: string;
  category?: string;
  createdBy?: any;
  currentStep?: string;
  workflowStatus?: string;
  claimantIds?: string[];
}

interface ItemCardProps {
  item: Item;
  theme?: string;
  textColor?: string;
  fontSize?: number;
  padding?: number;
  onClaimClick?: () => void;
  onFoundClick?: () => void;
  onCardClick?: () => void;
  currentUser?: any;
}

const ItemCard = ({
  item,
  padding,
  textColor,
  fontSize,
  theme,
  onClaimClick,
  onFoundClick,
  onCardClick,
  currentUser,
}: ItemCardProps) => {
  const isDark = theme === "dark";

  const backgroundColor = isDark ? "#1e293b" : "#ffffff";
  const finalTextColor = textColor || (isDark ? "#ffffff" : "#0f172a");
  const borderColor = isDark ? "#334155" : "#e2e8f0";

  const itemType = item.type || "Found";
  const isLost = itemType.toLowerCase() === "lost";
  const badgeColor = isLost ? "#ef4444" : "#10b981";
  const badgeBg = isLost ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)";

  return (
    <div
      onClick={onCardClick}
      className="rounded-xl border flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left cursor-pointer hover:border-blue-400"
      style={{
        backgroundColor,
        borderColor,
        padding: padding !== undefined ? `${padding}px` : "20px",
        color: finalTextColor,
        fontSize: fontSize !== undefined ? `${fontSize}px` : undefined,
      }}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: badgeBg,
              color: badgeColor,
            }}
          >
            {itemType}
          </span>
          {item.category && (
            <span className="flex items-center gap-1 text-xs opacity-60">
              <Tag size={12} />
              {item.category}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2 tracking-tight">{item.title}</h3>

        <p className="text-sm opacity-70 mb-4 min-h-[40px] line-clamp-2">
          {item.description}
        </p>

        <div className="flex flex-col gap-2.5 text-xs opacity-60 mb-6">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-blue-500 shrink-0" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-blue-500 shrink-0" />
            <span>{item.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-blue-500 shrink-0" />
            <span className="truncate">{item.contact}</span>
          </div>
        </div>
      </div>

      <div
        className="mt-auto pt-4 border-t border-dashed w-full"
        style={{ borderColor: isDark ? "#334155" : "#e2e8f0" }}
        onClick={(e) => e.stopPropagation()}
      >
        {(() => {
          const currentUserId = currentUser?.id || currentUser?._id;
          const hasUserClaimed = !!(item.claimantIds && currentUserId && item.claimantIds.includes(currentUserId.toString()));

          const isFinalized = !!(item.currentStep &&
            ["WAITING_FOR_HANDOVER", "WAITING_FOR_RECEIVER_CONFIRMATION", "COMPLETED"].includes(item.currentStep));

          const isCompleted = item.currentStep === "COMPLETED";

          let buttonName = isLost ? "I Found This" : "Claim Item";
          let isDisabled = false;

          if (isCompleted) {
            buttonName = "Returned";
            isDisabled = true;
          } else if (isFinalized) {
            buttonName = "Claim In Progress";
            isDisabled = true;
          } else if (hasUserClaimed) {
            buttonName = "Claim In Progress";
            isDisabled = true;
          }

          return (
            <Button
              name={buttonName}
              theme={theme}
              padding={8}
              textColor={isDark ? "#ffffff" : "#0f172a"}
              onClick={isLost ? onFoundClick : onClaimClick}
              disabled={isDisabled}
            />
          );
        })()}
      </div>
    </div>
  );
};

export default ItemCard;
