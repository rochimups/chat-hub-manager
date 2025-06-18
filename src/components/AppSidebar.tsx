
import React from 'react';
import { MessageSquare, Users, Settings, Plus } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onAddAccount: () => void;
}

const menuItems = [
  {
    title: "Live Chat",
    value: "chat",
    icon: MessageSquare,
  },
  {
    title: "Account Management",
    value: "accounts",
    icon: Users,
  },
  {
    title: "Settings",
    value: "settings",
    icon: Settings,
  },
];

export function AppSidebar({ activeView, onViewChange, onAddAccount }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-full">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">WhatsApp Manager</h2>
            <p className="text-sm text-gray-500">Multi-Account</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton 
                    isActive={activeView === item.value}
                    onClick={() => onViewChange(item.value)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <Button 
              onClick={onAddAccount}
              className="w-full bg-green-500 hover:bg-green-600"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add WhatsApp Account
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-gray-500 text-center">
          <p>WhatsApp Multi-Account Manager</p>
          <p>Version 1.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
