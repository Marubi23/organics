const axios = require('axios');
const crypto = require('crypto');

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
    
    this.baseURL = this.environment === 'production' 
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
  }

  // Generate access token
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        `${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      );
      
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting M-Pesa access token:', error.response?.data || error.message);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  // Generate password for STK Push
  generatePassword() {
    const timestamp = this.getTimestamp();
    const data = this.shortcode + this.passkey + timestamp;
    const password = Buffer.from(data).toString('base64');
    return { password, timestamp };
  }

  // Get current timestamp in required format
  getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  }

  // STK Push (Lipa Na M-Pesa Online)
  async stkPush(phone, amount, reference, description = 'Mzuri Organics Purchase') {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();
      
      const formattedPhone = this.formatPhone(phone);
      
      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.floor(amount),
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.API_BASE_URL || 'https://your-domain.com/api/v1'}/payments/mpesa-callback`,
        AccountReference: reference.substring(0, 12), // Max 12 chars
        TransactionDesc: description.substring(0, 13) // Max 13 chars
      };
      
      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        success: true,
        data: response.data,
        message: 'Payment request sent to phone'
      };
      
    } catch (error) {
      console.error('STK Push error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.errorMessage || 'Failed to initiate M-Pesa payment',
        details: error.response?.data
      };
    }
  }

  // Check transaction status
  async checkTransactionStatus(checkoutRequestID) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();
      
      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      };
      
      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpushquery/v1/query`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        success: true,
        data: response.data
      };
      
    } catch (error) {
      console.error('Transaction status error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Format phone number for M-Pesa (2547XXXXXXXX)
  formatPhone(phone) {
    let cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    }
    
    if (cleaned.startsWith('7') && cleaned.length === 9) {
      return '254' + cleaned;
    }
    
    if (cleaned.startsWith('254')) {
      return cleaned;
    }
    
    throw new Error('Invalid phone number format');
  }

  // Simulate M-Pesa payment (for development/testing)
  simulatePayment(amount, phone, reference) {
    if (this.environment === 'sandbox') {
      // Generate mock M-Pesa code
      const mpesaCode = `MPE${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      return {
        success: true,
        data: {
          MerchantRequestID: `mock-${Date.now()}`,
          CheckoutRequestID: `ws_CO_${Date.now()}`,
          ResponseCode: '0',
          ResponseDescription: 'Success',
          CustomerMessage: `Please enter your M-Pesa PIN to pay KSh ${amount} to Mzuri Organics. The M-Pesa code is ${mpesaCode}`
        },
        mpesaCode
      };
    }
    
    throw new Error('Simulation only available in sandbox mode');
  }
}

module.exports = new MpesaService();