// src/components/CategoryCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  subtitle?: string;
  categoryKey?: string;
  isClickable?: boolean; // when false: visually disabled and non-interactive
  onClick?: () => void; // optional override
  className?: string;
};

export default function CategoryCard({
  title,
  subtitle,
  categoryKey,
  isClickable = true,
  onClick,
  className = "",
}: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isClickable) return;
    if (onClick) {
      onClick();
      return;
    }
    navigate(`/category/${encodeURIComponent(categoryKey || title)}`);
  };

  const base =
    "rounded-xl p-6 flex flex-col items-center gap-3 transition-transform duration-300 transform will-change-transform shadow-sm";
  const enabledExtras =
    "hover:scale-[1.035] hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-100";
  const disabledExtras = "opacity-70 cursor-not-allowed";

  return (
    <div
      role={isClickable ? "button" : "presentation"}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) handleClick();
      }}
      tabIndex={isClickable ? 0 : -1}
      className={`${base} ${isClickable ? enabledExtras : disabledExtras} ${className}`}
      aria-disabled={!isClickable}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-white/60 backdrop-blur-sm shadow-inner">
        {/* If you want an icon slot, pass it via children or extend the component */}
        <span className="text-xl font-semibold text-gray-800">{title.charAt(0)}</span>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 text-center">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 text-center">{subtitle}</p>}
    </div>
  );
}
