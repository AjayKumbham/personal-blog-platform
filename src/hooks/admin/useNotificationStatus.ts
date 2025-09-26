// React
import { useState } from 'react';

// Services
import { blogNotificationService } from '../../services/blogNotificationService';

// Hooks
import { useToast } from '../useToast';

// Types
import { NotificationStatus } from '../../types';

interface UseNotificationStatusReturn {
  notificationStatus: NotificationStatus;
  sendingTestNotification: boolean;
  loadingNotificationStatus: boolean;
  handleSendTestNotification: () => Promise<void>;
  refreshNotificationStatus: (forceRefresh?: boolean) => Promise<void>;
}

export const useNotificationStatus = (): UseNotificationStatusReturn => {
  const { showSuccess, showError } = useToast();
  
  // Notification system state with localStorage persistence
  const [notificationStatus, setNotificationStatus] = useState<NotificationStatus>(() => {
    // Load from localStorage on initialization
    try {
      const saved = localStorage.getItem('brevo-notification-status');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load notification status from localStorage:', error);
    }
    // Default state if nothing in localStorage
    return {
      configured: false,
      subscriberCount: 0,
      senderVerified: false,
      lastError: undefined,
      lastChecked: undefined
    };
  });
  
  const [sendingTestNotification, setSendingTestNotification] = useState(false);
  const [loadingNotificationStatus, setLoadingNotificationStatus] = useState(false);

  // Notification management functions
  const handleSendTestNotification = async () => {
    setSendingTestNotification(true);
    try {
      const result = await blogNotificationService.sendTestNotification();

      if (result.success) {
        showSuccess(
          'Test notification sent!',
          result.message
        );
      } else {
        showError(
          'Failed to send test notification',
          result.message
        );
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      showError(
        'Test notification failed',
        'An unexpected error occurred while sending the test notification.'
      );
    } finally {
      setSendingTestNotification(false);
    }
  };

  const refreshNotificationStatus = async (forceRefresh = false) => {
    // Check if we have recent data (less than 5 minutes old) and don't force refresh
    if (!forceRefresh && notificationStatus.lastChecked) {
      const lastChecked = new Date(notificationStatus.lastChecked);
      const now = new Date();
      const diffInMinutes = (now.getTime() - lastChecked.getTime()) / (1000 * 60);
      
      // If data is less than 5 minutes old, don't make API call
      if (diffInMinutes < 5) {
        console.log('Using cached notification status (less than 5 minutes old)');
        return;
      }
    }

    setLoadingNotificationStatus(true);
    try {
      const status = await blogNotificationService.getSystemStatus();
      const statusWithTimestamp = {
        ...status,
        lastChecked: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem('brevo-notification-status', JSON.stringify(statusWithTimestamp));
      setNotificationStatus(statusWithTimestamp);
    } catch (error) {
      console.error('Error loading notification status:', error);
      const errorStatus = {
        configured: false,
        subscriberCount: 0,
        lastError: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date().toISOString()
      };

      // Save error state to localStorage too
      localStorage.setItem('brevo-notification-status', JSON.stringify(errorStatus));
      setNotificationStatus(errorStatus);
    } finally {
      setLoadingNotificationStatus(false);
    }
  };

  return {
    notificationStatus,
    sendingTestNotification,
    loadingNotificationStatus,
    handleSendTestNotification,
    refreshNotificationStatus,
  };
};