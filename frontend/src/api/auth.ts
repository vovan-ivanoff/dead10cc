const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

export interface VerificationRequest {
  phone: string;
  country_code: string;
}

export interface VerificationResponse {
  success: boolean;
  message?: string;
  retry_delay?: number;
  code?: string;
}

export interface VerifyCodeRequest {
  phone: string;
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
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/auth/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    const result: VerificationResponse = await response.json();

    if (process.env.NODE_ENV === 'development' && result.success) {
      console.log(`Verification code for ${data.phone}: ${result.code}`);
    }

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
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/auth/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    const profile: Profile = await response.json();

    if (profile.token) {
      localStorage.setItem('authToken', profile.token);
    }

    return profile;
  } catch (error) {
    console.error('[Auth API] Error verifying code:', error);
    throw error;
  }
};

export const checkAuth = async (): Promise<Profile | null> => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('[Auth API] Error checking auth:', error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
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

export const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      return null;
    }

    const { token } = await response.json();
    
    if (token) {
      localStorage.setItem('authToken', token);
    }

    return token;
  } catch (error) {
    console.error('[Auth API] Error refreshing token:', error);
    return null;
  }
};