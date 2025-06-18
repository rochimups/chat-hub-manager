
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Shield, Database } from "lucide-react";

export const SettingsView: React.FC = () => {
  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Settings</h2>
        <p className="text-gray-600">Configure your WhatsApp Manager preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="new-messages">New Message Notifications</Label>
                <p className="text-sm text-gray-500">Get notified when new messages arrive</p>
              </div>
              <Switch id="new-messages" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="account-status">Account Status Changes</Label>
                <p className="text-sm text-gray-500">Get notified when account status changes</p>
              </div>
              <Switch id="account-status" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>
              Manage security and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-logout">Auto Logout</Label>
                <p className="text-sm text-gray-500">Automatically logout after inactivity</p>
              </div>
              <Switch id="auto-logout" />
            </div>
            <div>
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" type="number" defaultValue="30" className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-500" />
              <CardTitle>Data Management</CardTitle>
            </div>
            <CardDescription>
              Manage your data and storage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Message History</Label>
                <p className="text-sm text-gray-500">How long to keep message history</p>
              </div>
              <select className="border border-gray-300 rounded-md px-3 py-1">
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
                <option>Forever</option>
              </select>
            </div>
            <div className="pt-4 border-t">
              <Button variant="destructive" size="sm">
                Clear All Data
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                This will permanently delete all messages and contacts
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
