
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ChatContact {
  id: string;
  phone: string;
  name: string;
  last_message?: string;
  last_message_time: string;
  unread_count: number;
  avatar?: string;
  account_id: number;
}

export const useChatContacts = () => {
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      console.log('Fetching chat contacts...');
      const { data, error } = await supabase
        .from('chat_contacts')
        .select('*')
        .order('last_message_time', { ascending: false });

      if (error) {
        console.error('Error fetching contacts:', error);
        throw error;
      }

      console.log('Fetched contacts:', data);
      setContacts(data || []);
    } catch (error) {
      console.error('Error in fetchContacts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contacts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLastMessage = async (contactPhone: string, accountId: number, message: string) => {
    try {
      console.log('Updating last message for contact:', { contactPhone, accountId, message });
      const { error } = await supabase
        .from('chat_contacts')
        .update({
          last_message: message,
          last_message_time: new Date().toISOString()
        })
        .eq('phone', contactPhone)
        .eq('account_id', accountId);

      if (error) {
        console.error('Error updating contact:', error);
        throw error;
      }

      // Update local state
      setContacts(prev =>
        prev.map(contact =>
          contact.phone === contactPhone && contact.account_id === accountId
            ? { ...contact, last_message: message, last_message_time: new Date().toISOString() }
            : contact
        )
      );
    } catch (error) {
      console.error('Error in updateLastMessage:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    loading,
    updateLastMessage,
    refetch: fetchContacts
  };
};
