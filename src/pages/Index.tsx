
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Users, Send, QrCode, CheckCircle, XCircle, Smartphone } from "lucide-react";

interface Message {
  id: string;
  userId: string;
  to: string;
  message: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'failed';
}

interface User {
  id: string;
  name: string;
  phone: string;
  status: 'connected' | 'disconnected' | 'pending';
  lastSeen: Date;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
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
      message: 'Halo, terima kasih sudah menghubungi kami!',
      timestamp: new Date(),
      status: 'sent'
    },
    {
      id: '2',
      userId: 'user1',
      to: '+6281234567893',
      message: 'Promo spesial bulan ini, diskon 50%!',
      timestamp: new Date(Date.now() - 1800000),
      status: 'delivered'
    }
  ]);

  const [loginUserId, setLoginUserId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [sendForm, setSendForm] = useState({
    userId: '',
    to: '',
    message: ''
  });

  // Mock QR code generation
  const handleLogin = async () => {
    if (!loginUserId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a User ID",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
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
      toast({
        title: "Success",
        description: `User ${loginUserId} connected successfully!`
      });
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (!sendForm.userId || !sendForm.to || !sendForm.message) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: sendForm.userId,
      to: sendForm.to,
      message: sendForm.message,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [newMessage, ...prev]);
    setSendForm({ userId: '', to: '', message: '' });
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully!"
    });

    // Simulate delivery status update
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => m.id === newMessage.id ? { ...m, status: 'delivered' as const } : m)
      );
    }, 2000);
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

  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-blue-600';
      case 'delivered':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-green-500 p-3 rounded-full">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">WhatsApp Management</h1>
          </div>
          <p className="text-lg text-gray-600">Kelola semua akun WhatsApp Anda dalam satu dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
              <Users className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {users.filter(u => u.status === 'connected').length}
              </div>
              <p className="text-xs text-gray-500">Connected WhatsApp accounts</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Messages Sent</CardTitle>
              <Send className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{messages.length}</div>
              <p className="text-xs text-gray-500">Total messages today</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Delivery Rate</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {messages.length > 0 ? Math.round((messages.filter(m => m.status === 'delivered').length / messages.length) * 100) : 0}%
              </div>
              <p className="text-xs text-gray-500">Messages delivered successfully</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/90 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Dashboard</CardTitle>
            <CardDescription>Manage your WhatsApp accounts and messages</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-green-100">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="login" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  Login WhatsApp
                </TabsTrigger>
                <TabsTrigger value="send" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  Send Message
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  Users & Messages
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Connected Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {users.filter(u => u.status === 'connected').map(user => (
                          <div key={user.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Smartphone className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="font-medium text-gray-800">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.phone}</p>
                              </div>
                            </div>
                            {getStatusIcon(user.status)}
                          </div>
                        ))}
                        {users.filter(u => u.status === 'connected').length === 0 && (
                          <p className="text-gray-500 text-center py-4">No connected users</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                        Recent Messages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {messages.slice(0, 5).map(message => (
                          <div key={message.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-sm font-medium text-gray-800">To: {message.to}</p>
                              <span className={`text-xs font-medium ${getMessageStatusColor(message.status)}`}>
                                {message.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{message.message}</p>
                            <p className="text-xs text-gray-400">
                              {message.timestamp.toLocaleString()}
                            </p>
                          </div>
                        ))}
                        {messages.length === 0 && (
                          <p className="text-gray-500 text-center py-4">No messages sent yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="login" className="space-y-6">
                <Card className="border-green-200">
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
                        className="border-green-200 focus:border-green-500"
                      />
                    </div>
                    <Button 
                      onClick={handleLogin} 
                      className="w-full bg-green-500 hover:bg-green-600"
                      disabled={!loginUserId.trim()}
                    >
                      Generate QR Code
                    </Button>
                    
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
              </TabsContent>

              <TabsContent value="send" className="space-y-6">
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-green-600" />
                      Send Message
                    </CardTitle>
                    <CardDescription>
                      Send WhatsApp message through connected accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="sendUserId">Select User Account</Label>
                      <select
                        id="sendUserId"
                        value={sendForm.userId}
                        onChange={(e) => setSendForm(prev => ({ ...prev, userId: e.target.value }))}
                        className="w-full p-2 border border-green-200 rounded-md focus:border-green-500 focus:outline-none"
                      >
                        <option value="">Select connected user</option>
                        {users.filter(u => u.status === 'connected').map(user => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.phone})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="sendTo">Phone Number</Label>
                      <Input
                        id="sendTo"
                        value={sendForm.to}
                        onChange={(e) => setSendForm(prev => ({ ...prev, to: e.target.value }))}
                        placeholder="+628xxxxxxxxxx"
                        className="border-green-200 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="sendMessage">Message</Label>
                      <Textarea
                        id="sendMessage"
                        value={sendForm.message}
                        onChange={(e) => setSendForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Type your message here..."
                        rows={4}
                        className="border-green-200 focus:border-green-500"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSendMessage}
                      className="w-full bg-green-500 hover:bg-green-600"
                      disabled={!sendForm.userId || !sendForm.to || !sendForm.message}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        All Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {users.map(user => (
                          <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Smartphone className="w-4 h-4 text-gray-600" />
                              <div>
                                <p className="font-medium text-gray-800">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.phone}</p>
                                <p className="text-xs text-gray-400">
                                  Last seen: {user.lastSeen.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(user.status)}
                              <span className="text-sm capitalize">{user.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                        Message History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {messages.map(message => (
                          <div key={message.id} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  From: {users.find(u => u.id === message.userId)?.name || message.userId}
                                </p>
                                <p className="text-sm text-gray-600">To: {message.to}</p>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ${getMessageStatusColor(message.status)} bg-gray-100`}>
                                {message.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{message.message}</p>
                            <p className="text-xs text-gray-400">
                              {message.timestamp.toLocaleString()}
                            </p>
                          </div>
                        ))}
                        {messages.length === 0 && (
                          <p className="text-gray-500 text-center py-8">No messages found</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
