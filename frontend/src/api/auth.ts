const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_PREFIX = '/api/v1/phone_auth';

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
  country_code: string;
}

export interface Profile {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatar_url?: string;
  token?: string;
}

interface ApiError {
  detail?: string;
  message?: string;
  code?: string;
}
export interface UserInfo {
  phoneNumber: string;
}

export async function getUserInfo(): Promise<UserInfo> {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}/info`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }

  return response.json();
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
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/phone/send_code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result = await response.json();
    return {
      success: result.success,
      message: result.message,
      code: result.data?.code,
    };
  } catch (error) {
    console.error('[Auth API] Error sending verification code:', error);
    throw error;
  }
};

export const verifyCode = async (
  data: VerifyCodeRequest
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/phone/verify_code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return true;
  } catch (error) {
    console.error('[Auth API] Error verifying code:', error);
    throw error;
  }
};

export const checkAuth = async (): Promise<Profile | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/phone/info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.log("Unauthorized: User is not authenticated.");
        return null;
      }
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('[Auth API] Error checking auth:', error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/phone/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      await handleApiError(response);
    }
  } catch (error) {
    console.error('[Auth API] Error during logout:', error);
    throw error;
  }
};

export const refreshToken = async (): Promise<Profile | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/phone/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('[Auth API] Error refreshing token:', error);
    return null;
  }
};
