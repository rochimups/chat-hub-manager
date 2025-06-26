
-- Create a table for webhooks
CREATE TABLE public.webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  api_key TEXT,
  account_id INTEGER REFERENCES public.whatsapp_accounts(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) 
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations for now (you can restrict this later based on user authentication)
CREATE POLICY "Allow all operations on webhooks" 
  ON public.webhooks 
  FOR ALL 
  USING (true);

-- Create an index for better performance
CREATE INDEX idx_webhooks_account_id ON public.webhooks(account_id);
