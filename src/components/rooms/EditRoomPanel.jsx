"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AirVent,
  CircleCheckBig,
  Coffee,
  DoorOpen,
  FileText,
  ImagePlus,
  LayoutGrid,
  Monitor,
  Pencil,
  Presentation,
  Upload,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { roomsApi } from "@/lib/api";
import { isRemoteImage, resolveRoomImage } from "@/lib/images";
import {
  AMENITY_ID_TO_API,
  apiAmenitiesToFormIds,
  floorToInputValue,
  getRoomTypeId,
  LIBRARY_BRANCHES,
  normalizeFloor,
  ROOM_TYPES,
} from "@/lib/roomConstants";

const LIBRARY_BRANCH_OPTIONS = LIBRARY_BRANCHES.filter((b) => b.value);

const FORM_AMENITIES = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "power", label: "Power", icon: Zap },
  { id: "whiteboard", label: "Whiteboard", icon: Presentation },
  { id: "monitor", label: "Monitor", icon: Monitor },
  { id: "ac", label: "AC", icon: AirVent },
  { id: "cafe", label: "Cafe Near", icon: Coffee },
];

const inputClass =
  "w-full rounded-full border-none bg-surface-variant px-5 py-3 text-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary";

function SectionHeader({ icon: Icon, title, className }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon className={`h-5 w-5 ${className}`} strokeWidth={2.25} aria-hidden />
      <h3 className={`text-base font-bold ${className}`}>{title}</h3>
    </div>
  );
}

