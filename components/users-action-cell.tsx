"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Trash2,
  UserX,
  UserCheck,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import type { UserData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  disableUser,
  enableUser,
  deleteUser,
  setUserRole,
} from "@/app/actions/user-mgnmt";

interface UserActionsCellProps {
  user: UserData;
}

export function UserActionsCell({ user }: UserActionsCellProps) {
  const [loading, setLoading] = useState(false);
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false)
  const [isEnableDialogOpen, setIsEnableDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

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
    }
  };

  const confirmDeleteUser = () => {
    setUserToDelete(user.uid);
    setIsDeleteDialogOpen(true);
  };

  const confirmDisableUser = () => {
    setUserToDelete(user.uid);
    setIsDisableDialogOpen(true);
  };

    const confirmEnableUser = () => {
    setUserToDelete(user.uid);
    setIsEnableDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-start">
        {loading ? (
          <div className="flex items-center justify-center w-8 h-8">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user.disabled ? (
                <DropdownMenuItem onClick={confirmEnableUser}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Enable User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={confirmDisableUser}>
                  <UserX className="mr-2 h-4 w-4" />
                  Disable User
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={confirmDeleteUser}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

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
              onClick={() => userToDelete && handleEnableUser(userToDelete)}
              className="bg-green-600 hover:bg-green-700"
            >
              Enable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
