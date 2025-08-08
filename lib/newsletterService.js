// Newsletter Service with Mailchimp Integration
import crypto from 'crypto';

// Check if we have newsletter API configuration
const hasNewsletterConfig = process.env.NEWSLETTER_API_KEY &&
  !process.env.NEWSLETTER_API_KEY.includes('your_newsletter_api_key');

// Mailchimp integration
const subscribeToMailchimp = async (email, name = '') => {
  if (!hasNewsletterConfig) {
    console.log('📰 Mock Newsletter: Would subscribe', email, 'to newsletter');
    return { success: true, mock: true };
  }

  try {
    const apiKey = process.env.NEWSLETTER_API_KEY;
    const listId = process.env.NEWSLETTER_LIST_ID;

    // Extract datacenter from API key (e.g., us1, us2, etc.)
    const datacenter = apiKey.split('-')[1];
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${listId}/members`;

    // Create subscriber hash for idempotent requests
    const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

    const response = await fetch(url, {
      method: 'PUT', // PUT for upsert behavior
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: name.split(' ')[0] || '',
          LNAME: name.split(' ').slice(1).join(' ') || ''
        },
        tags: ['UpCode-Platform']
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Mailchimp API Error: ${errorData.detail || response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      subscriberId: data.id,
      status: data.status
    };
  } catch (error) {
    console.error('Mailchimp subscription error:', error);
    return { success: false, error: error.message };
  }
};

// ConvertKit integration (alternative)
const subscribeToConvertKit = async (email, name = '') => {
  if (!hasNewsletterConfig) {
    console.log('📰 Mock Newsletter: Would subscribe', email, 'to ConvertKit');
    return { success: true, mock: true };
  }

  try {
    const apiSecret = process.env.NEWSLETTER_API_KEY;
    const formId = process.env.NEWSLETTER_FORM_ID;

    const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_secret: apiSecret,
        email,
        first_name: name.split(' ')[0] || '',
        tags: ['upcode-platform']
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`ConvertKit API Error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      subscriberId: data.subscription.id
    };
  } catch (error) {
    console.error('ConvertKit subscription error:', error);
    return { success: false, error: error.message };
  }
};

// EmailOctopus integration (alternative)
const subscribeToEmailOctopus = async (email, name = '') => {
  if (!hasNewsletterConfig) {
    console.log('📰 Mock Newsletter: Would subscribe', email, 'to EmailOctopus');
    return { success: true, mock: true };
  }

  try {
    const apiKey = process.env.NEWSLETTER_API_KEY;
    const listId = process.env.NEWSLETTER_LIST_ID;

    const response = await fetch(`https://emailoctopus.com/api/1.6/lists/${listId}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        email_address: email,
        fields: {
          FirstName: name.split(' ')[0] || '',
          LastName: name.split(' ').slice(1).join(' ') || ''
        },
        tags: ['upcode-platform']
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`EmailOctopus API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      subscriberId: data.id
    };
  } catch (error) {
    console.error('EmailOctopus subscription error:', error);
    return { success: false, error: error.message };
  }
};

// Main subscription function (defaults to Mailchimp)
export const subscribeToNewsletter = async (email, name = '', service = 'mailchimp') => {
  switch (service.toLowerCase()) {
    case 'mailchimp':
      return await subscribeToMailchimp(email, name);
    case 'convertkit':
      return await subscribeToConvertKit(email, name);
    case 'emailoctopus':
      return await subscribeToEmailOctopus(email, name);
    default:
      return await subscribeToMailchimp(email, name); // Default to Mailchimp
  }
};

// Unsubscribe function (Mailchimp)
export const unsubscribeFromNewsletter = async (email) => {
  if (!hasNewsletterConfig) {
    console.log('📰 Mock Newsletter: Would unsubscribe', email);
    return { success: true, mock: true };
  }

  try {
    const apiKey = process.env.NEWSLETTER_API_KEY;
    const listId = process.env.NEWSLETTER_LIST_ID;
    const datacenter = apiKey.split('-')[1];

    const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'unsubscribed'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Mailchimp API Error: ${errorData.detail || response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Mailchimp unsubscribe error:', error);
    return { success: false, error: error.message };
  }
};

// Get subscriber info
export const getSubscriberInfo = async (email) => {
  if (!hasNewsletterConfig) {
    console.log('📰 Mock Newsletter: Would get info for', email);
    return {
      success: true,
      subscriber: { email, status: 'subscribed', tags: ['upcode-platform'] },
      mock: true
    };
  }

  try {
    const apiKey = process.env.NEWSLETTER_API_KEY;
    const listId = process.env.NEWSLETTER_LIST_ID;
    const datacenter = apiKey.split('-')[1];

    const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'Subscriber not found' };
      }
      const errorData = await response.json();
      throw new Error(`Mailchimp API Error: ${errorData.detail || response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      subscriber: {
        email: data.email_address,
        status: data.status,
        name: `${data.merge_fields.FNAME} ${data.merge_fields.LNAME}`.trim(),
        subscribed_date: data.timestamp_opt,
        tags: data.tags
      }
    };
  } catch (error) {
    console.error('Get subscriber info error:', error);
    return { success: false, error: error.message };
  }
};
