// React
import React, { useEffect } from 'react';

// Third-party
import { 
  Mail, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Send,
  Settings,
  Clock,
  Shield
} from 'lucide-react';

// Local components
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Hooks
import { useNotificationStatus } from '../../hooks/admin/useNotificationStatus';

const AdminNotifications: React.FC = () => {
  const {
    notificationStatus,
    sendingTestNotification,
    loadingNotificationStatus,
    handleSendTestNotification,
    refreshNotificationStatus,
  } = useNotificationStatus();

  useEffect(() => {
    // Load notification status on component mount
    refreshNotificationStatus();
  }, [refreshNotificationStatus]);

  const getStatusIcon = () => {
    if (notificationStatus.lastError) {
      return <XCircle className="h-6 w-6 text-red-500" />;
    }
    if (notificationStatus.configured && notificationStatus.senderVerified) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    if (notificationStatus.configured) {
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    }
    return <XCircle className="h-6 w-6 text-gray-400" />;
  };

  const getStatusText = () => {
    if (notificationStatus.lastError) {
      return 'Error';
    }
    if (notificationStatus.configured && notificationStatus.senderVerified) {
      return 'Active';
    }
    if (notificationStatus.configured) {
      return 'Configured (Verification Pending)';
    }
    return 'Not Configured';
  };

  const getStatusColor = () => {
    if (notificationStatus.lastError) {
      return 'text-red-600 bg-red-50';
    }
    if (notificationStatus.configured && notificationStatus.senderVerified) {
      return 'text-green-600 bg-green-50';
    }
    if (notificationStatus.configured) {
      return 'text-yellow-600 bg-yellow-50';
    }
    return 'text-gray-600 bg-gray-50';
  };

  const formatLastChecked = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Email Notifications</h1>
        <Button
          onClick={() => refreshNotificationStatus(true)}
          disabled={loadingNotificationStatus}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loadingNotificationStatus ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* System Status Card */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">System Status</h3>
            {getStatusIcon()}
          </div>
          <div className="space-y-2">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Last checked: {formatLastChecked(notificationStatus.lastChecked)}
            </p>
          </div>
        </Card>

        {/* Subscriber Count Card */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Subscribers</h3>
            <Users className="h-5 h-5 sm:h-6 sm:w-6 text-blue-500" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {notificationStatus.subscriberCount}
            </div>
            <p className="text-sm text-gray-600">Active subscribers</p>
          </div>
        </Card>

        {/* Configuration Card */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Configuration</h3>
            <Settings className="h-5 h-5 sm:h-6 sm:w-6 text-gray-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {notificationStatus.configured ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm text-gray-600">
                API {notificationStatus.configured ? 'Configured' : 'Not Configured'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {notificationStatus.senderVerified ? (
                <Shield className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
              <span className="text-sm text-gray-600">
                Sender {notificationStatus.senderVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Status Information */}
      <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">System Details</h3>
        
        <div className="space-y-4">
          {/* Configuration Status */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Email Service Configuration</h4>
              <p className="text-sm text-gray-600 mt-1">
                {notificationStatus.configured 
                  ? 'Brevo API is configured and ready to send notifications.'
                  : 'Brevo API key or list ID is missing. Configure in Settings to enable notifications.'
                }
              </p>
            </div>
          </div>

          {/* Sender Verification */}
          {notificationStatus.configured && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Sender Verification</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {notificationStatus.senderVerified
                    ? 'Your sender email is verified and can send notifications.'
                    : 'Sender verification is pending. Check your Brevo account to complete verification.'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Subscriber Information */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Subscriber Management</h4>
              <p className="text-sm text-gray-600 mt-1">
                {notificationStatus.subscriberCount > 0
                  ? `You have ${notificationStatus.subscriberCount} active subscribers who will receive notifications when you publish new posts.`
                  : 'No subscribers yet. Visitors can subscribe using the newsletter signup form on your site.'
                }
              </p>
            </div>
          </div>

          {/* Error Information */}
          {notificationStatus.lastError && (
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">System Error</h4>
                <p className="text-sm text-red-700 mt-1">
                  {notificationStatus.lastError}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Test Notification Section */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Test Notification</h3>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Send a test notification to all subscribers to verify that the email system is working correctly.
            This will send a sample blog post notification to all active subscribers.
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button
              onClick={handleSendTestNotification}
              disabled={sendingTestNotification || !notificationStatus.configured}
              icon={Send}
              className={`w-full sm:w-auto ${sendingTestNotification ? 'opacity-75' : ''}`}
            >
              {sendingTestNotification ? 'Sending...' : 'Send Test Notification'}
            </Button>
            
            {!notificationStatus.configured && (
              <p className="text-sm text-gray-500">
                Configure the email service in Settings to enable test notifications.
              </p>
            )}
          </div>

          {sendingTestNotification && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Sending test notification to {notificationStatus.subscriberCount} subscribers...
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminNotifications;