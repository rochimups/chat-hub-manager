
import React from 'react';
import { MessageSquare, Users, Settings, Smartphone, CheckCircle, XCircle, QrCode } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge";
import { WhatsAppAccount } from '@/hooks/useWhatsAppAccounts';

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  accounts: WhatsAppAccount[];
  activeAccount: WhatsAppAccount | null;
  onAccountSelect: (account: WhatsAppAccount) => void;
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'connected':
      return <CheckCircle className="w-3 h-3 text-green-500" />;
    case 'disconnected':
    case 'not_connected':
      return <XCircle className="w-3 h-3 text-red-500" />;
    case 'pending':
    case 'scanning':
      return <QrCode className="w-3 h-3 text-yellow-500" />;
    default:
      return <XCircle className="w-3 h-3 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'connected':
      return 'bg-green-100 text-green-800';
    case 'disconnected':
    case 'not_connected':
      return 'bg-red-100 text-red-800';
    case 'pending':
    case 'scanning':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function AppSidebar({ 
  activeView, 
  onViewChange, 
  accounts, 
  activeAccount, 
  onAccountSelect 
}: AppSidebarProps) {
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
          <SidebarGroupLabel>WhatsApp Accounts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accounts.length === 0 ? (
                <div className="p-3 text-center text-gray-500">
                  <p className="text-sm">No accounts yet</p>
                </div>
              ) : (
                accounts.map((account) => (
                  <SidebarMenuItem key={account.id}>
                    <SidebarMenuButton
                      isActive={activeAccount?.id === account.id}
                      onClick={() => {
                        onAccountSelect(account);
                        onViewChange('chat');
                      }}
                      className="flex items-center gap-3 p-3"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Smartphone className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">{account.name}</p>
                          <Badge className={`${getStatusColor(account.status)} text-xs px-1 py-0`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(account.status)}
                            </div>
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {account.phone_number || 'Not connected'}
                        </p>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
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