function RadioOption({ label, checked, onChange }) {
  return (
    <label className="group flex cursor-pointer items-center rounded-full bg-surface-variant p-3 transition-colors hover:bg-primary-container">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
          checked
            ? "border-primary bg-primary"
            : "border-[#907898] bg-transparent"
        }`}
      >
        {checked ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
      </span>
      <span
        className={`text-sm font-medium ${
          checked ? "text-on-primary-container" : "text-on-surface"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

function AmenityOption({ label, icon: Icon, checked, onToggle }) {
  return (
    <label
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl p-3 transition-all ${
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
      <Icon className="mb-1 h-5 w-5" strokeWidth={2} aria-hidden />
      <span className="text-[10px] font-bold">{label}</span>
    </label>
  );
}

function initFormState(room) {
  const image = resolveRoomImage(room.image);
  return {
    roomName: room.name ?? "",
    libraryBranch:
      room.libraryBranch || LIBRARY_BRANCH_OPTIONS[0]?.value || "Central Library",
    floor: floorToInputValue(room.floor) || "1",
    capacity: String(room.capacity ?? 1),
    roomType: getRoomTypeId(room),
    pricePerHour: String(room.hourlyRate ?? 0),
    description: room.description ?? "",
    imageUrl: room.image ?? image,
    previewImage: image,
    amenities: apiAmenitiesToFormIds(room.amenities),
  };
}

export default function EditRoomPanel({ room, open, onClose, onSaved }) {
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState(() => initFormState(room));

  const resetForm = useCallback(() => {
    setForm(initFormState(room));
  }, [room]);

  useEffect(() => {
    if (open) resetForm();
  }, [open, resetForm]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, saving]);

  const roomTypeLabel =
    ROOM_TYPES.find((t) => t.id === form.roomType)?.label ?? "Quiet Zone";

  const previewSrc = resolveRoomImage(form.previewImage);
  const previewUsesRemote = isRemoteImage(previewSrc);

  const displayPrice = useMemo(() => {
    const parsed = Number.parseFloat(form.pricePerHour);
    return Number.isFinite(parsed) ? parsed.toFixed(2) : "0.00";
  }, [form.pricePerHour]);

  const patch = (updates) => setForm((prev) => ({ ...prev, ...updates }));

  const toggleAmenity = (id) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((item) => item !== id)
        : [...prev.amenities, id],
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload/room-image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");

      patch({ imageUrl: data.url, previewImage: data.url });
      toast.success("Image updated");
    } catch (err) {
      toast.error(err.message || "Could not upload image.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.roomName.trim()) {
      toast.error("Please enter a room name.");
      return;
    }

    const trimmedImage = form.imageUrl.trim();
    if (!trimmedImage) {
      toast.error("Please provide an image URL or upload a photo.");
      return;
    }
    if (trimmedImage.startsWith("blob:")) {
      toast.error("Wait for the upload to finish.");
      return;
    }

    let apiAmenities = form.amenities
      .map((id) => AMENITY_ID_TO_API[id])
      .filter(Boolean);

    if (form.roomType === "quiet" && !apiAmenities.includes("Quiet Zone")) {
      apiAmenities.push("Quiet Zone");
    }
    if (form.roomType === "tech-heavy" && !apiAmenities.includes("Projector")) {
      apiAmenities.push("Projector");
    }

    setSaving(true);
    try {
      const data = await roomsApi.update(room.id, {
        name: form.roomName.trim(),
        description: form.description.trim(),
        image: trimmedImage,
        libraryBranch: form.libraryBranch,
        floor: normalizeFloor(form.floor),
        capacity: Number(form.capacity),
        hourlyRate: Number(form.pricePerHour),
        roomType: form.roomType,
        amenities: apiAmenities,
      });
      toast.success("Listing updated successfully");
      onSaved?.(data.room);
      onClose();
    } catch (err) {
      toast.error(err.message || "Could not update listing.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="edit-room-title">
      <button
        type="button"
        aria-label="Close edit panel"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={() => !saving && onClose()}
      />

      <div className="relative flex h-full w-full max-w-xl flex-col bg-surface shadow-2xl sm:max-w-2xl lg:max-w-3xl">
        <header className="flex shrink-0 items-center justify-between border-b border-outline-variant/30 bg-surface px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container">
              <Pencil className="h-5 w-5 text-primary" strokeWidth={2.25} />
            </span>
            <div>
              <h2 id="edit-room-title" className="text-lg font-black text-on-surface md:text-xl">
                Edit listing
              </h2>
              <p className="text-xs font-medium text-on-surface-variant">
                Update how your nook appears to students
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-6 md:px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
              <div className="space-y-6 lg:col-span-3">
                <article className="rounded-xl bg-white p-5 candy-shadow-secondary md:p-6">
                  <SectionHeader
                    icon={DoorOpen}
                    title="Room identity"
                    className="text-secondary"
                  />
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="edit-roomName" className="mb-1.5 block px-1 text-xs font-bold text-on-surface-variant">
                        Room name
                      </label>
                      <input
                        id="edit-roomName"
                        required
                        value={form.roomName}
                        onChange={(e) => patch({ roomName: e.target.value })}
                        placeholder="e.g. The Pink Oasis"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-libraryBranch" className="mb-1.5 block px-1 text-xs font-bold text-on-surface-variant">
                        Library branch
                      </label>
                      <select
                        id="edit-libraryBranch"
                        value={form.libraryBranch}
                        onChange={(e) => patch({ libraryBranch: e.target.value })}
                        className={`${inputClass} appearance-none`}
                      >
                        {LIBRARY_BRANCH_OPTIONS.map((branch) => (
                          <option key={branch.value} value={branch.value}>
                            {branch.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="edit-floor" className="mb-1.5 block px-1 text-xs font-bold text-on-surface-variant">
                          Floor
                        </label>
                        <input
                          id="edit-floor"
                          type="number"
                          min={0}
                          required
                          value={form.floor}
                          onChange={(e) => patch({ floor: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-capacity" className="mb-1.5 block px-1 text-xs font-bold text-on-surface-variant">
                          Capacity
                        </label>
                        <input
                          id="edit-capacity"
                          type="number"
                          min={1}
                          required
                          value={form.capacity}
                          onChange={(e) => patch({ capacity: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                </article>

                <article className="rounded-xl bg-white p-5 candy-shadow-secondary md:p-6">
                  <SectionHeader
                    icon={LayoutGrid}
                    title="Vibe & value"
                    className="text-tertiary"
                  />
                  <p className="mb-3 px-1 text-xs font-bold text-on-surface-variant">
                    Room type
                  </p>
                  <div className="mb-4 grid gap-2">
                    {ROOM_TYPES.map((type) => (
                      <RadioOption
                        key={type.id}
                        label={type.label}
                        checked={form.roomType === type.id}
                        onChange={() => patch({ roomType: type.id })}
                      />
                    ))}
                  </div>
                  <div>
                    <label htmlFor="edit-price" className="mb-1.5 block px-1 text-xs font-bold text-on-surface-variant">
                      Price per hour ($)
                    </label>
                    <div className="relative">
                      <span className="absolute top-1/2 left-5 -translate-y-1/2 text-sm font-bold text-primary">
                        $
                      </span>
                      <input
                        id="edit-price"
                        type="number"
                        min={0}
                        step={0.01}
                        required
                        value={form.pricePerHour}
                        onChange={(e) => patch({ pricePerHour: e.target.value })}
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </div>
                </article>

                <article className="rounded-xl bg-white p-5 candy-shadow-secondary md:p-6">
                  <SectionHeader
                    icon={FileText}
                    title="Description"
                    className="text-primary"
                  />
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => patch({ description: e.target.value })}
                    placeholder="Describe the atmosphere, view, or equipment…"
                    className="w-full resize-none rounded-2xl border-none bg-surface-variant px-5 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
                  />
                </article>

                <article className="rounded-xl bg-white p-5 candy-shadow-secondary md:p-6">
                  <SectionHeader
                    icon={ImagePlus}
                    title="Photo"
                    className="text-secondary"
                  />
                  <label htmlFor="edit-imageUrl" className="mb-1.5 block px-1 text-xs font-bold text-on-surface-variant">
                    Image URL
                  </label>
                  <input
                    id="edit-imageUrl"
                    required
                    value={form.imageUrl}
                    onChange={(e) => {
                      const value = e.target.value;
                      patch({
                        imageUrl: value,
                        previewImage:
                          value.startsWith("http") || value.startsWith("/images/")
                            ? value
                            : form.previewImage,
                      });
                    }}
                    placeholder="/images/uploads/… or https://…"
                    className={`${inputClass} mb-3`}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#dcc8e0] py-6 text-sm font-bold text-on-surface-variant transition-colors hover:border-primary hover:bg-primary-container/30 disabled:opacity-70"
                  >
                    <Upload className={`h-5 w-5 text-primary ${uploadingImage ? "animate-pulse" : ""}`} />
                    {uploadingImage ? "Uploading…" : "Upload new photo"}
                  </button>
                </article>

                <article className="rounded-xl bg-white p-5 candy-shadow-secondary md:p-6">
                  <SectionHeader
                    icon={CircleCheckBig}
                    title="Amenities"
                    className="text-tertiary"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    {FORM_AMENITIES.map((amenity) => (
                      <AmenityOption
                        key={amenity.id}
                        label={amenity.label}
                        icon={amenity.icon}
                        checked={form.amenities.includes(amenity.id)}
                        onToggle={() => toggleAmenity(amenity.id)}
                      />
                    ))}
                  </div>
                </article>
              </div>

              <aside className="lg:col-span-2">
                <div className="sticky top-0 rounded-xl border border-outline-variant/20 bg-white p-4 candy-shadow-secondary lg:top-6">
                  <p className="mb-3 text-xs font-black tracking-wider text-on-surface-variant uppercase">
                    Live preview
                  </p>
                  <div className="relative mb-3 aspect-video overflow-hidden rounded-xl bg-surface-variant">
                    <Image
                      src={previewSrc}
                      alt={form.roomName || "Room preview"}
                      fill
                      sizes="320px"
                      className="object-cover"
                      unoptimized={previewUsesRemote}
                    />
                    <span className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary">
                      ${displayPrice}/hr
                    </span>
                  </div>
                  <h4 className="mb-1 text-lg font-black text-on-surface line-clamp-1">
                    {form.roomName.trim() || "Your room name"}
                  </h4>
                  <p className="mb-3 text-xs text-on-surface-variant line-clamp-2">
                    {form.description.trim() || "Your description will appear here."}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-secondary-container px-2.5 py-0.5 text-[10px] font-bold text-on-secondary-container">
                      {roomTypeLabel}
                    </span>
                    <span className="rounded-full bg-surface-variant px-2.5 py-0.5 text-[10px] font-bold text-on-surface-variant">
                      {form.capacity || "—"} people
                    </span>
                    <span className="rounded-full bg-surface-variant px-2.5 py-0.5 text-[10px] font-bold text-on-surface-variant">
                      Floor {form.floor || "—"}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <footer className="flex shrink-0 gap-3 border-t border-outline-variant/30 bg-surface px-5 py-4 md:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-full border-2 border-[#dcc8e0] py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="flex-[1.2] rounded-full bg-primary py-3 text-sm font-black text-on-primary candy-shadow-primary transition-all hover:scale-[1.02] disabled:opacity-70"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
