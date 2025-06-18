
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Users, Send, QrCode, CheckCircle, XCircle, Smartphone, Search, MoreVertical, Phone, Video, Settings } from "lucide-react";
import AccountManager from '@/components/AccountManager';
import AccountSelector from '@/components/AccountSelector';
import { useWhatsAppAccounts, WhatsAppAccount } from '@/hooks/useWhatsAppAccounts';
import { useMessages } from '@/hooks/useMessages';
import { useChatContacts } from '@/hooks/useChatContacts';

const Index = () => {
  const { accounts, loading: accountsLoading, addAccount, removeAccount, generateQR } = useWhatsAppAccounts();
  const { messages, loading: messagesLoading, sendMessage } = useMessages();
  const { contacts, loading: contactsLoading, updateLastMessage, markAsRead } = useChatContacts();

  const [activeAccount, setActiveAccount] = useState<WhatsAppAccount | null>(null);
  const [activeTab, setActiveTab] = useState('chat');
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate statistics for active account
  const activeAccountMessages = messages.filter(m => m.account_id === activeAccount?.id);
  const connectedAccounts = accounts.filter(acc => acc.status === 'connected').length;
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
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header with Stats */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-full">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">WhatsApp Multi-Account Manager</h1>
          </div>
          <div className="flex items-center gap-2">
            <AccountSelector 
              accounts={accounts}
              activeAccount={activeAccount}
              onAccountSelect={handleAccountSelect}
            />
          </div>
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
      <div className="flex-1 flex">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="accounts">Account Management</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex mt-2">
            {/* Chat Interface */}
            <div className="flex-1 flex">
              {/* Sidebar - Chat List */}
              <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
                {/* Search */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Account Info */}
                {activeAccount && (
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{activeAccount.name}</p>
                        <p className="text-xs text-gray-500">{activeAccount.phone_number || 'Not connected'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredContacts.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <p>No contacts found</p>
                      <p className="text-sm">Start a conversation to see contacts here</p>
                    </div>
                  ) : (
                    filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => handleChatSelect(contact)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          selectedChat?.id === contact.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-600">
                              {contact.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                              <span className="text-xs text-gray-500">
                                {formatTime(contact.last_message_time)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{contact.last_message || 'No messages yet'}</p>
                            <p className="text-xs text-gray-400">{contact.phone}</p>
                          </div>
                          {contact.unread_count > 0 && (
                            <div className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {contact.unread_count}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedChat && activeAccount ? (
                  <>
                    {/* Chat Header */}
                    <div className="bg-white border-b border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-600">
                              {selectedChat.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{selectedChat.name}</h3>
                            <p className="text-sm text-gray-500">{selectedChat.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Video className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                      <div className="space-y-4">
                        {selectedChatMessages.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p>No messages in this conversation yet</p>
                            <p className="text-sm">Start the conversation by sending a message</p>
                          </div>
                        ) : (
                          selectedChatMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.type === 'sent'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white text-gray-800'
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                                <div className={`flex items-center justify-end gap-1 mt-1 ${
                                  message.type === 'sent' ? 'text-green-100' : 'text-gray-500'
                                }`}>
                                  <span className="text-xs">{formatTime(message.timestamp)}</span>
                                  {message.type === 'sent' && (
                                    <div className="flex">
                                      {message.status === 'delivered' ? (
                                        <CheckCircle className="w-3 h-3" />
                                      ) : (
                                        <CheckCircle className="w-3 h-3 opacity-50" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="bg-white border-t border-gray-200 p-4">
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <Textarea
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            rows={1}
                            className="resize-none"
                          />
                        </div>
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || activeAccount?.status !== 'connected'}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600">
                        {activeAccount 
                          ? 'Select a chat to start messaging' 
                          : 'Select an account to view chats'
                        }
                      </h3>
                      <p className="text-gray-500">
                        {activeAccount 
                          ? 'Choose from your existing conversations' 
                          : 'Switch to a connected WhatsApp account'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="flex-1 p-4">
            <AccountManager
              accounts={accounts}
              activeAccount={activeAccount}
              onAccountSelect={handleAccountSelect}
              onAddAccount={handleAddAccount}
              onRemoveAccount={handleRemoveAccount}
              onGenerateQR={handleGenerateQR}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
