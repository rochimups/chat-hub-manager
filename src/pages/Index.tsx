
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { Users, Send, CheckCircle } from "lucide-react";
import { AppSidebar } from '@/components/AppSidebar';
import { ChatView } from '@/components/ChatView';
import { AccountManagementView } from '@/components/AccountManagementView';
import { SettingsView } from '@/components/SettingsView';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useWhatsAppAccounts, WhatsAppAccount } from '@/hooks/useWhatsAppAccounts';
import { useMessages } from '@/hooks/useMessages';
import { useChatContacts } from '@/hooks/useChatContacts';

const Index = () => {
  const { accounts, loading: accountsLoading, addAccount, removeAccount, generateQR } = useWhatsAppAccounts();
  const { messages, loading: messagesLoading, sendMessage } = useMessages();
  const { contacts, loading: contactsLoading, updateLastMessage, markAsRead } = useChatContacts();

  const [activeAccount, setActiveAccount] = useState<WhatsAppAccount | null>(null);
  const [activeView, setActiveView] = useState('chat');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Set first connected account as active when accounts are loaded
  useEffect(() => {
    if (accounts.length > 0 && !activeAccount) {
      const connectedAccount = accounts.find(acc => acc.status === 'connected') || accounts[0];
      setActiveAccount(connectedAccount);
    }
  }, [accounts, activeAccount]);

  // Filter contacts based on active account
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm);
    const matchesAccount = activeAccount ? contact.account_id === activeAccount.id : true;
    return matchesSearch && matchesAccount;
  });

  // Filter messages based on selected chat and active account
  const selectedChatMessages = selectedChat && activeAccount
    ? messages.filter(msg => 
        (msg.to_phone === selectedChat.phone || msg.from_phone === selectedChat.phone) &&
        msg.account_id === activeAccount.id
      )
    : [];

  const handleAccountSelect = (account: WhatsAppAccount) => {
    console.log('Selecting account:', account);
    setActiveAccount(account);
    setSelectedChat(null); // Reset selected chat when switching accounts
  };

  const handleChatSelect = async (contact: any) => {
    console.log('Selecting chat:', contact);
    setSelectedChat(contact);
    
    // Mark as read if there are unread messages
    if (contact.unread_count > 0) {
      await markAsRead(contact.id);
    }
  };

  const handleAddAccount = async (name: string) => {
    await addAccount(name);
  };

  const handleQuickAddAccount = () => {
    // Quick add account functionality for sidebar button
    const accountName = `Account ${accounts.length + 1}`;
    handleAddAccount(accountName);
    toast({
      title: "Account Added",
      description: `${accountName} has been created. Set it up in Account Management.`
    });
  };

  const handleRemoveAccount = async (accountId: number) => {
    await removeAccount(accountId);
    if (activeAccount?.id === accountId) {
      const remainingAccounts = accounts.filter(acc => acc.id !== accountId);
      setActiveAccount(remainingAccounts[0] || null);
    }
  };

  const handleGenerateQR = async (accountId: number) => {
    await generateQR(accountId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !activeAccount || !activeAccount.phone_number) return;

    const messageData = await sendMessage(
      activeAccount.id,
      selectedChat.phone,
      activeAccount.phone_number,
      newMessage
    );

    if (messageData) {
      // Update chat contact last message
      await updateLastMessage(selectedChat.phone, activeAccount.id, newMessage);
      setNewMessage('');
    }
  };

  // Calculate statistics for header
  const connectedAccounts = accounts.filter(acc => acc.status === 'connected').length;
  const activeAccountMessages = messages.filter(m => m.account_id === activeAccount?.id);
  const deliveryRate = activeAccountMessages.length > 0 
    ? Math.round((activeAccountMessages.filter(m => m.status === 'delivered').length / activeAccountMessages.length) * 100)
    : 0;

  if (accountsLoading || messagesLoading || contactsLoading) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading WhatsApp Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-100">
        <AppSidebar 
          activeView={activeView}
          onViewChange={setActiveView}
          onAddAccount={handleQuickAddAccount}
        />
        
        <SidebarInset>
          <div className="flex flex-col h-screen">
            {/* Header with Stats */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center gap-4 mb-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold text-gray-800">
                  {activeView === 'chat' && 'Live Chat'}
                  {activeView === 'accounts' && 'Account Management'}
                  {activeView === 'settings' && 'Settings'}
                </h1>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                  <Users className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="text-xl font-bold text-gray-800">{connectedAccounts}</div>
                    <p className="text-sm text-gray-600">Active Accounts</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                  <Send className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-xl font-bold text-gray-800">{activeAccountMessages.length}</div>
                    <p className="text-sm text-gray-600">Messages Sent</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                  <div>
                    <div className="text-xl font-bold text-gray-800">{deliveryRate}%</div>
                    <p className="text-sm text-gray-600">Delivery Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
              {activeView === 'chat' && (
                <ChatView
                  accounts={accounts}
                  activeAccount={activeAccount}
                  onAccountSelect={handleAccountSelect}
                  contacts={filteredContacts}
                  selectedChat={selectedChat}
                  onChatSelect={handleChatSelect}
                  messages={selectedChatMessages}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  onSendMessage={handleSendMessage}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              )}

              {activeView === 'accounts' && (
                <AccountManagementView
                  accounts={accounts}
                  activeAccount={activeAccount}
                  onAccountSelect={handleAccountSelect}
                  onAddAccount={handleAddAccount}
                  onRemoveAccount={handleRemoveAccount}
                  onGenerateQR={handleGenerateQR}
                />
              )}

              {activeView === 'settings' && (
                <SettingsView />
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
