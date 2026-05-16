'use client';

import { useEffect } from 'react';
import { useSocket } from '../providers/SocketProvider';
import { toast } from 'sonner';

export const useNotifications = () => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNotification = (notification: any) => {
      toast.success(notification.title || 'New Notification', {
        description: notification.message || 'You have a new update.',
        duration: 5000,
      });
    };

    const handleInvoiceUpdate = (invoice: any) => {
      // You could also refresh the data here if you use react-query
      // queryClient.invalidateQueries(['invoices']);
      toast.info('Invoice Updated', {
        description: `Invoice ${invoice.invoiceNumber} has been updated.`,
      });
    };

    socket.on('notification_received', handleNotification);
    socket.on('invoice_updated', handleInvoiceUpdate);

    return () => {
      socket.off('notification_received', handleNotification);
      socket.off('invoice_updated', handleInvoiceUpdate);
    };
  }, [socket, isConnected]);
};
