"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { isRemoteImage } from "@/lib/images";
import { roomsApi } from "@/lib/api";
import { ROUTES } from "@/lib/routes";
import { DEFAULT_ROOM_IMAGE } from "@/lib/images";
import {
  AMENITY_ID_TO_API,
  LIBRARY_BRANCHES,
  normalizeFloor,
  ROOM_TYPES,
} from "@/lib/roomConstants";
import {
  AirVent,
  CircleCheckBig,
  Coffee,
  DoorOpen,
  FileText,
  ImagePlus,
  LayoutGrid,
  Monitor,
  Presentation,
  Rocket,
  Star,
  Upload,
  Wifi,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

const LIBRARY_BRANCH_OPTIONS = LIBRARY_BRANCHES.filter((b) => b.value);

const AMENITIES = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "power", label: "Power", icon: Zap },
  { id: "whiteboard", label: "Whiteboard", icon: Presentation },
  { id: "monitor", label: "Monitor", icon: Monitor },
  { id: "ac", label: "AC", icon: AirVent },
  { id: "cafe", label: "Cafe Near", icon: Coffee },
];

const DEFAULT_PREVIEW_IMAGE = DEFAULT_ROOM_IMAGE;

const inputClass =
  "w-full rounded-full border-none bg-surface-variant px-6 py-3 text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary";

function SectionHeader({ icon: Icon, title, className }) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <Icon className={`h-6 w-6 ${className}`} strokeWidth={2.25} aria-hidden />
      <h2 className={`text-xl font-bold ${className}`}>{title}</h2>
    </div>
  );
}

function RadioOption({ name, value, label, checked, onChange }) {
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
        className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
          checked
            ? "border-primary bg-primary"
            : "border-[#907898] bg-transparent"
        }`}
      >
        {checked ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
      </span>
      <span
        className={`font-medium ${
          checked ? "text-on-primary-container" : "text-on-surface"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

function AmenityOption({ id, label, icon: Icon, checked, onToggle }) {
  return (
    <label
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl p-4 transition-all ${
        checked
          ? "bg-[#c8eaff] text-tertiary"
          : "bg-surface-variant text-on-surface-variant hover:bg-[#c8eaff]/60"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(id)}
        className="sr-only"
      />
      <Icon className="mb-1 h-6 w-6" strokeWidth={2} aria-hidden />
      <span className="text-xs font-bold">{label}</span>
    </label>
  );
}

export default function AddRoomForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const previewBlobRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [libraryBranch, setLibraryBranch] = useState(
    LIBRARY_BRANCH_OPTIONS[0]?.value ?? "Central Library",
  );
  const [floor, setFloor] = useState("3");
  const [capacity, setCapacity] = useState("4");
  const [roomType, setRoomType] = useState("quiet");
  const [pricePerHour, setPricePerHour] = useState("5");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(DEFAULT_ROOM_IMAGE);
  const [amenities, setAmenities] = useState([]);
  const [previewImage, setPreviewImage] = useState(DEFAULT_PREVIEW_IMAGE);

  const roomTypeLabel =
    ROOM_TYPES.find((type) => type.id === roomType)?.label ?? "Quiet Zone";

  const displayPrice = useMemo(() => {
    const parsed = Number.parseFloat(pricePerHour);
    return Number.isFinite(parsed) ? parsed.toFixed(2) : "0.00";
  }, [pricePerHour]);

  const previewTitle = roomName.trim() || "The Pink Oasis";
  const previewDescription =
    description.trim() ||
    "This is how your room will appear to students. It looks welcoming and perfectly suited for deep focus or group brainstorming sessions.";

  const toggleAmenity = (id) => {
    setAmenities((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  useEffect(() => {
    return () => {
      if (previewBlobRef.current) {
        URL.revokeObjectURL(previewBlobRef.current);
        previewBlobRef.current = null;
      }
    };
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload/room-image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (previewBlobRef.current) {
        URL.revokeObjectURL(previewBlobRef.current);
        previewBlobRef.current = null;
      }

      setImageUrl(data.url);
      setPreviewImage(data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message || "Could not upload image.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!roomName.trim()) {
      toast.error("Please enter a room name.");
      return;
    }

    const trimmedImage = imageUrl.trim();

    if (!trimmedImage) {
      toast.error("Please provide an image URL or upload a photo.");
      return;
    }

    if (trimmedImage.startsWith("blob:")) {
      toast.error("Wait for the upload to finish, or paste an image URL.");
      return;
    }

    const apiAmenities = amenities
      .map((id) => AMENITY_ID_TO_API[id])
      .filter(Boolean);

    if (roomType === "quiet" && !apiAmenities.includes("Quiet Zone")) {
      apiAmenities.push("Quiet Zone");
    }
    if (roomType === "tech-heavy" && !apiAmenities.includes("Projector")) {
      apiAmenities.push("Projector");
    }

    setIsSubmitting(true);
    try {
      await roomsApi.create({
        name: roomName.trim(),
        description: description.trim(),
        image: trimmedImage,
        libraryBranch,
        floor: normalizeFloor(floor),
        capacity: Number(capacity),
        hourlyRate: Number(pricePerHour),
        roomType,
        amenities: apiAmenities,
      });
      toast.success("Room added successfully");
      router.push(ROUTES.myListings);
    } catch (err) {
      toast.error(err.message || "Could not add room.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewUsesRemote = isRemoteImage(previewImage);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-primary md:text-5xl">
          List Your Study Sweet Spot
        </h1>
        <p className="text-lg text-on-surface-variant">
          Make it easy for students to find their perfect learning sanctuary.
        </p>
      </section>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="flex flex-col space-y-6 rounded-xl bg-white p-8 candy-shadow-secondary">
            <SectionHeader
              icon={DoorOpen}
              title="Room Identity"
              className="text-secondary"
            />
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="roomName"
                  className="mb-2 block px-2 text-sm font-bold text-on-surface-variant"
                >
                  Room Name
                </label>
                <input
                  id="roomName"
                  name="roomName"
                  type="text"
                  required
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. The Pink Oasis"
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="libraryBranch"
                  className="mb-2 block px-2 text-sm font-bold text-on-surface-variant"
                >
                  Library Branch
                </label>
                <select
                  id="libraryBranch"
                  name="libraryBranch"
                  value={libraryBranch}
                  onChange={(e) => setLibraryBranch(e.target.value)}
                  className={`${inputClass} appearance-none`}
                >
                  {LIBRARY_BRANCH_OPTIONS.map((branch) => (
                    <option key={branch.value} value={branch.value}>
                      {branch.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="floor"
                    className="mb-2 block px-2 text-sm font-bold text-on-surface-variant"
                  >
                    Floor
                  </label>
                  <input
                    id="floor"
                    name="floor"
                    type="number"
                    min="0"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder="2"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="capacity"
                    className="mb-2 block px-2 text-sm font-bold text-on-surface-variant"
                  >
                    Capacity
                  </label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="4"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </article>

          <article className="flex flex-col space-y-6 rounded-xl bg-white p-8 candy-shadow-secondary">
            <SectionHeader
              icon={LayoutGrid}
              title="Vibe & Value"
              className="text-tertiary"
            />
            <div className="space-y-6">
              <div>
                <p className="mb-4 px-2 text-sm font-bold text-on-surface-variant">
                  Room Type
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {ROOM_TYPES.map((type) => (
                    <RadioOption
                      key={type.id}
                      name="roomType"
                      value={type.id}
                      label={type.label}
                      checked={roomType === type.id}
                      onChange={() => setRoomType(type.id)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="pricePerHour"
                  className="mb-2 block px-2 text-sm font-bold text-on-surface-variant"
                >
                  Price per Hour ($)
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-6 -translate-y-1/2 font-bold text-primary">
                    $
                  </span>
                  <input
                    id="pricePerHour"
                    name="pricePerHour"
                    type="number"
                    min="0"
                    step="0.01"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    placeholder="5.00"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>
          </article>
        </div>

        <article className="rounded-xl bg-white p-8 candy-shadow-secondary">
          <SectionHeader
            icon={FileText}
            title="The Full Story"
            className="text-primary"
          />
          <textarea
            name="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the atmosphere, view, or specific equipment..."
            className="w-full resize-none rounded-2xl border-none bg-surface-variant px-6 py-4 text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
          />
        </article>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="rounded-xl bg-white p-8 candy-shadow-secondary">
            <SectionHeader
              icon={ImagePlus}
              title="Room Photos"
              className="text-secondary"
            />
            <div className="mb-4">
              <label
                htmlFor="imageUrl"
                className="mb-2 block px-2 text-sm font-bold text-on-surface-variant"
              >
                Image URL or upload below
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="text"
                required
                value={imageUrl}
                onChange={(e) => {
                  const value = e.target.value;
                  setImageUrl(value);
                  if (
                    value.startsWith("http") ||
                    value.startsWith("/images/")
                  ) {
                    setPreviewImage(value);
                  }
                }}
                placeholder="https://example.com/room.jpg or upload below"
                className={inputClass}
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={handleImageChange}
            />
            <button
              type="button"
              disabled={isUploadingImage}
              onClick={() => fileInputRef.current?.click()}
              className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-4 border-dashed border-[#dcc8e0] p-8 text-center transition-colors hover:border-primary disabled:cursor-wait disabled:opacity-70"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container transition-transform group-hover:scale-110">
                <Upload
                  className={`h-8 w-8 text-primary ${isUploadingImage ? "animate-pulse" : ""}`}
                  strokeWidth={2}
                />
              </div>
              <p className="font-bold text-on-surface-variant">
                {isUploadingImage ? "Uploading…" : "Click to upload an image"}
              </p>
              <p className="text-sm text-[#907898]">
                JPEG, PNG, WebP, or GIF — max 5 MB
              </p>
            </button>
          </article>

          <article className="rounded-xl bg-white p-8 candy-shadow-secondary">
            <SectionHeader
              icon={CircleCheckBig}
              title="Amenities"
              className="text-tertiary"
            />
            <div className="grid grid-cols-3 gap-4">
              {AMENITIES.map((amenity) => (
                <AmenityOption
                  key={amenity.id}
                  {...amenity}
                  checked={amenities.includes(amenity.id)}
                  onToggle={toggleAmenity}
                />
              ))}
            </div>
          </article>
        </div>

        <div className="flex justify-center pt-8">
          <button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-primary px-12 py-5 text-xl font-black text-on-primary candy-shadow-primary transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[1.03] active:scale-[0.97] disabled:opacity-80"
          >
            <span className="absolute inset-0 translate-y-full bg-white/20 transition-transform group-hover:translate-y-0" />
            <span className="relative flex items-center gap-3">
              {isSubmitting ? "Listing Nook..." : "Create This Nook!"}
              <Rocket
                className={`h-6 w-6 ${isSubmitting ? "animate-spin" : ""}`}
                strokeWidth={2.5}
              />
            </span>
          </button>
        </div>
      </form>

      <section className="mt-20">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-0.5 grow bg-[#dcc8e0]" />
          <h3 className="text-sm font-black tracking-widest text-secondary uppercase">
            Visual Preview
          </h3>
          <div className="h-0.5 grow bg-[#dcc8e0]" />
        </div>

        <article className="relative mx-auto max-w-2xl overflow-hidden rounded-xl border-8 border-white bg-white candy-shadow-secondary">
          <div className="relative aspect-video w-full bg-surface-variant">
            <Image
              src={previewImage}
              alt={previewTitle}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              unoptimized={previewUsesRemote}
            />
            <div className="absolute top-4 right-4 rounded-full bg-primary px-4 py-1 text-sm font-bold text-on-primary shadow-lg">
              ${displayPrice}/hr
            </div>
          </div>
          <div className="p-8">
            <div className="mb-2 flex items-start justify-between gap-4">
              <h4 className="text-2xl font-black text-on-surface">
                {previewTitle}
              </h4>
              <div className="flex shrink-0 items-center gap-1">
                <Star
                  className="h-5 w-5 fill-primary text-primary"
                  strokeWidth={0}
                />
                <span className="font-bold">New</span>
              </div>
            </div>
            <p className="mb-6 line-clamp-2 text-on-surface-variant">
              {previewDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-container">
                {roomTypeLabel}
              </span>
              <span className="rounded-full bg-surface-variant px-3 py-1 text-xs font-bold text-on-surface-variant">
                {capacity || "4"} People
              </span>
              <span className="rounded-full bg-surface-variant px-3 py-1 text-xs font-bold text-on-surface-variant">
                Floor {floor || "2"}
              </span>
              {amenities.map((id) => {
                const amenity = AMENITIES.find((item) => item.id === id);
                return amenity ? (
                  <span
                    key={id}
                    className="rounded-full bg-[#c8eaff] px-3 py-1 text-xs font-bold text-tertiary"
                  >
                    {amenity.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
