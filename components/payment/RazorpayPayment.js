'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

const useRazorpayPayment = ({ amount, planType, billingCycle, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if script already exists
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }

      // Create order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          notes: {
            plan: planType,
            billing: billingCycle,
          },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Configure Razorpay options
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'UPCODE Premium',
        description: `${planType} Plan - ${billingCycle}`,
        image: '/logo.png',
        order_id: data.order.id,
        handler: async function (response) {
          try {
            setLoading(true);
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: planType,
                billing: billingCycle,
                amount: amount,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast.success('Payment successful! Welcome to UPCODE Premium!');
              onSuccess && onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                plan: planType,
                billing: billingCycle,
                amount: amount,
              });
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
            onError && onError(error);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        notes: {
          plan: planType,
          billing: billingCycle,
        },
        theme: {
          color: '#7C3AED',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      // Open Razorpay checkout
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Payment gateway not available');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
      onError && onError(error);
    } finally {
      setLoading(false);
    }
  };

  return { handlePayment, loading };
};

export default useRazorpayPayment;
