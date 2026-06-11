import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterPage from './RegisterPage';
import { registerUser } from '../api';

jest.mock('../api');

describe('RegisterPage White Box Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form correctly', () => {
    render(<RegisterPage onGoLogin={() => {}} />);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Choose a password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('allows user to enter details', () => {
    render(<RegisterPage onGoLogin={() => {}} />);
    
    fireEvent.change(screen.getByPlaceholderText('Your full name'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'alice@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Choose a password'), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByLabelText('Register as'), { target: { value: 'teacher' } });

    expect(screen.getByPlaceholderText('Your full name').value).toBe('Alice');
    expect(screen.getByPlaceholderText('your@email.com').value).toBe('alice@test.com');
    expect(screen.getByPlaceholderText('Choose a password').value).toBe('pass123');
    expect(screen.getByLabelText('Register as').value).toBe('teacher');
  });

  test('handles successful registration', async () => {
    registerUser.mockResolvedValueOnce({ data: { message: 'Success' } });

    render(<RegisterPage onGoLogin={() => {}} />);
    
    fireEvent.change(screen.getByPlaceholderText('Your full name'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'alice@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Choose a password'), { target: { value: 'pass123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        name: 'Alice', email: 'alice@test.com', password: 'pass123', role: 'student'
      });
      expect(screen.getByText('Registration successful! You can now login.')).toBeInTheDocument();
      // Form should reset
      expect(screen.getByPlaceholderText('Your full name').value).toBe('');
    });
  });

  test('handles registration error from backend', async () => {
    registerUser.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists.' } }
    });

    render(<RegisterPage onGoLogin={() => {}} />);
    
    fireEvent.change(screen.getByPlaceholderText('Your full name'), { target: { value: 'Alice' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already exists.')).toBeInTheDocument();
    });
  });

  test('handles generic network error', async () => {
    registerUser.mockRejectedValueOnce(new Error('Network error'));

    render(<RegisterPage onGoLogin={() => {}} />);
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Registration failed.')).toBeInTheDocument();
    });
  });
});
