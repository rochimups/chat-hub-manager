
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, QrCode, ChevronDown, Smartphone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WhatsAppAccount } from '@/hooks/useWhatsAppAccounts';

interface AccountSelectorProps {
  accounts: WhatsAppAccount[];
  activeAccount: WhatsAppAccount | null;
  onAccountSelect: (account: WhatsAppAccount) => void;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({
  accounts,
  activeAccount,
  onAccountSelect
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
      case 'not_connected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
      case 'scanning':
        return <QrCode className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span>{activeAccount?.name || 'Select Account'}</span>
            {activeAccount && (
              <Badge className={getStatusColor(activeAccount.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(activeAccount.status)}
                  <span className="capitalize">{activeAccount.status === 'not_connected' ? 'disconnected' : activeAccount.status}</span>
                </div>
              </Badge>
            )}
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-white border shadow-lg">
        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            onClick={() => onAccountSelect(account)}
            className="flex items-center justify-between p-3 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium">{account.name}</p>
                <p className="text-sm text-gray-500">{account.phone_number || 'Not connected'}</p>
              </div>
            </div>
            <Badge className={getStatusColor(account.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(account.status)}
                <span className="capitalize">{account.status === 'not_connected' ? 'disconnected' : account.status}</span>
              </div>
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountSelector;
