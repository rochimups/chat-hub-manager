
-- Insert sample WhatsApp accounts
INSERT INTO whatsapp_accounts (name, phone_number, status, is_active) VALUES
('Sales Team', '+6281234567890', 'connected', true),
('Customer Support', '+6281234567891', 'not_connected', false),
('Marketing Team', NULL, 'pending', false);

-- Insert sample chat contacts
INSERT INTO chat_contacts (phone, name, last_message, last_message_time, unread_count, account_id) VALUES
('+6281234567892', 'John Doe', 'Terima kasih! Saya tertarik dengan promonya.', now() - interval '20 minutes', 0, 1),
('+6281234567893', 'Jane Smith', 'Promo spesial bulan ini, diskon 50%!', now() - interval '30 minutes', 2, 1),
('+6281234567894', 'Mike Johnson', 'Bagaimana cara order?', now() - interval '1 hour', 1, 2);

-- Insert sample messages
INSERT INTO messages (account_id, user_id, to_phone, from_phone, message, status, type, timestamp) VALUES
(1, 'user1', '+6281234567892', '+6281234567890', 'Halo, terima kasih sudah menghubungi Sales Team!', 'sent', 'sent', now() - interval '25 minutes'),
(1, 'user1', '+6281234567893', '+6281234567890', 'Promo spesial bulan ini, diskon 50%!', 'delivered', 'sent', now() - interval '30 minutes'),
(1, 'user1', '+6281234567890', '+6281234567892', 'Terima kasih! Saya tertarik dengan promonya.', 'delivered', 'received', now() - interval '20 minutes');
