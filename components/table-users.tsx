"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  MoreHorizontal,
  Trash2,
  UserCog,
  CheckCircle2,
  XCircle,
  ShieldBan,
  ShieldCheck,
} from "lucide-react";
import type { UserData } from "@/lib/types";
import { getUserRoles } from "@/lib/auth-data";

interface UsersTableProps {
  users: UserData[];
  onEdit: (user: UserData) => void;
  onEnable: (id: string) => void;
  onDisable: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: Record<string, boolean>;
}

export function UsersTable({
  users,
  onEdit,
  onEnable,
  onDisable,
  onDelete,
  isLoading,
}: UsersTableProps) {
  const getStatusBadge = (disabled: boolean) => {
    if (disabled) {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800"
        >
          <XCircle className="mr-1 h-3.5 w-3.5" />
          Disabled
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800"
        >
          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
          Enabled
        </Badge>
      );
    }
  };

  const getRoleBadges = (user: UserData) => {
    const roles = getUserRoles(user);

    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role) => {
          switch (role) {
            case "admin":
              return (
                <Badge
                  key={role}
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                >
                  Admin
                </Badge>
              );
            case "superuser":
              return (
                <Badge
                  key={role}
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  Superuser
                </Badge>
              );
            case "staff":
              return (
                <Badge
                  key={role}
                  className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                >
                  Staff
                </Badge>
              );
            case "member":
              return (
                <Badge
                  key={role}
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
                >
                  Member
                </Badge>
              );
            default:
              return <Badge key={role}>{role}</Badge>;
          }
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <UserCog className="h-8 w-8 mb-2 opacity-40" />
                    <p>No users found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.uid} className="group hover:bg-muted/30">
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{getRoleBadges(user)}</TableCell>
                  <TableCell>{getStatusBadge(user.disabled)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100"
                        >
                          <span className="sr-only">Open Menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => onEdit(user)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        {user.disabled ? (
                          <DropdownMenuItem
                            onClick={() => onEnable(user.uid)}
                            className="cursor-pointer"
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Enable
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => onDisable(user.uid)}
                            className="cursor-pointer"
                          >
                            <ShieldBan className="mr-2 h-4 w-4" />
                            Disable
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(user.uid)}
                          className="cursor-pointer text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
