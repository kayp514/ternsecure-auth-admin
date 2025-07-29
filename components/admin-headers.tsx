"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, Settings, Shield, User } from "lucide-react"

const navigation = [
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Permissions & Roles", href: "/admin/permissions-roles", icon: Shield },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title - Far Left */}
          <div className="flex items-center">
            <Link href="/admin/users" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:bg-blue-700 transition-colors duration-200">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                TernSecure
              </span>
            </Link>
          </div>

          {/* Navigation Menu - Center */}
          <nav className="hidden md:flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    isActive
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm",
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Admin User - Far Right */}
          <div className="flex items-center">
            <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-900 font-medium">Admin</span>
                <span className="text-xs text-blue-600">Online</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button className="p-2 rounded-lg bg-gray-50 border text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
