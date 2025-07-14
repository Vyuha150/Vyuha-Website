import Cookies from 'js-cookie';
import axios from 'axios';

export const getAuthToken = (): string | null => {
  return Cookies.get('authToken') || null;
};

export const getUserRole = (): string | null => {
  return Cookies.get('role') || null;
};

export const getUserId = (): string | null => {
  return Cookies.get('userId') || null;
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const authenticated = !!token;
  console.log('isAuthenticated check:', { hasToken: !!token, authenticated });
  return authenticated;
};

export const hasRole = (requiredRole: string): boolean => {
  const userRole = getUserRole();
  const hasRoleResult = userRole === requiredRole;
  console.log('hasRole check:', { userRole, requiredRole, hasRole: hasRoleResult });
  return hasRoleResult;
};

export const hasAnyRole = (requiredRoles: string[]): boolean => {
  const userRole = getUserRole();
  return requiredRoles.includes(userRole || '');
};

export const verifyToken = async (): Promise<boolean> => {
  try {
    const token = getAuthToken();
    console.log('Verifying token, token exists:', !!token);
    
    if (!token) {
      console.log('No token found for verification');
      return false;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`;
    console.log('Making verification request to:', apiUrl);
    
    const response = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Verification response status:', response.status);
    return response.status === 200;
  } catch (error) {
    console.error('Token verification failed:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    }
    return false;
  }
};

export const logout = (): void => {
  Cookies.remove('authToken');
  Cookies.remove('userId');
  Cookies.remove('role');
  window.location.href = '/auth/sign-in';
}; 