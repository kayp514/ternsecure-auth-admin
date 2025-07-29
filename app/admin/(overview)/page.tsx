import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllUsers, getDisabledUsers } from "@/app/actions/user-mgnmt";
import {
  Users,
  UserX,
  UserCheck,
  Activity,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { PageHeader, PageWrapper } from "@/components/page-layout";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/skeleton";

async function getOverviewMetrics() {
  const [usersResult, disabledUsersFromRedis] = await Promise.all([
    getAllUsers(),
    getDisabledUsers(),
  ]);

  const users = usersResult;
  const totalUsers = users.length;
  const disabledUsers = users.filter((user) => user.disabled).length;
  const activeUsers = totalUsers - disabledUsers;

  // Users who signed in within the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentSignIns = users.filter((user) => {
    if (!user.lastSignInAt) return false;
    const lastSignIn = new Date(user.lastSignInAt);
    return lastSignIn >= thirtyDaysAgo;
  }).length;

  // Users created in the last 30 days
  const newUsers = users.filter((user) => {
    const createdDate = new Date(user.createdAt);
    return createdDate >= thirtyDaysAgo;
  }).length;

  // Users who never signed in
  const neverSignedIn = users.filter((user) => !user.lastSignInAt).length;

  return {
    totalUsers,
    activeUsers,
    disabledUsers,
    recentSignIns,
    newUsers,
    neverSignedIn,
    disabledUsersFromRedis: disabledUsersFromRedis.length,
  };
}

async function DashboardContent() {
  const metrics = await getOverviewMetrics();

  return (
    <PageWrapper>
      <PageHeader
        title="Dashboard Overview"
        description="Monitor your user management system at a glance"
      />

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Users */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              All registered users in the system
            </p>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {metrics.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              Users with enabled accounts
            </p>
          </CardContent>
        </Card>

        {/* Disabled Users */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Disabled Users
            </CardTitle>
            <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {metrics.disabledUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              Users with disabled accounts
            </p>
            {metrics.disabledUsersFromRedis > 0 && (
              <Badge variant="outline" className="mt-2 text-xs">
                {metrics.disabledUsersFromRedis} tracked in Redis
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Recent Sign-ins */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Sign-ins
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metrics.recentSignIns}
            </div>
            <p className="text-xs text-muted-foreground">
              Users active in the last 30 days
            </p>
          </CardContent>
        </Card>

        {/* New Users */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {metrics.newUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              Users registered in the last 30 days
            </p>
          </CardContent>
        </Card>

        {/* Never Signed In */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Never Signed In
            </CardTitle>
            <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {metrics.neverSignedIn}
            </div>
            <p className="text-xs text-muted-foreground">
              Users who haven't signed in yet
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Status</CardTitle>
            <CardDescription>Current system health and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database Connection</span>

              <Badge
                variant="outline"
                className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Redis Connection</span>
              <Badge
                variant="outline"
                className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Authentication Service
              </span>
              <Badge
                variant="outline"
                className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Operational
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <a
                href="/admin/users"
                className="flex items-center p-3 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Users className="h-4 w-4 mr-3 text-gray-600 dark:text-gray-300" />
                Manage Users
              </a>
              <a
                href="/admin/permissions-roles"
                className="flex items-center p-3 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <UserCheck className="h-4 w-4 mr-3 text-gray-600 dark:text-gray-300" />
                Manage Roles & Permissions
              </a>
              <a
                href="/admin/settings"
                className="flex items-center p-3 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Activity className="h-4 w-4 mr-3 text-gray-600 dark:text-gray-300" />
                System Settings
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
