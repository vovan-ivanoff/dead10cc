const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_PREFIX = '/api/v1';

interface DecodedToken {
  phone: string;
}

export interface VerificationRequest {
  phone: string;
  country_code: string;
}

export interface VerificationResponse {
  success: boolean;
  message?: string;
  retry_delay?: number;
  data: {
    code: string;
  };
}

export interface VerifyCodeRequest {
  phone: string;
  country_code: string;
  code: string;
}

export interface Profile {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatar_url?: string;
  token: string;
}

interface ApiError {
  detail?: string;
  message?: string;
  code?: string;
}

const handleApiError = async (response: Response): Promise<never> => {
  let errorData: ApiError = {};

  try {
    errorData = await response.json();
  } catch (e) {
    console.error('Failed to parse error response', e);
  }

  const errorMessage =
    errorData.detail ||
    errorData.message ||
    `API request failed with status ${response.status}`;

  throw new Error(errorMessage);
};

export const sendVerificationCode = async (
  data: VerificationRequest
): Promise<VerificationResponse> => {
  try {
    if (!data.phone || !data.country_code) {
      throw new Error('Phone number and country code are required');
    }

    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/phone/send_code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: data.phone,
        country_code: data.country_code.replace(/\D/g, ''),
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    const result: VerificationResponse = await response.json();

    if (process.env.NODE_ENV === 'development' && result.success) {
      console.log(`Verification code for ${data.phone}: ${result.data.code}`);
    }

    localStorage.setItem('verificationCode', result.data.code);

    return result;
  } catch (error) {
    console.error('[Auth API] Error sending verification code:', error);
    throw error;
  }
};

export const verifyCode = async (
  data: VerifyCodeRequest
): Promise<Profile> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/phone/verify_code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: data.phone,
        code: data.code,
        country_code: data.country_code.replace(/\D/g, ''),
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    const result = await response.json();

    const token = result.data?.token || result.token;
    const profile = result.data?.profile || result.profile;

    if (!token || !profile) {
      throw new Error('Missing token or profile in response');
    }

    localStorage.setItem('authToken', token);
    localStorage.removeItem('verificationCode');

    return {
      ...profile,
      token,
    };
  } catch (error) {
    console.error('[Auth API] Error verifying code:', error);
    throw error;
  }
};

export const checkAuth = async (): Promise<Profile | null> => {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) return null;

    const phone = decodeTokenAndGetPhone(token);

    if (!phone) return null;

    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/phone/info?phone=${phone}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
      }
      return null;
    }

    const profile: Profile = await response.json();
    return {
      ...profile,
      token,
    };
  } catch (error) {
    console.error('[Auth API] Error checking auth:', error);
    return null;
  }
};

const decodeTokenAndGetPhone = (token: string): string | null => {
  try {
    const tokenParts = token.split('.');

    if (tokenParts.length < 2) {
      console.error('Invalid JWT token');
      return null;
    }

    const payloadBase64 = tokenParts[1];

    if (typeof payloadBase64 !== 'string') {
      console.error('Invalid payload');
      return null;
    }

    const payloadJson = atob(payloadBase64);
    const decoded: DecodedToken = JSON.parse(payloadJson);

    return decoded.phone || null;
  } catch (error) {
    console.error('Error decoding token', error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('[Auth API] Error during logout:', error);
    throw error;
  }
};
