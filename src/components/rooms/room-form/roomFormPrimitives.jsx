import {
  AirVent,
  Coffee,
  Monitor,
  Presentation,
  Wifi,
  Zap,
} from "lucide-react";

export const ROOM_FORM_INPUT_CLASS =
  "w-full rounded-full border-none bg-surface-variant px-6 py-3 text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary";

export const ROOM_FORM_INPUT_CLASS_COMPACT =
  "w-full rounded-full border-none bg-surface-variant px-5 py-3 text-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary";

export const ROOM_FORM_AMENITIES = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "power", label: "Power", icon: Zap },
  { id: "whiteboard", label: "Whiteboard", icon: Presentation },
  { id: "monitor", label: "Monitor", icon: Monitor },
  { id: "ac", label: "AC", icon: AirVent },
  { id: "cafe", label: "Cafe Near", icon: Coffee },
];

export function SectionHeader({ icon: Icon, title, className, size = "default" }) {
  const isCompact = size === "compact";
  return (
    <div
      className={`flex items-center ${isCompact ? "mb-4 gap-2" : "mb-2 gap-3"}`}
    >
      <Icon
        className={`${isCompact ? "h-5 w-5" : "h-6 w-6"} ${className}`}
        strokeWidth={2.25}
        aria-hidden
      />
      <h2
        className={`font-bold ${className} ${isCompact ? "text-base" : "text-xl"}`}
      >
        {title}
      </h2>
    </div>
  );
}

export function RadioOption({
  name,
  value,
  label,
  checked,
  onChange,
  size = "default",
}) {
  const isCompact = size === "compact";
  return (
    <label className="group flex cursor-pointer items-center rounded-full bg-surface-variant p-3 transition-colors hover:bg-primary-container">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`mr-3 flex ${isCompact ? "h-5 w-5" : "h-6 w-6"} items-center justify-center rounded-full border-2 ${
          checked
            ? "border-primary bg-primary"
            : "border-[#907898] bg-transparent"
        }`}
      >
        {checked ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
      </span>
      <span
        className={`font-medium ${isCompact ? "text-sm" : ""} ${
          checked ? "text-on-primary-container" : "text-on-surface"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

export function AmenityOption({ label, icon: Icon, checked, onToggle, size = "default" }) {
  const isCompact = size === "compact";
  return (
    <label
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl transition-all ${
        isCompact ? "p-3" : "p-4"
      } ${
        checked
          ? "bg-[#c8eaff] text-tertiary"
          : "bg-surface-variant text-on-surface-variant hover:bg-[#c8eaff]/60"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="sr-only"
      />
      <Icon
        className={`mb-1 ${isCompact ? "h-5 w-5" : "h-6 w-6"}`}
        strokeWidth={2}
        aria-hidden
      />
      <span className={`font-bold ${isCompact ? "text-[10px]" : "text-xs"}`}>
        {label}
      </span>
    </label>
  );
}
