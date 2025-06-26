
import React from 'react'
import { MessageSquare, Users, Settings, Puzzle } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import AccountSelector from '@/components/AccountSelector'
import { WhatsAppAccount } from '@/hooks/useWhatsAppAccounts'

// Menu items with icons
const menuItems = [
  {
    title: "Live Chat",
    icon: MessageSquare,
    id: "chat"
  },
  {
    title: "Account Management", 
    icon: Users,
    id: "accounts"
  },
  {
    title: "Addon",
    icon: Puzzle,
    id: "addon"
  },
  {
    title: "Settings",
    icon: Settings,
    id: "settings"
  }
]

interface AppSidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  accounts: WhatsAppAccount[]
  activeAccount: WhatsAppAccount | null
  onAccountSelect: (account: WhatsAppAccount) => void
}

export function AppSidebar({ 
  activeView, 
  onViewChange, 
  accounts, 
  activeAccount, 
  onAccountSelect 
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>WhatsApp Manager</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    isActive={activeView === item.id}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Selector */}
        <SidebarGroup>
          <SidebarGroupLabel>WhatsApp Accounts</SidebarGroupLabel>
          <SidebarGroupContent>
            <AccountSelector
              accounts={accounts}
              activeAccount={activeAccount}
              onAccountSelect={onAccountSelect}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
