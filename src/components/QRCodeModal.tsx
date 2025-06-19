
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Smartphone, CheckCircle, X } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (accountData: { name: string; phoneNumber: string }) => void;
  accountName: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  accountName
}) => {
  const [scanStatus, setScanStatus] = useState<'waiting' | 'connecting' | 'success'>('waiting');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (isOpen) {
      setScanStatus('waiting');
      setCountdown(60);
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Simulate QR scan success after random time (5-15 seconds)
      const successTimeout = setTimeout(() => {
        setScanStatus('connecting');
        
        setTimeout(() => {
          setScanStatus('success');
          const phoneNumber = `+628${Math.random().toString().slice(2, 12)}`;
          
          setTimeout(() => {
            onSuccess({
              name: accountName,
              phoneNumber: phoneNumber
            });
            onClose();
          }, 2000);
        }, 2000);
      }, Math.random() * 10000 + 5000); // 5-15 seconds

      return () => {
        clearInterval(countdownInterval);
        clearTimeout(successTimeout);
      };
    }
  }, [isOpen, onClose, onSuccess, accountName]);

  const handleClose = () => {
    setScanStatus('waiting');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-green-600" />
              Connect WhatsApp Account
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Connecting: <span className="font-medium">{accountName}</span>
          </p>

          {/* QR Code Display */}
          <div className="relative">
            <div className="w-64 h-64 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
              {scanStatus === 'waiting' && (
                <>
                  <QrCode className="w-48 h-48 text-gray-400" />
                  <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Generating QR Code...</p>
                    </div>
                  </div>
                </>
              )}
              
              {scanStatus === 'connecting' && (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-lg font-medium text-green-600">Connecting...</p>
                  <p className="text-sm text-gray-600">Please wait</p>
                </div>
              )}
              
              {scanStatus === 'success' && (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-green-600">Connected!</p>
                  <p className="text-sm text-gray-600">Account setup complete</p>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          {scanStatus === 'waiting' && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Scan with WhatsApp
              </p>
              <ol className="text-xs text-gray-600 text-left space-y-1 max-w-xs mx-auto">
                <li>1. Open WhatsApp on your phone</li>
                <li>2. Go to Settings → Linked Devices</li>
                <li>3. Tap "Link a Device"</li>
                <li>4. Scan this QR code</li>
              </ol>
            </div>
          )}

          {/* Countdown */}
          {scanStatus === 'waiting' && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Expires in {countdown}s</span>
            </div>
          )}

          {/* Cancel Button */}
          {scanStatus === 'waiting' && (
            <Button variant="outline" onClick={handleClose} className="w-full">
              Cancel
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
