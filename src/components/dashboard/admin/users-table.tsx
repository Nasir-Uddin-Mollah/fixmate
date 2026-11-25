"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { RefreshCwIcon, ShieldIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
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
import { toast } from "@/components/ui/toast";
import {
  getAdminUsers,
  updateUserRole,
  type AdminUser,
} from "@/lib/api/users";

const ROLES: AdminUser["role"][] = ["customer", "technician", "admin"];

const roleVariant = (role: AdminUser["role"]) => {
  if (role === "admin") return "default" as const;
  if (role === "technician") return "secondary" as const;
  return "outline" as const;
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(date);
};

const UsersTable = ({ currentUserEmail }: { currentUserEmail: string }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const selfEmail = currentUserEmail.trim().toLowerCase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setUsers(await getAdminUsers());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load users.";
      setError(message);
      toast.add({
        title: "Could not load users",
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

  const handleRoleChange = async (user: AdminUser, role: AdminUser["role"]) => {
    if (role === user.role) return;

    setBusyId(user._id);

    try {
      const updated = await updateUserRole(user._id, role);
      setUsers((current) =>
        current.map((item) => (item._id === updated._id ? updated : item)),
      );
      toast.add({
        title: "Role updated",
        description: `${user.name} is now a ${role}.`,
        type: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not update this user.";
      toast.add({ title: "Update failed", description: message, type: "error" });
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <Skeleton className="h-5 w-44" />
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
      <div className="rounded-xl border border-destructive/30 bg-card p-8 text-center">
        <p className="text-sm font-medium text-destructive">{error}</p>
        <Button className="mt-4" onClick={() => void load()} variant="outline">
          <RefreshCwIcon className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {users.length} {users.length === 1 ? "account" : "accounts"}
        </p>
        <Button variant="outline" size="sm" onClick={() => void load()}>
          <RefreshCwIcon className="size-4" />
          Refresh
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {users.length === 0 ? (
          <div className="p-10 text-center">
            <ShieldIcon className="mx-auto size-10 text-muted-foreground/50" />
            <h3 className="mt-4 text-base font-semibold text-foreground">
              No users found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              User accounts will appear here when they sign up.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Change role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const busy = busyId === user._id;
                const initials = user.name?.trim().charAt(0).toUpperCase() || "U";

                return (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={40}
                            height={40}
                            unoptimized
                            className="size-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                            {initials}
                          </span>
                        )}
                        <p className="font-medium text-foreground">{user.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleVariant(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        {selfEmail && user.email.trim().toLowerCase() === selfEmail ? (
                          <span className="text-xs text-muted-foreground">Your account</span>
                        ) : (
                          <Select
                            value={user.role}
                            onValueChange={(value) =>
                              void handleRoleChange(user, value as AdminUser["role"])
                            }
                            disabled={busy}
                          >
                            <SelectTrigger className="w-36" aria-label={`Role for ${user.name}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {ROLES.map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default UsersTable;
