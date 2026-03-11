"use client"

import { useAuth } from "@/lib/auth-context"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TopBar() {
  const { user } = useAuth()

  return (
    <div className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <img src="/estsb-logo.png" alt="EST SB" className="h-10 w-10" />
        <h1 className="text-xl font-bold text-foreground">Gestion du Courrier Interne</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
