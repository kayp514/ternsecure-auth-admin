"use client";

import { useState } from "react";
import {
  disableUser,
  enableUser,
  deleteUser,
  setUserRole,
} from "@/app/actions/user-mgnmt";
import type { UserData } from "@/lib/types";
import { PageWrapper } from "@/components/page-layout";
import { UsersHeader } from "@/components/headers";
import { UsersSearch } from "@/components/search";
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
import { toast } from "sonner";
import { UsersTable } from "@/components/table-users";
import { getPrimaryRole } from "@/lib/auth-data";

interface UsersClientProps {
  users: UserData[];
}

export function UsersClient({ users }: UsersClientProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  const handleDisableUser = async (uid: string) => {
    setIsLoading((prev) => ({ ...prev, [uid]: true }));
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
      setIsLoading((prev) => ({ ...prev, [uid]: false }));
    }
  };

  const handleEnableUser = async (uid: string) => {
    setIsLoading((prev) => ({ ...prev, [uid]: true }));
    try {
      await enableUser(uid);
      toast.success("User has been successfully enabled.");
    } catch (error) {
      toast.error("Failed to enable user.");
    } finally {
      setIsLoading((prev) => ({ ...prev, [uid]: false }));
    }
  };

  const handleDeleteUser = async (uid: string) => {
    setIsLoading((prev) => ({ ...prev, [uid]: true }));
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
      setIsLoading((prev) => ({ ...prev, [uid]: false }));
    }
  };

  const handleRoleChange = async (uid: string, role: string) => {
    setIsLoading((prev) => ({ ...prev, [uid]: true }));
    try {
      await setUserRole(uid, role);
      toast.success("User role has been successfully updated.", {
        duration: 3000,
      });
    } catch (error) {
      toast.error("Failed to update user role.", {
        duration: 3000,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, [uid]: false }));
    }
  };

  const handleToggleStatus = (uid: string) => {
    const user = users.find((user) => user.uid === uid);
    if (user) {
      user.disabled ? handleEnableUser(uid) : handleDisableUser(uid);
    }
  };

  const openEditForm = (user: UserData) => {
    setUserToEdit(user);
    setIsFormOpen(true);
  };

  const confirmDeleteUser = (uid: string) => {
    setUserToDelete(uid);
    setIsDeleteDialogOpen(true);
  };

  const confirmDisableUser = (uid: string) => {
    setUserToDelete(uid);
    setIsDisableDialogOpen(true);
  };

  const openCreateForm = () => {
    setUserToEdit(null);
    setIsFormOpen(true);
  };

  const confirmBulkDelete = () => {
    setIsBulkDeleteDialogOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const userRole = getPrimaryRole(user);
    const matchesRole = filterRole === "all" || userRole === filterRole;

    const status = user.disabled ? "disabled" : "enabled";
    const matchesStatus = filterStatus === "all" || status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <PageWrapper>
      <UsersHeader
        onCreateUser={openCreateForm}
        onBulkDelete={confirmBulkDelete}
      />

      <UsersSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <UsersTable
        users={filteredUsers}
        onEdit={openEditForm}
        onEnable={handleEnableUser}
        onDisable={confirmDisableUser}
        onDelete={confirmDeleteUser}
        isLoading={isLoading}
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
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
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
              onClick={() => userToDelete && handleDisableUser(userToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Disable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
