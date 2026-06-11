import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from './LoginPage';
import { loginUser } from '../api';

// Mock the api module so we don't make real network requests during testing
jest.mock('../api');

describe('LoginPage White Box Tests', () => {
  // Test 1: Statement Coverage - Does the component render properly?
  test('renders login form correctly', () => {
    render(<LoginPage onLogin={() => {}} onGoRegister={() => {}} />);
    
    expect(screen.getByText('Login to EduShare')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  // Test 2: Branch Coverage - Simulating User Input and state changes
  test('allows user to enter email and password', () => {
    render(<LoginPage onLogin={() => {}} onGoRegister={() => {}} />);
    
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@test.com');
    expect(passwordInput.value).toBe('password123');
  });

  // Test 3: Path Coverage - Successful Login Path
  test('handles successful login and calls onLogin', async () => {
    const mockOnLogin = jest.fn(); // Mock function to track if it was called
    
    // Mock the API response to simulate a successful login
    loginUser.mockResolvedValueOnce({
      data: { user: { id: 1, name: 'John' }, token: 'fake-token' }
    });

    render(<LoginPage onLogin={mockOnLogin} onGoRegister={() => {}} />);
    
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for the async API call to complete
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' });
      expect(mockOnLogin).toHaveBeenCalledWith({ id: 1, name: 'John' }, 'fake-token');
    });
  });

  // Test 4: Path Coverage - Failed Login Path (Error Handling)
  test('handles login failure and displays error message', async () => {
    // Mock the API response to simulate an error (e.g., wrong password)
    loginUser.mockRejectedValueOnce({
      response: { data: { message: 'Invalid email or password.' } }
    });

    render(<LoginPage onLogin={() => {}} onGoRegister={() => {}} />);
    
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'wrongpass' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for the error message to appear in the document
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
    });
  });

  // Test 5: Path Coverage - Failed Login Path (Network Error / Fallback Message)
  test('handles network error and displays fallback message', async () => {
    // Mock the API response to simulate a network error (no response data)
    loginUser.mockRejectedValueOnce(new Error('Network Error'));

    render(<LoginPage onLogin={() => {}} onGoRegister={() => {}} />);
    
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'wrongpass' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for the fallback error message to appear
    await waitFor(() => {
      expect(screen.getByText('Login failed. Try again.')).toBeInTheDocument();
    });
  });
});
