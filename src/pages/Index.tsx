
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

interface WhatsAppAccount {
  id: string;
  name: string;
  phone: string;
  status: 'connected' | 'disconnected' | 'pending' | 'scanning';
  lastSeen: Date;
  isActive: boolean;
  qrCode?: string;
}

interface Message {
  id: string;
  accountId: string;
  userId: string;
  to: string;
  from?: string;
  message: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'failed';
  type: 'sent' | 'received';
}

interface ChatContact {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  avatar?: string;
  accountId: string;
}

const Index = () => {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([
    {
      id: 'account1',
      name: 'Sales Team',
      phone: '+6281234567890',
      status: 'connected',
      lastSeen: new Date(),
      isActive: true
    },
    {
      id: 'account2',
      name: 'Customer Support',
      phone: '+6281234567891',
      status: 'disconnected',
      lastSeen: new Date(Date.now() - 3600000),
      isActive: false
    },
    {
      id: 'account3',
      name: 'Marketing Team',
      phone: '',
      status: 'pending',
      lastSeen: new Date(Date.now() - 7200000),
      isActive: false
    }
  ]);

  const [activeAccount, setActiveAccount] = useState<WhatsAppAccount | null>(accounts[0]);
  const [activeTab, setActiveTab] = useState('chat');
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      accountId: 'account1',
      userId: 'user1',
      to: '+6281234567892',
      from: '+6281234567890',
      message: 'Halo, terima kasih sudah menghubungi Sales Team!',
      timestamp: new Date(),
      status: 'sent',
      type: 'sent'
    },
    {
      id: '2',
      accountId: 'account1',
      userId: 'user1',
      to: '+6281234567893',
      from: '+6281234567890',
      message: 'Promo spesial bulan ini, diskon 50%!',
      timestamp: new Date(Date.now() - 1800000),
      status: 'delivered',
      type: 'sent'
    },
    {
      id: '3',
      accountId: 'account1',
      userId: 'user1',
      to: '+6281234567890',
      from: '+6281234567892',
      message: 'Terima kasih! Saya tertarik dengan promonya.',
      timestamp: new Date(Date.now() - 1200000),
      status: 'delivered',
      type: 'received'
    }
  ]);

  const [chatContacts, setChatContacts] = useState<ChatContact[]>([
    {
      id: '+6281234567892',
      name: 'John Doe',
      phone: '+6281234567892',
      lastMessage: 'Terima kasih! Saya tertarik dengan promonya.',
      lastMessageTime: new Date(Date.now() - 1200000),
      unreadCount: 0,
      accountId: 'account1'
    },
    {
      id: '+6281234567893',
      name: 'Jane Smith',
      phone: '+6281234567893',
      lastMessage: 'Promo spesial bulan ini, diskon 50%!',
      lastMessageTime: new Date(Date.now() - 1800000),
      unreadCount: 2,
      accountId: 'account1'
    },
    {
      id: '+6281234567894',
      name: 'Mike Johnson',
      phone: '+6281234567894',
      lastMessage: 'Bagaimana cara order?',
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 1,
      accountId: 'account2'
    }
  ]);

  const [selectedChat, setSelectedChat] = useState<ChatContact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter contacts based on active account
  const filteredContacts = chatContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm);
    const matchesAccount = activeAccount ? contact.accountId === activeAccount.id : true;
    return matchesSearch && matchesAccount;
  });

  // Filter messages based on selected chat and active account
  const selectedChatMessages = selectedChat && activeAccount
    ? messages.filter(msg => 
        (msg.to === selectedChat.phone || msg.from === selectedChat.phone) &&
        msg.accountId === activeAccount.id
      )
    : [];

  const handleAccountSelect = (account: WhatsAppAccount) => {
    setActiveAccount(account);
    setSelectedChat(null); // Reset selected chat when switching accounts
  };

  const handleAddAccount = (name: string) => {
    const newAccount: WhatsAppAccount = {
      id: `account${Date.now()}`,
      name,
      phone: '',
      status: 'pending',
      lastSeen: new Date(),
      isActive: false
    };
    
    setAccounts(prev => [...prev, newAccount]);
    toast({
      title: "Account Added",
      description: `${name} has been added successfully!`
    });
  };

  const handleRemoveAccount = (accountId: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    if (activeAccount?.id === accountId) {
      setActiveAccount(accounts.find(acc => acc.id !== accountId) || null);
    }
    toast({
      title: "Account Removed",
      description: "Account has been removed successfully!"
    });
  };

  const handleGenerateQR = (accountId: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId 
        ? { ...acc, status: 'scanning' as const, qrCode: 'mock-qr-code' }
        : acc
    ));

    // Simulate QR code scanning
    setTimeout(() => {
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId 
          ? { 
              ...acc, 
              status: 'connected' as const, 
              phone: `+628${Math.random().toString().slice(2, 12)}`,
              qrCode: undefined 
            }
          : acc
      ));
      
      toast({
        title: "Connected",
        description: "WhatsApp account connected successfully!"
      });
    }, 5000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !activeAccount) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      accountId: activeAccount.id,
      userId: 'user1',
      to: selectedChat.phone,
      from: activeAccount.phone,
      message: newMessage,
      timestamp: new Date(),
      status: 'sent',
      type: 'sent'
    };

    setMessages(prev => [...prev, newMsg]);
    
    // Update chat contact last message
    setChatContacts(prev =>
      prev.map(contact =>
        contact.id === selectedChat.id
          ? { ...contact, lastMessage: newMessage, lastMessageTime: new Date() }
          : contact
      )
    );

    setNewMessage('');
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully!"
    });

    // Simulate delivery status update
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' as const } : m)
      );
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate statistics for active account
  const activeAccountMessages = messages.filter(m => m.accountId === activeAccount?.id);
  const connectedAccounts = accounts.filter(acc => acc.status === 'connected').length;
  const deliveryRate = activeAccountMessages.length > 0 
    ? Math.round((activeAccountMessages.filter(m => m.status === 'delivered').length / activeAccountMessages.length) * 100)
    : 0;

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
                        <p className="text-xs text-gray-500">{activeAccount.phone || 'Not connected'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedChat(contact)}
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
                              {formatTime(contact.lastMessageTime)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                          <p className="text-xs text-gray-400">{contact.phone}</p>
                        </div>
                        {contact.unreadCount > 0 && (
                          <div className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {contact.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
                        {selectedChatMessages.map((message) => (
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
                        ))}
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
