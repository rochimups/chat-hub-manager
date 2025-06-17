
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, QrCode, CheckCircle, XCircle, Smartphone, Trash2 } from "lucide-react";
import { WhatsAppAccount } from '@/hooks/useWhatsAppAccounts';

interface AccountManagerProps {
  accounts: WhatsAppAccount[];
  activeAccount: WhatsAppAccount | null;
  onAccountSelect: (account: WhatsAppAccount) => void;
  onAddAccount: (name: string) => void;
  onRemoveAccount: (accountId: number) => void;
  onGenerateQR: (accountId: number) => void;
}

const AccountManager: React.FC<AccountManagerProps> = ({
  accounts,
  activeAccount,
  onAccountSelect,
  onAddAccount,
  onRemoveAccount,
  onGenerateQR
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');

  const handleAddAccount = () => {
    if (!newAccountName.trim()) {
      toast({
        title: "Error",
        description: "Please enter account name",
        variant: "destructive"
      });
      return;
    }

    onAddAccount(newAccountName.trim());
    setNewAccountName('');
    setShowAddForm(false);
  };

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">WhatsApp Accounts</CardTitle>
          <Button 
            onClick={() => setShowAddForm(true)}
            size="sm"
            className="bg-green-500 hover:bg-green-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {accounts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Smartphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>No WhatsApp accounts yet</p>
            <p className="text-sm">Add your first account to get started</p>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                activeAccount?.id === account.id 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onAccountSelect(account)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{account.name}</h4>
                    <p className="text-sm text-gray-500">{account.phone_number || 'Not connected'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(account.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(account.status)}
                      <span className="capitalize">{account.status === 'not_connected' ? 'disconnected' : account.status}</span>
                    </div>
                  </Badge>
                  {(account.status === 'disconnected' || account.status === 'not_connected') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGenerateQR(account.id);
                      }}
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveAccount(account.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {account.qr_code && account.status === 'scanning' && (
                <div className="mt-3 p-4 bg-white rounded-lg border">
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-green-200 rounded-lg flex items-center justify-center mb-2">
                      <QrCode className="w-32 h-32 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">Scan QR code with WhatsApp</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Waiting for scan...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {showAddForm && (
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="space-y-3">
              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="Enter account name (e.g., Sales Team)"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddAccount} className="flex-1">
                  Add Account
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setNewAccountName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountManager;
