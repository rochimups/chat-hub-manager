
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
    description: "Manage your WhatsApp accounts"
  },
  {
    title: "Settings",
    value: "settings",
    icon: Settings,
    description: "Configure application settings"
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
      return 'bg-green-100 text-green-800 border-green-200';
    case 'disconnected':
    case 'not_connected':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
    case 'scanning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 bg-gradient-to-r from-green-500 to-green-600">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-white">WhatsApp Manager</h2>
            <p className="text-sm text-green-100">Multi-Account Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gray-50/50">
        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton 
                    isActive={activeView === item.value}
                    onClick={() => onViewChange(item.value)}
                    className={`group relative p-3 rounded-xl transition-all duration-200 ${
                      activeView === item.value
                        ? 'bg-white shadow-md border border-gray-200 text-gray-900'
                        : 'hover:bg-white/70 hover:shadow-sm text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        activeView === item.value
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-500 group-hover:bg-green-50 group-hover:text-green-600'
                      }`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-sm">{item.title}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-4 pb-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            WhatsApp Accounts ({accounts.length})
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {accounts.length === 0 ? (
                <div className="p-4 text-center bg-white rounded-xl border border-gray-200">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">No accounts yet</p>
                  <p className="text-xs text-gray-500">Add your first WhatsApp account to get started</p>
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
                      className={`group p-4 rounded-xl transition-all duration-200 ${
                        activeAccount?.id === account.id
                          ? 'bg-white shadow-md border border-green-200 ring-1 ring-green-100'
                          : 'bg-white/60 hover:bg-white hover:shadow-sm border border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          activeAccount?.id === account.id
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600'
                        }`}>
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm text-gray-900 truncate">{account.name}</p>
                            <Badge className={`${getStatusColor(account.status)} text-xs px-2 py-0.5 border`}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(account.status)}
                                <span className="capitalize text-xs">{account.status.replace('_', ' ')}</span>
                              </div>
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {account.phone_number || 'Waiting for connection...'}
                          </p>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-medium text-gray-600">WhatsApp Multi-Manager</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">Version 1.0.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
