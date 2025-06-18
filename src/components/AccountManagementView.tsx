
import React from 'react';
import AccountManager from '@/components/AccountManager';
import { WhatsAppAccount } from '@/hooks/useWhatsAppAccounts';

interface AccountManagementViewProps {
  accounts: WhatsAppAccount[];
  activeAccount: WhatsAppAccount | null;
  onAccountSelect: (account: WhatsAppAccount) => void;
  onAddAccount: (name: string) => void;
  onRemoveAccount: (accountId: number) => void;
  onGenerateQR: (accountId: number) => void;
}

export const AccountManagementView: React.FC<AccountManagementViewProps> = ({
  accounts,
  activeAccount,
  onAccountSelect,
  onAddAccount,
  onRemoveAccount,
  onGenerateQR
}) => {
  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Management</h2>
        <p className="text-gray-600">Manage your WhatsApp accounts and connections</p>
      </div>
      
      <AccountManager
        accounts={accounts}
        activeAccount={activeAccount}
        onAccountSelect={onAccountSelect}
        onAddAccount={onAddAccount}
        onRemoveAccount={onRemoveAccount}
        onGenerateQR={onGenerateQR}
      />
    </div>
  );
};
