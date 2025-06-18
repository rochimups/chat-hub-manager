
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Send, Search, Phone, Video, MoreVertical, CheckCircle } from "lucide-react";
import { Smartphone } from "lucide-react";
import AccountSelector from '@/components/AccountSelector';
import { WhatsAppAccount } from '@/hooks/useWhatsAppAccounts';
import { Message } from '@/hooks/useMessages';
import { ChatContact } from '@/hooks/useChatContacts';

interface ChatViewProps {
  accounts: WhatsAppAccount[];
  activeAccount: WhatsAppAccount | null;
  onAccountSelect: (account: WhatsAppAccount) => void;
  contacts: ChatContact[];
  selectedChat: ChatContact | null;
  onChatSelect: (contact: ChatContact) => void;
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  accounts,
  activeAccount,
  onAccountSelect,
  contacts,
  selectedChat,
  onChatSelect,
  messages,
  newMessage,
  setNewMessage,
  onSendMessage,
  searchTerm,
  setSearchTerm
}) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header with Account Selector */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Live Chat</h2>
          <AccountSelector 
            accounts={accounts}
            activeAccount={activeAccount}
            onAccountSelect={onAccountSelect}
          />
        </div>
      </div>

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
            {contacts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No contacts found</p>
                <p className="text-sm">Start a conversation to see contacts here</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => onChatSelect(contact)}
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
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p>No messages in this conversation yet</p>
                      <p className="text-sm">Start the conversation by sending a message</p>
                    </div>
                  ) : (
                    messages.map((message) => (
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
                          onSendMessage();
                        }
                      }}
                      rows={1}
                      className="resize-none"
                    />
                  </div>
                  <Button 
                    onClick={onSendMessage}
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
    </div>
  );
};
