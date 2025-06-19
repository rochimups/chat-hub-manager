
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  account_id: number;
  user_id: string;
  to_phone: string;
  from_phone: string;
  message: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  type: 'sent' | 'received';
  timestamp: string;
  created_at: string;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages...');
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      console.log('Fetched messages:', data);
      const typedMessages: Message[] = (data || []).map(msg => ({
        ...msg,
        status: msg.status as Message['status'],
        type: msg.type as Message['type']
      }));
      setMessages(typedMessages);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (
    accountId: number,
    toPhone: string,
    fromPhone: string,
    messageText: string
  ) => {
    try {
      console.log('Sending message:', { accountId, toPhone, fromPhone, messageText });
      
      const newMessage = {
        account_id: accountId,
        user_id: 'user-1',
        to_phone: toPhone,
        from_phone: fromPhone,
        message: messageText,
        status: 'sent' as const,
        type: 'sent' as const
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      console.log('Message sent:', data);
      
      // Add to local state
      const typedMessage: Message = {
        ...data,
        status: data.status as Message['status'],
        type: data.type as Message['type']
      };
      setMessages(prev => [...prev, typedMessage]);

      // Simulate delivery after 2 seconds
      setTimeout(async () => {
        const { error: updateError } = await supabase
          .from('messages')
          .update({ status: 'delivered' })
          .eq('id', data.id);

        if (!updateError) {
          setMessages(prev => prev.map(msg => 
            msg.id === data.id 
              ? { ...msg, status: 'delivered' as const }
              : msg
          ));
        }
      }, 2000);

      return typedMessage;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          if (payload.eventType === 'INSERT') {
            const newMessage: Message = {
              ...payload.new as any,
              status: payload.new.status as Message['status'],
              type: payload.new.type as Message['type']
            };
            setMessages(prev => [...prev, newMessage]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedMessage: Message = {
              ...payload.new as any,
              status: payload.new.status as Message['status'],
              type: payload.new.type as Message['type']
            };
            setMessages(prev => prev.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages
  };
};
