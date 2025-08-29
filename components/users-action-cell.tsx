"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Edit,
  Trash2,
  UserX,
  UserCheck,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import type { UserData } from "@/lib/types";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [isEnableDialogOpen, setIsEnableDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToAction, setUserToAction] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    email: user.email,
    role: user.role,
  });
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

  const handleEditUser = async (uid: string) => {
    setLoading(true);
    try {
      await setUserRole(uid, editFormData.role);
      toast.success("User role has been successfully updated.", {
        duration: 3000,
      });
    } catch (error) {
      toast.error("Failed to update user role.", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = () => {
    setUserToAction(user.uid);
    setIsDeleteDialogOpen(true);
  };

  const confirmDisableUser = () => {
    setUserToAction(user.uid);
    setIsDisableDialogOpen(true);
  };

  const confirmEnableUser = () => {
    setUserToAction(user.uid);
    setIsEnableDialogOpen(true);
  };

  const openEditDialog = () => {
    setEditFormData({
      email: user.email,
      role: user.role,
    });
    setIsEditDialogOpen(true);
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
              <DropdownMenuItem onClick={openEditDialog}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
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
              onClick={() => userToAction && handleDeleteUser(userToAction)}
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
              onClick={() => userToAction && handleDisableUser(userToAction)}
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
              onClick={() => userToAction && handleEnableUser(userToAction)}
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
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="col-span-3"
                placeholder="Enter email address"
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
            <Button onClick={handleEditUser} disabled={isSaving}>
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
