'use client';

import { useEffect, useState } from 'react';
import { FaCrown, FaCheck } from 'react-icons/fa';

const SubscriptionStatus = ({ className = '' }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await fetch('/api/subscription/status');
        const data = await response.json();

        if (data.success) {
          setSubscription(data);
        }
      } catch (error) {
        console.error('Failed to check subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, []);

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-700 h-6 w-20 rounded ${className}`}></div>
    );
  }

  if (!subscription?.isPremium) {
    return (
      <div className={`flex items-center gap-2 text-gray-400 text-sm ${className}`}>
        <span>Free</span>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold">
        <FaCrown className="w-3 h-3" />
        <span>Premium</span>
      </div>
      {subscription.subscription?.endDate && (
        <span className="text-xs text-gray-400">
          Until {formatDate(subscription.subscription.endDate)}
        </span>
      )}
    </div>
  );
};

export default SubscriptionStatus;
