"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2Icon,
  ImagePlusIcon,
  Loader2Icon,
  UploadCloudIcon,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const;

const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const;

type ServiceMode = (typeof SERVICE_MODES)[number];

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

/** Upload straight to ImgBB from the browser and return the hosted URL. */
const uploadImage = async (file: File): Promise<string> => {
  if (!IMGBB_API_KEY) {
    throw new Error(
      "ImgBB key missing. Add NEXT_PUBLIC_IMGBB_API_KEY to .env.local and restart the dev server.",
    );
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(IMGBB_API_KEY)}`,
    { method: "POST", body: formData },
  );

  const data = (await response.json()) as {
    success?: boolean;
    data?: { url?: string };
    error?: { message?: string };
  };

  if (!data.success || !data.data?.url) {
    throw new Error(data.error?.message ?? "Image upload failed.");
  }

  return data.data.url;
};

type FormState = {
  title: string;
  category: string;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
};

type FormErrors = Partial<Record<keyof FormState | "image", string>>;

const INITIAL_FORM: FormState = {
  title: "",
  category: "",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "Home Visit",
  serviceArea: "",
};

const AddServiceForm = ({
  technicianName,
  technicianEmail,
}: {
  technicianName: string;
  technicianEmail: string;
}) => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({
        ...current,
        image: "Please choose an image file.",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        image: "Image must be smaller than 5 MB.",
      }));
      return;
    }

    setUploading(true);
    setImageUrl(null);
    setImageName(file.name);
    setErrors((current) => ({ ...current, image: undefined }));

    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      toast.add({
        title: "Image uploaded",
        description: "Your service banner is ready.",
        type: "success",
      });
    } catch (error) {
      setImageName(null);
      const message =
        error instanceof Error ? error.message : "Image upload failed.";
      setErrors((current) => ({ ...current, image: message }));
      toast.add({
        title: "Upload failed",
        description: message,
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (form.title.trim().length < 5) {
      next.title = "Title must be at least 5 characters.";
    }
    if (!form.category) {
      next.category = "Please choose a category.";
    }
    if (form.description.trim().length < 20) {
      next.description = "Description must be at least 20 characters.";
    }
    const price = Number(form.basePrice);
    if (!form.basePrice || !Number.isFinite(price) || price <= 0) {
      next.basePrice = "Enter a price greater than 0.";
    }
    if (!form.estimatedDuration.trim()) {
      next.estimatedDuration = "Tell customers how long this usually takes.";
    }
    if (!form.serviceArea.trim()) {
      next.serviceArea = "Please enter the area you cover.";
    }
    if (!imageUrl) {
      next.image = "Upload a service image first.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate() || !imageUrl) return;

    setSubmitting(true);
    toast.add({
      title: "API integration pending",
      description:
        "The form is ready. Upload and publishing will be connected when the backend routes are added.",
      type: "info",
    });
    setSubmitting(false);
  };

  const busy = uploading || submitting;

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Service details
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Customers will see this information on your service card.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="title">Service title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="e.g. iPhone Screen Replacement"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <p className="text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <Select
              value={form.category}
              onValueChange={(value) => update("category", value ?? "")}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-red-600">{errors.category}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="basePrice">Starting price (USD)</Label>
            <Input
              id="basePrice"
              type="number"
              min="1"
              step="0.01"
              value={form.basePrice}
              onChange={(event) => update("basePrice", event.target.value)}
              placeholder="49.00"
              aria-invalid={Boolean(errors.basePrice)}
            />
            {errors.basePrice && (
              <p className="text-xs text-red-600">{errors.basePrice}</p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Describe what is included, your experience, and any warranty..."
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description ? (
              <p className="text-xs text-red-600">{errors.description}</p>
            ) : (
              <p className="text-xs text-slate-400">
                Minimum 20 characters · {form.description.trim().length}/20
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="estimatedDuration">Estimated duration</Label>
            <Input
              id="estimatedDuration"
              value={form.estimatedDuration}
              onChange={(event) =>
                update("estimatedDuration", event.target.value)
              }
              placeholder="e.g. 2-3 hours"
              aria-invalid={Boolean(errors.estimatedDuration)}
            />
            {errors.estimatedDuration && (
              <p className="text-xs text-red-600">{errors.estimatedDuration}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="serviceArea">Service area</Label>
            <Input
              id="serviceArea"
              value={form.serviceArea}
              onChange={(event) => update("serviceArea", event.target.value)}
              placeholder="e.g. Dhanmondi, Dhaka"
              aria-invalid={Boolean(errors.serviceArea)}
            />
            {errors.serviceArea && (
              <p className="text-xs text-red-600">{errors.serviceArea}</p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label>Service mode</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SERVICE_MODES.map((mode) => {
                const selected = form.serviceMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update("serviceMode", mode)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
                      selected
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    <span
                      className={`flex size-5 items-center justify-center rounded-full border ${
                        selected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {selected && <CheckCircle2Icon className="size-3.5" />}
                    </span>
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            Service image
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Upload a clear banner image (max 5 MB).
          </p>

          <label
            htmlFor="serviceImage"
            className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Uploaded service preview"
                width={480}
                height={240}
                unoptimized
                className="h-36 w-full rounded-lg object-cover"
              />
            ) : (
              <ImagePlusIcon className="size-8 text-blue-500" />
            )}
            <span className="mt-3 text-sm font-medium text-slate-700">
              {uploading
                ? "Uploading to ImgBB..."
                : imageUrl
                  ? "Change image"
                  : "Click to upload"}
            </span>
            <span className="mt-1 text-xs text-slate-400">
              PNG, JPG or WEBP
            </span>
            <input
              id="serviceImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
          {errors.image && (
            <p className="mt-2 text-xs text-red-600">{errors.image}</p>
          )}
          {imageName && (
            <p className="mt-2 truncate text-xs text-slate-500">{imageName}</p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Offered by</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="text-xs text-slate-400">Technician</p>
              <p className="font-medium text-slate-800">{technicianName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="truncate font-medium text-slate-800">
                {technicianEmail}
              </p>
            </div>
          </div>
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
            Your service stays <strong>pending</strong> until an admin approves
            it.
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={busy}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {busy ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              {uploading ? "Uploading..." : "Publishing..."}
            </>
          ) : (
            <>
              <UploadCloudIcon className="size-4" />
              Publish Service
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddServiceForm;
