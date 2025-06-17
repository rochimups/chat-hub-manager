
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WhatsAppAccount {
  id: number;
  name: string;
  phone_number: string;
  status: 'connected' | 'disconnected' | 'pending' | 'scanning' | 'not_connected';
  last_seen: string;
  is_active: boolean;
  qr_code?: string;
}

export const useWhatsAppAccounts = () => {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      console.log('Fetching WhatsApp accounts...');
      const { data, error } = await supabase
        .from('whatsapp_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching accounts:', error);
        throw error;
      }

      console.log('Fetched accounts:', data);
      setAccounts(data || []);
    } catch (error) {
      console.error('Error in fetchAccounts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch WhatsApp accounts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (name: string) => {
    try {
      console.log('Adding account:', name);
      const { data, error } = await supabase
        .from('whatsapp_accounts')
        .insert([
          {
            name,
            status: 'pending',
            is_active: false
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding account:', error);
        throw error;
      }

      console.log('Added account:', data);
      setAccounts(prev => [data, ...prev]);
      
      toast({
        title: "Account Added",
        description: `${name} has been added successfully!`
      });
    } catch (error) {
      console.error('Error in addAccount:', error);
      toast({
        title: "Error",
        description: "Failed to add account",
        variant: "destructive"
      });
    }
  };

  const removeAccount = async (accountId: number) => {
    try {
      console.log('Removing account:', accountId);
      const { error } = await supabase
        .from('whatsapp_accounts')
        .delete()
        .eq('id', accountId);

      if (error) {
        console.error('Error removing account:', error);
        throw error;
      }

      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
      
      toast({
        title: "Account Removed",
        description: "Account has been removed successfully!"
      });
    } catch (error) {
      console.error('Error in removeAccount:', error);
      toast({
        title: "Error",
        description: "Failed to remove account",
        variant: "destructive"
      });
    }
  };

  const generateQR = async (accountId: number) => {
    try {
      console.log('Generating QR for account:', accountId);
      const { error } = await supabase
        .from('whatsapp_accounts')
        .update({
          status: 'scanning',
          qr_code: 'mock-qr-code-data'
        })
        .eq('id', accountId);

      if (error) {
        console.error('Error updating account for QR:', error);
        throw error;
      }

      // Update local state
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId 
          ? { ...acc, status: 'scanning' as const, qr_code: 'mock-qr-code-data' }
          : acc
      ));

      // Simulate QR code scanning
      setTimeout(async () => {
        const { error: updateError } = await supabase
          .from('whatsapp_accounts')
          .update({
            status: 'connected',
            phone_number: `+628${Math.random().toString().slice(2, 12)}`,
            qr_code: null,
            is_active: true
          })
          .eq('id', accountId);

        if (!updateError) {
          setAccounts(prev => prev.map(acc => 
            acc.id === accountId 
              ? { 
                  ...acc, 
                  status: 'connected' as const, 
                  phone_number: `+628${Math.random().toString().slice(2, 12)}`,
                  qr_code: undefined,
                  is_active: true
                }
              : acc
          ));
          
          toast({
            title: "Connected",
            description: "WhatsApp account connected successfully!"
          });
        }
      }, 5000);
    } catch (error) {
      console.error('Error in generateQR:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    addAccount,
    removeAccount,
    generateQR,
    refetch: fetchAccounts
  };
};
