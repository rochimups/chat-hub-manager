
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Webhook as WebhookIcon, ExternalLink } from "lucide-react";
import { useWebhooks, Webhook } from '@/hooks/useWebhooks';
import { WhatsAppAccount } from '@/hooks/useWhatsAppAccounts';

interface AddonViewProps {
  accounts: WhatsAppAccount[];
}

export const AddonView: React.FC<AddonViewProps> = ({ accounts }) => {
  const { webhooks, loading, addWebhook, updateWebhook, removeWebhook, toggleWebhook } = useWebhooks();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    api_key: '',
    account_id: '',
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      api_key: '',
      account_id: '',
      is_active: true
    });
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.url) {
      return;
    }

    await addWebhook({
      name: formData.name,
      url: formData.url,
      api_key: formData.api_key || undefined,
      account_id: formData.account_id ? parseInt(formData.account_id) : undefined,
      is_active: formData.is_active
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setFormData({
      name: webhook.name,
      url: webhook.url,
      api_key: webhook.api_key || '',
      account_id: webhook.account_id?.toString() || '',
      is_active: webhook.is_active
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingWebhook || !formData.name || !formData.url) {
      return;
    }

    await updateWebhook(editingWebhook.id, {
      name: formData.name,
      url: formData.url,
      api_key: formData.api_key || undefined,
      account_id: formData.account_id ? parseInt(formData.account_id) : undefined,
      is_active: formData.is_active
    });

    resetForm();
    setEditingWebhook(null);
    setIsEditDialogOpen(false);
  };

  const handleRemove = async (id: string) => {
    if (confirm('Are you sure you want to delete this webhook?')) {
      await removeWebhook(id);
    }
  };

  const getAccountName = (accountId?: number) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : 'All Accounts';
  };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Addon Management</h2>
        <p className="text-gray-600">Manage webhooks and integrations for your WhatsApp accounts</p>
      </div>

      {/* Add Webhook Button */}
      <div className="mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Webhook</DialogTitle>
              <DialogDescription>
                Configure a new webhook to receive WhatsApp events and messages.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Webhook Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Webhook"
                />
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://api.example.com/webhook"
                />
              </div>
              <div>
                <Label htmlFor="api_key">API Key (Optional)</Label>
                <Input
                  id="api_key"
                  type="password"
                  value={formData.api_key}
                  onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                  placeholder="Your API key for authentication"
                />
              </div>
              <div>
                <Label htmlFor="account">WhatsApp Account</Label>
                <Select value={formData.account_id} onValueChange={(value) => setFormData(prev => ({ ...prev, account_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Accounts</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add Webhook</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Webhooks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WebhookIcon className="w-5 h-5" />
            Webhooks
          </CardTitle>
          <CardDescription>
            Manage your webhook endpoints for receiving WhatsApp events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <WebhookIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No webhooks configured yet</p>
              <p className="text-sm">Add your first webhook to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-medium">{webhook.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-xs">{webhook.url}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(webhook.url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{getAccountName(webhook.account_id)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={webhook.is_active ? "default" : "secondary"}>
                          {webhook.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Switch
                          checked={webhook.is_active}
                          onCheckedChange={(checked) => toggleWebhook(webhook.id, checked)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(webhook)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(webhook.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Webhook Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Webhook</DialogTitle>
            <DialogDescription>
              Update your webhook configuration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_name">Webhook Name</Label>
              <Input
                id="edit_name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My Webhook"
              />
            </div>
            <div>
              <Label htmlFor="edit_url">URL</Label>
              <Input
                id="edit_url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://api.example.com/webhook"
              />
            </div>
            <div>
              <Label htmlFor="edit_api_key">API Key (Optional)</Label>
              <Input
                id="edit_api_key"
                type="password"
                value={formData.api_key}
                onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                placeholder="Your API key for authentication"
              />
            </div>
            <div>
              <Label htmlFor="edit_account">WhatsApp Account</Label>
              <Select value={formData.account_id} onValueChange={(value) => setFormData(prev => ({ ...prev, account_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Accounts</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="edit_is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Webhook</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
