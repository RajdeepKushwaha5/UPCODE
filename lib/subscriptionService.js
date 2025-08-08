import dbConnect from '@/utils/dbConnect';
import { User } from '@/models/User';

export async function updateUserSubscription(userId, subscriptionData) {
  try {
    await dbConnect();

    const { plan, billing, paymentId, orderId, amount } = subscriptionData;

    // Calculate subscription end date
    const now = new Date();
    const endDate = new Date(now);

    if (billing === 'yearly') {
      endDate.setFullYear(now.getFullYear() + 1);
      endDate.setMonth(now.getMonth() + 2); // Add 2 bonus months for yearly
    } else {
      endDate.setMonth(now.getMonth() + 1);
    }

    // Update user with premium subscription
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          isPremium: true,
          subscription: {
            plan,
            billing,
            startDate: now,
            endDate,
            isActive: true,
            paymentHistory: {
              paymentId,
              orderId,
              amount,
              currency: 'INR',
              status: 'completed',
              createdAt: now,
            }
          }
        },
        $push: {
          'subscription.paymentHistory': {
            paymentId,
            orderId,
            amount,
            currency: 'INR',
            status: 'completed',
            createdAt: now,
          }
        }
      },
      {
        new: true,
        upsert: false
      }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return {
      success: true,
      user: updatedUser,
      subscription: updatedUser.subscription
    };

  } catch (error) {
    console.error('Subscription update error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function checkSubscriptionStatus(userId) {
  try {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if subscription is still active
    const now = new Date();
    const isActive = user.subscription?.isActive &&
      user.subscription?.endDate &&
      new Date(user.subscription.endDate) > now;

    // Update user if subscription expired
    if (user.isPremium && !isActive) {
      await User.findByIdAndUpdate(userId, {
        $set: {
          isPremium: false,
          'subscription.isActive': false
        }
      });
    }

    return {
      success: true,
      isPremium: isActive,
      subscription: user.subscription
    };

  } catch (error) {
    console.error('Subscription check error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
