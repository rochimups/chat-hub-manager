
import React from 'react';
import { Users, Settings, Smartphone, CheckCircle, XCircle, QrCode } from 'lucide-react';
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
    title: "Account Management",
    value: "accounts",
    icon: Users,
    description: "Manage your WhatsApp"
  },
  {
    title: "Settings",
    value: "settings", 
    icon: Settings,
    description: "Configure application"
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

const getStatusText = (status: string) => {
  switch (status) {
    case 'connected':
      return 'Connected';
    case 'disconnected':
    case 'not_connected':
      return 'Disconnected';
    case 'pending':
    case 'scanning':
      return 'Pending';
    default:
      return 'Unknown';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'connected':
      return 'text-green-600 bg-green-50';
    case 'disconnected':
    case 'not_connected':
      return 'text-red-600 bg-red-50';
    case 'pending':
    case 'scanning':
      return 'text-yellow-600 bg-yellow-50';
    default:
      return 'text-gray-600 bg-gray-50';
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
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarContent className="bg-white">
        {/* Management Section */}
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 px-2">
            MANAGEMENT
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton 
                    isActive={activeView === item.value}
                    onClick={() => onViewChange(item.value)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeView === item.value
                        ? 'bg-gray-100 text-gray-900'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-gray-400">{item.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* WhatsApp Accounts Section */}
        <SidebarGroup className="px-3 pb-4">
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 px-2">
            WHATSAPP ACCOUNTS ({accounts.length})
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {accounts.length === 0 ? (
                <div className="px-3 py-6 text-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Smartphone className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">No accounts yet</p>
                  <p className="text-xs text-gray-400">Add your first account</p>
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
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                        activeAccount?.id === account.id
                          ? 'bg-gray-100 border border-gray-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Smartphone className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {account.name}
                          </p>
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                            {getStatusIcon(account.status)}
                            <span>{getStatusText(account.status)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {account.phone_number || 'Waiting for connection...'}
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
    </Sidebar>
  );
}
