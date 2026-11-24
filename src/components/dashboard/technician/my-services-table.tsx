"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  EditIcon,
  PauseIcon,
  PlayIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  deleteService,
  getMyServices,
  toggleServiceAvailability,
  updateService,
  type Service,
  type ServicePayload,
} from "@/lib/api/services";

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

const approvalVariant = (status: Service["approvalStatus"]) => {
  if (status === "approved") return "default" as const;
  if (status === "rejected") return "destructive" as const;
  return "secondary" as const;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
  }).format(new Date(value));

const MyServicesTable = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<ServicePayload>({
    title: "",
    category: "Smartphone",
    description: "",
    image: "",
    basePrice: 0,
    estimatedDuration: "",
    serviceMode: "Home Visit",
    serviceArea: "",
  });

  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMyServices();
      setServices(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load your services.";
      setError(message);
      toast.add({
        title: "Could not load services",
        description: message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const handleOpenEdit = (service: Service) => {
    setServiceToEdit(service);
    setEditFormData({
      title: service.title,
      category: service.category,
      description: service.description,
      image: service.image,
      basePrice: service.basePrice,
      estimatedDuration: service.estimatedDuration,
      serviceMode: service.serviceMode,
      serviceArea: service.serviceArea,
    });
  };

  const handleSaveEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!serviceToEdit) return;

    setIsEditing(true);
    try {
      const updated = await updateService(serviceToEdit._id, editFormData);
      setServices((prev) =>
        prev.map((s) => (s._id === serviceToEdit._id ? updated : s)),
      );
      setServiceToEdit(null);
      toast.add({
        title: "Service updated",
        description:
          "Changes submitted. Service approval status has been reset to pending.",
        type: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update service.";
      toast.add({
        title: "Update failed",
        description: message,
        type: "error",
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    setIsDeleting(true);
    try {
      await deleteService(serviceToDelete._id);
      setServices((prev) => prev.filter((s) => s._id !== serviceToDelete._id));
      setServiceToDelete(null);
      toast.add({
        title: "Service deleted",
        description: "The service has been permanently removed.",
        type: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete service.";
      toast.add({
        title: "Delete failed",
        description: message,
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleAvailability = async (service: Service) => {
    setActionBusyId(service._id);
    const newStatus = !service.isAvailable;

    try {
      const updated = await toggleServiceAvailability(service._id, newStatus);
      setServices((prev) =>
        prev.map((s) => (s._id === service._id ? updated : s)),
      );
      toast.add({
        title: newStatus ? "Service available" : "Service paused",
        description: `Service is now ${newStatus ? "available" : "paused"}.`,
        type: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update availability status.";
      toast.add({
        title: "Action failed",
        description: message,
        type: "error",
      });
    } finally {
      setActionBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <Skeleton className="h-5 w-40" />
        <div className="mt-5 space-y-3">
          {[0, 1, 2].map((row) => (
            <Skeleton key={row} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-red-600">{error}</p>
        <Button className="mt-4" onClick={() => void load()} variant="outline">
          <RefreshCwIcon className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center shadow-sm">
        <h3 className="text-base font-semibold text-foreground">
          No services yet
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Publish your first service to start receiving repair requests.
        </p>
        <Link
          href="/dashboard/technician/add-service"
          className="mt-5 inline-flex"
        >
          <Button className="bg-blue-600 hover:bg-blue-700">Add Service</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => {
              const busy = actionBusyId === service._id;
              return (
                <TableRow key={service._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={56}
                        height={56}
                        unoptimized
                        className="size-14 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {service.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {service.category} · {service.serviceMode}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    ${service.basePrice}
                  </TableCell>
                  <TableCell>
                    <Badge variant={approvalVariant(service.approvalStatus)}>
                      {service.approvalStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={service.isAvailable ? "default" : "outline"}
                    >
                      {service.isAvailable ? "Available" : "Paused"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(service.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        disabled={busy}
                        onClick={() => void handleToggleAvailability(service)}
                        title={
                          service.isAvailable
                            ? "Pause service"
                            : "Activate service"
                        }
                      >
                        {service.isAvailable ? (
                          <PauseIcon className="size-4 text-amber-600" />
                        ) : (
                          <PlayIcon className="size-4 text-emerald-600" />
                        )}
                        <span className="sr-only">Toggle availability</span>
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleOpenEdit(service)}
                        title="Edit service"
                      >
                        <EditIcon className="size-4 text-foreground" />
                        <span className="sr-only">Edit service</span>
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setServiceToDelete(service)}
                        title="Delete service"
                      >
                        <Trash2Icon className="size-4 text-destructive" />
                        <span className="sr-only">Delete service</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {serviceToEdit && (
        <Dialog
          open={Boolean(serviceToEdit)}
          onOpenChange={(open) => !open && setServiceToEdit(null)}
        >
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>
                Update your service details. Editing will set the approval
                status back to pending for admin review.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-title">Service Title</Label>
                <Input
                  id="edit-title"
                  required
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editFormData.category}
                    onValueChange={(val) =>
                      val &&
                      setEditFormData((prev) => ({ ...prev, category: val }))
                    }
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-mode">Service Mode</Label>
                  <Select
                    value={editFormData.serviceMode}
                    onValueChange={(val) =>
                      val &&
                      setEditFormData((prev) => ({
                        ...prev,
                        serviceMode: val,
                      }))
                    }
                  >
                    <SelectTrigger id="edit-mode">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_MODES.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-price">Base Price ($)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="1"
                    required
                    value={editFormData.basePrice}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        basePrice: Number(e.target.value),
                      }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-duration">Estimated Duration</Label>
                  <Input
                    id="edit-duration"
                    required
                    placeholder="e.g. 1-2 hours"
                    value={editFormData.estimatedDuration}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        estimatedDuration: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-area">Service Area</Label>
                  <Input
                    id="edit-area"
                    required
                    placeholder="e.g. Dhaka Central"
                    value={editFormData.serviceArea}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        serviceArea: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  required
                  value={editFormData.image}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      image: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  required
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setServiceToEdit(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isEditing}>
                  {isEditing ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {serviceToDelete && (
        <AlertDialog
          open={Boolean(serviceToDelete)}
          onOpenChange={(open) => !open && setServiceToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Service?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &ldquo;
                {serviceToDelete.title}&rdquo;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isDeleting}
                onClick={() => void handleConfirmDelete()}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default MyServicesTable;
