
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Users, Send, QrCode, CheckCircle, XCircle, Smartphone, Search, MoreVertical, Phone, Video } from "lucide-react";

interface Message {
  id: string;
  userId: string;
  to: string;
  from?: string;
  message: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'failed';
  type: 'sent' | 'received';
}

interface User {
  id: string;
  name: string;
  phone: string;
  status: 'connected' | 'disconnected' | 'pending';
  lastSeen: Date;
}

interface ChatContact {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  avatar?: string;
}

const Index = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user1',
      name: 'Admin WhatsApp',
      phone: '+6281234567890',
      status: 'connected',
      lastSeen: new Date()
    },
    {
      id: 'user2',
      name: 'Marketing Team',
      phone: '+6281234567891',
      status: 'pending',
      lastSeen: new Date(Date.now() - 3600000)
    }
  ]);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: 'user1',
      to: '+6281234567892',
      from: '+6281234567890',
      message: 'Halo, terima kasih sudah menghubungi kami!',
      timestamp: new Date(),
      status: 'sent',
      type: 'sent'
    },
    {
      id: '2',
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
      unreadCount: 0
    },
    {
      id: '+6281234567893',
      name: 'Jane Smith',
      phone: '+6281234567893',
      lastMessage: 'Promo spesial bulan ini, diskon 50%!',
      lastMessageTime: new Date(Date.now() - 1800000),
      unreadCount: 2
    },
    {
      id: '+6281234567894',
      name: 'Mike Johnson',
      phone: '+6281234567894',
      lastMessage: 'Bagaimana cara order?',
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 1
    }
  ]);

  const [selectedChat, setSelectedChat] = useState<ChatContact | null>(chatContacts[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [loginUserId, setLoginUserId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const filteredContacts = chatContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const selectedChatMessages = selectedChat 
    ? messages.filter(msg => msg.to === selectedChat.phone || msg.from === selectedChat.phone)
    : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      userId: 'user1',
      to: selectedChat.phone,
      from: '+6281234567890',
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

  const handleLogin = async () => {
    if (!loginUserId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a User ID",
        variant: "destructive"
      });
      return;
    }

    setQrCodeUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==');
    
    setTimeout(() => {
      const newUser: User = {
        id: loginUserId,
        name: `User ${loginUserId}`,
        phone: `+628${Math.random().toString().slice(2, 12)}`,
        status: 'connected',
        lastSeen: new Date()
      };
      
      setUsers(prev => {
        const exists = prev.find(u => u.id === loginUserId);
        if (exists) {
          return prev.map(u => u.id === loginUserId ? { ...u, status: 'connected' as const, lastSeen: new Date() } : u);
        }
        return [...prev, newUser];
      });
      
      setQrCodeUrl('');
      setShowLogin(false);
      toast({
        title: "Success",
        description: `User ${loginUserId} connected successfully!`
      });
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <QrCode className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header with Stats */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-full">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">WhatsApp Management</h1>
          </div>
          <Button 
            onClick={() => setShowLogin(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
            <Users className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-xl font-bold text-gray-800">
                {users.filter(u => u.status === 'connected').length}
              </div>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
            <Send className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-xl font-bold text-gray-800">{messages.length}</div>
              <p className="text-sm text-gray-600">Messages Sent</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-xl font-bold text-gray-800">
                {messages.length > 0 ? Math.round((messages.filter(m => m.status === 'delivered').length / messages.length) * 100) : 0}%
              </div>
              <p className="text-sm text-gray-600">Delivery Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
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
          {selectedChat ? (
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
                    disabled={!newMessage.trim()}
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
                <h3 className="text-lg font-medium text-gray-600">Select a chat to start messaging</h3>
                <p className="text-gray-500">Choose from your existing conversations</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-green-600" />
                Login WhatsApp Account
              </CardTitle>
              <CardDescription>
                Scan QR code with your WhatsApp to connect a new account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  value={loginUserId}
                  onChange={(e) => setLoginUserId(e.target.value)}
                  placeholder="Enter unique user ID"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleLogin} 
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  disabled={!loginUserId.trim()}
                >
                  Generate QR Code
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowLogin(false)}
                >
                  Cancel
                </Button>
              </div>
              
              {qrCodeUrl && (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-48 h-48 mx-auto bg-white border-2 border-green-200 rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Scan this QR code with WhatsApp on your phone
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600">Waiting for scan...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
