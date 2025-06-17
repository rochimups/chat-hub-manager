
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  account_id: number;
  user_id: string;
  to_phone: string;
  from_phone?: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'failed';
  type: 'sent' | 'received';
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
      setMessages(data || []);
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

  const sendMessage = async (accountId: number, toPhone: string, fromPhone: string, messageText: string) => {
    try {
      console.log('Sending message:', { accountId, toPhone, fromPhone, messageText });
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            account_id: accountId,
            user_id: 'user1',
            to_phone: toPhone,
            from_phone: fromPhone,
            message: messageText,
            status: 'sent',
            type: 'sent'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      console.log('Message sent:', data);
      setMessages(prev => [...prev, data]);

      // Simulate delivery status update
      setTimeout(async () => {
        const { error: updateError } = await supabase
          .from('messages')
          .update({ status: 'delivered' })
          .eq('id', data.id);

        if (!updateError) {
          setMessages(prev => 
            prev.map(m => m.id === data.id ? { ...m, status: 'delivered' as const } : m)
          );
        }
      }, 2000);

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully!"
      });

      return data;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages
  };
};
