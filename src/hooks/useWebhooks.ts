
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Webhook {
  id: string;
  name: string;
  url: string;
  api_key?: string;
  account_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useWebhooks = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWebhooks = async () => {
    try {
      console.log('Fetching webhooks...');
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching webhooks:', error);
        throw error;
      }

      console.log('Fetched webhooks:', data);
      setWebhooks(data || []);
    } catch (error) {
      console.error('Error in fetchWebhooks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch webhooks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addWebhook = async (webhook: Omit<Webhook, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Adding webhook:', webhook);
      const { data, error } = await supabase
        .from('webhooks')
        .insert([webhook])
        .select()
        .single();

      if (error) {
        console.error('Error adding webhook:', error);
        throw error;
      }

      console.log('Added webhook:', data);
      setWebhooks(prev => [data, ...prev]);
      
      toast({
        title: "Webhook Added",
        description: `${webhook.name} has been added successfully!`
      });
    } catch (error) {
      console.error('Error in addWebhook:', error);
      toast({
        title: "Error",
        description: "Failed to add webhook",
        variant: "destructive"
      });
    }
  };

  const updateWebhook = async (id: string, updates: Partial<Webhook>) => {
    try {
      console.log('Updating webhook:', id, updates);
      const { data, error } = await supabase
        .from('webhooks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating webhook:', error);
        throw error;
      }

      console.log('Updated webhook:', data);
      setWebhooks(prev => prev.map(webhook => 
        webhook.id === id ? data : webhook
      ));
      
      toast({
        title: "Webhook Updated",
        description: "Webhook has been updated successfully!"
      });
    } catch (error) {
      console.error('Error in updateWebhook:', error);
      toast({
        title: "Error",
        description: "Failed to update webhook",
        variant: "destructive"
      });
    }
  };

  const removeWebhook = async (id: string) => {
    try {
      console.log('Removing webhook:', id);
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing webhook:', error);
        throw error;
      }

      setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
      
      toast({
        title: "Webhook Removed",
        description: "Webhook has been removed successfully!"
      });
    } catch (error) {
      console.error('Error in removeWebhook:', error);
      toast({
        title: "Error",
        description: "Failed to remove webhook",
        variant: "destructive"
      });
    }
  };

  const toggleWebhook = async (id: string, isActive: boolean) => {
    await updateWebhook(id, { is_active: isActive });
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  return {
    webhooks,
    loading,
    addWebhook,
    updateWebhook,
    removeWebhook,
    toggleWebhook,
    refetch: fetchWebhooks
  };
};
