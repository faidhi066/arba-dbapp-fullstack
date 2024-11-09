import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define the shape of the AuthContext
interface AuthContextType {
  token: string | null;
  email: string | null;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create context with an initial value of null
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    const url = 'http://44.221.42.183:8000/token';
    const params = {
      email,
      password,
    };

    // Construct the URL with query parameters
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${url}?${queryString}`;

    console.log(fullUrl);
    const options = {
      method: 'POST',
    };

    try {
      const response = await fetch(fullUrl, options);
      const data = await response.json();
      if (data.access_token) {
        setToken(data.access_token); // Save token in context
        setEmail(email);
        return true; // Indicate success
      }
      console.log(data);
      return false; // Indicate failure
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    const url = 'http://44.221.42.183:8000/register';
    const body = {
      name,
      email,
      password,
    };
    const header = {
      'Content-Type': 'application/json', // Specify JSON content type
    };

    const options = {
      method: 'POST',
      headers: header,
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
      if (data.access_token) {
        setToken(data.access_token); // Save token in context
        setEmail(email);
        return true; // Indicate success
      }
      return false; // Indicate failure
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null); // Clear token on logout
  };

  return (
    <AuthContext.Provider value={{ token, email, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
