"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { CameraIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/app/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { updateMyProfile } from "@/lib/api/users";
import type { DashboardUser } from "@/lib/dashboard-auth";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

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
  name: string;
  phone: string;
  area: string;
  bio: string;
};

type FormErrors = Partial<Record<keyof FormState | "image", string>>;

const ProfileForm = ({ user }: { user: DashboardUser }) => {
  const { refetch } = useSession();
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: user.name,
    phone: user.phone,
    area: user.area,
    bio: user.bio,
  });
  const [imageUrl, setImageUrl] = useState(user.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const setField = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrors((current) => ({ ...current, image: undefined }));

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

    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      toast.add({
        title: "Photo uploaded",
        description: "Click Save changes to apply it to your profile.",
        type: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Image upload failed.";
      setErrors((current) => ({ ...current, image: message }));
      toast.add({ title: "Upload failed", description: message, type: "error" });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const name = String(data.name ?? "").trim();
    const phone = String(data.phone ?? "").trim();
    const area = String(data.area ?? "").trim();
    const bio = String(data.bio ?? "").trim();
    const image = String(data.image ?? "").trim();

    const next: FormErrors = {};
    if (!name) next.name = "Name is required.";
    if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {
      next.phone = "Enter a valid phone number.";
    }
    if (bio.length > 300) next.bio = "Bio must be 300 characters or less.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);

    try {
      await updateMyProfile({
        name,
        image: image || null,
        phone,
        area,
        bio,
      });
      await authClient.getSession({
        query: { disableCookieCache: true },
      });
      await refetch();
      router.refresh();
      toast.add({
        title: "Profile updated",
        description: "Your details have been saved.",
        type: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save your profile.";
      toast.add({
        title: "Update failed",
        description: message,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const busy = uploading || saving;
  const initials = form.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[280px_1fr]"
    >
      <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
        <div className="mx-auto flex size-28 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={form.name}
              width={112}
              height={112}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-muted-foreground">
              {initials}
            </span>
          )}
        </div>

        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
          {uploading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <CameraIcon className="size-4" />
          )}
          {uploading ? "Uploading..." : "Change photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={busy}
          />
        </label>

        <p className="mt-2 text-xs text-muted-foreground">JPG or PNG, max 5 MB</p>
        {errors.image && (
          <p className="mt-2 text-xs text-destructive">{errors.image}</p>
        )}

        <div className="mt-6 border-t border-border pt-5">
          <p className="truncate font-medium text-foreground">{user.email}</p>
          <Badge className="mt-2" variant="outline">
            {user.role}
          </Badge>
        </div>
      </div>

      <input type="hidden" name="image" value={imageUrl} />

      <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Personal details
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This information is shown to customers on your services.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="profile-name">Full name</Label>
            <Input
              id="profile-name"
              name="name"
              className="mt-1.5"
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              disabled={busy}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="profile-phone">Phone</Label>
            <Input
              id="profile-phone"
              name="phone"
              className="mt-1.5"
              placeholder="01XXXXXXXXX"
              value={form.phone}
              onChange={(event) => setField("phone", event.target.value)}
              disabled={busy}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="profile-area">Service area</Label>
          <Input
            id="profile-area"
            name="area"
            className="mt-1.5"
            placeholder="e.g. Dhaka, Mirpur"
            value={form.area}
            onChange={(event) => setField("area", event.target.value)}
            disabled={busy}
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="profile-bio">Bio</Label>
            <span className="text-xs text-muted-foreground">
              {form.bio.length}/300
            </span>
          </div>
          <Textarea
            id="profile-bio"
            name="bio"
            className="mt-1.5 min-h-28"
            placeholder={
              user.role === "technician"
                ? "Tell customers about your experience and specialties."
                : "A short introduction about yourself."
            }
            value={form.bio}
            onChange={(event) => setField("bio", event.target.value)}
            disabled={busy}
          />
          {errors.bio && (
            <p className="mt-1 text-xs text-destructive">{errors.bio}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
          <Button type="submit" disabled={busy} className="bg-blue-600 hover:bg-blue-700">
            {saving ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <SaveIcon className="size-4" />
            )}
            {saving ? "Saving..." : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => {
              setForm({
                name: user.name,
                phone: user.phone,
                area: user.area,
                bio: user.bio,
              });
              setImageUrl(user.image ?? "");
              setErrors({});
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
