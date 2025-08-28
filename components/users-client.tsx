"use client";

import { useState, useMemo } from "react";
import type { UserData } from "@/lib/types";
import { UsersDataTable } from "@/components/table-data";
import type { ColumnDef } from "@tanstack/react-table";
import {
  disableUser,
  enableUser,
  deleteUser,
  setUserRole,
} from "@/app/actions/user-mgnmt";
import { UserActionsCell } from "./users-action-cell";
import { toast } from "sonner";
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
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { ArrowUpDown, XCircle, CheckCircle2 } from "lucide-react";

interface UsersPageClientProps {
  data: UserData[];
}

export function UsersPageClient({ data }: UsersPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilter, setGlobalFilter] = useState("");
  const itemsPerPage = 10;

  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [isEnableDialogOpen, setIsEnableDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToAction, setUserToAction] = useState<UserData | null>(null);
  const [editFormData, setEditFormData] = useState({ email: "", role: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleDisableUser = async (uid: string) => {
    setLoading(true);
    try {
      await disableUser(uid);
      toast.success("User has been successfully disabled.", {
        duration: 3000,
      });
    } catch (error) {
      toast.error("Failed to disable user.", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
      setIsDisableDialogOpen(false);
    }
  };

  const handleEnableUser = async (uid: string) => {
    setLoading(true);
    try {
      await enableUser(uid);
      toast.success("User has been successfully enabled.", {
        duration: 3000,
      });
    } catch (error) {
      toast.error("Failed to enable user.", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
      setIsEnableDialogOpen(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    setLoading(true);
    try {
      await deleteUser(uid);
      toast.success("User deleted", {
        description: "User has been successfully deleted.",
        duration: 3000,
      });
    } catch (error) {
      toast.error("Failed to delete user.", {
        description: "Failed to delete user.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditUser = async (uid: string) => {
    setIsSaving(true);
    try {
      await setUserRole(uid, editFormData.role);
      toast.success("User role has been successfully updated.", {
        duration: 3000,
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update user role.", {
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteDialog = (user: UserData) => {
    setUserToAction(user);
    setIsDeleteDialogOpen(true);
  };

  const openDisableDialog = (user: UserData) => {
    setUserToAction(user);
    setIsDisableDialogOpen(true);
  };

  const openEnableDialog = (user: UserData) => {
    setUserToAction(user);
    setIsEnableDialogOpen(true);
  };

  const openEditDialog = (user: UserData) => {
    setUserToAction(user);
    setEditFormData({
      email: user.email,
      role: user.customClaims?.role || "user",
    });
    setIsEditDialogOpen(true);
  };

  const columns: ColumnDef<UserData>[] = [
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-sm text-left truncate max-w-[180px]" title={row.original.email}>
          {row.original.email}
        </div>
      ),
    },
    {
      accessorKey: "uid",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          User ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-xs text-gray-600 truncate" title={row.original.uid}>
          {row.original.uid}
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="bg-card border rounded px-2 py-1 text-xs font-medium shadow-sm max-w-fit">
          <span className="capitalize">{row.original.customClaims?.role || 'user'}</span>
        </div>
      ),
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
            >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            return (
            <div className="text-sm text-gray-600">
                {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                })}
            </div>
            );
        },
    },
    {
        accessorKey: "lastSignInAt",
        header: ({ column }) => (
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
            >
            Last Sign In
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const lastSignIn = row.getValue("lastSignInAt");
            if (!lastSignIn) {
            return <div className="text-sm text-gray-400">Never</div>;
            }
            const date = new Date(lastSignIn as string);
            return (
            <div className="text-sm text-gray-600">
                {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                })}
            </div>
            );
        },
    },
    {
      accessorKey: "disabled",
      header: "Status",
      cell: ({ row }) =>
        row.original.disabled ? (
          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800">
            <XCircle className="mr-1 h-3.5 w-3.5" />
            Disabled
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800">
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            Enabled
          </Badge>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <UserActionsCell
          user={row.original}
          onEdit={() => openEditDialog(row.original)}
          onDelete={() => openDeleteDialog(row.original)}
          onDisable={() => openDisableDialog(row.original)}
          onEnable={() => openEnableDialog(row.original)}
        />
      ),
    },
  ];

  const filteredUsers = useMemo(() => {
    if (!globalFilter) return data;

    const searchTerm = globalFilter.toLowerCase();
    return data.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm) ||
        user.uid.toLowerCase().includes(searchTerm) ||
        (user.customClaims?.role &&
          user.customClaims.role.toLowerCase().includes(searchTerm))
    );
  }, [data, globalFilter]);

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <UsersDataTable
        columns={columns}
        data={currentUsers}
        totalUsers={totalUsers}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        globalFilter={globalFilter}
        onGlobalFilterChange={handleGlobalFilterChange}
        isLoading={loading}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToAction && handleDeleteUser(userToAction.uid)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDisableDialogOpen}
        onOpenChange={setIsDisableDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to disable this user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Disabled account will not be able to sign in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToAction && handleDisableUser(userToAction.uid)}
              className="bg-red-600 hover:bg-red-700"
            >
              Disable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isEnableDialogOpen}
        onOpenChange={setIsEnableDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to enable this user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Enabled account will be able to sign in and access the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToAction && handleEnableUser(userToAction.uid)}
              className="bg-green-600 hover:bg-green-700"
            >
              Enable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user's information. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={editFormData.role}
                onValueChange={(value) =>
                  setEditFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={() => userToAction && handleEditUser(userToAction.uid)}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
