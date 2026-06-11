import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminPage from './AdminPage';
import { fetchAllUsers, fetchResources, deleteResource } from '../api';

jest.mock('../api');

describe('AdminPage White Box Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUsers = [
    { id: 1, name: 'Alice Admin', email: 'alice@test.com', role: 'admin' },
    { id: 2, name: 'Bob Student', email: 'bob@test.com', role: 'student' },
    { id: 3, name: 'Charlie Teacher', email: 'charlie@test.com', role: 'teacher' }
  ];

  const mockResources = [
    { id: 1, title: 'Math 101', subject: 'Math', uploader_name: 'Charlie' },
    { id: 2, title: 'Science 101', subject: 'Science', uploader_name: 'Charlie' }
  ];

  test('renders loading state initially and fetches users by default', async () => {
    fetchAllUsers.mockReturnValue(new Promise(() => {})); // pending promise
    render(<AdminPage />);
    expect(screen.getByText('🛡️ Admin Panel')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays users', async () => {
    fetchAllUsers.mockResolvedValueOnce({ data: mockUsers });
    render(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText('Alice Admin')).toBeInTheDocument();
      expect(screen.getByText('Bob Student')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('student')).toBeInTheDocument();
      expect(screen.getByText('teacher')).toBeInTheDocument();
    });
  });

  test('handles user fetch error', async () => {
    fetchAllUsers.mockRejectedValueOnce(new Error('Network error'));
    render(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load users.')).toBeInTheDocument();
    });
  });

  test('switches to resources tab and fetches resources', async () => {
    fetchAllUsers.mockResolvedValueOnce({ data: mockUsers });
    fetchResources.mockResolvedValueOnce({ data: mockResources });
    
    render(<AdminPage />);
    
    const resourcesTab = screen.getByRole('button', { name: /manage resources/i });
    fireEvent.click(resourcesTab);

    await waitFor(() => {
      expect(fetchResources).toHaveBeenCalled();
      expect(screen.getByText('Math 101')).toBeInTheDocument();
      expect(screen.getByText('Science 101')).toBeInTheDocument();
    });
  });

  test('handles resources fetch error', async () => {
    fetchAllUsers.mockResolvedValueOnce({ data: mockUsers });
    fetchResources.mockRejectedValueOnce(new Error('Network error'));
    
    render(<AdminPage />);
    fireEvent.click(screen.getByRole('button', { name: /manage resources/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to load resources.')).toBeInTheDocument();
    });
  });

  test('handles resource deletion success', async () => {
    fetchAllUsers.mockResolvedValueOnce({ data: mockUsers });
    fetchResources.mockResolvedValueOnce({ data: [mockResources[0]] });
    deleteResource.mockResolvedValueOnce({ data: { message: 'Deleted' } });
    
    // Mock window.confirm to return true
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);

    render(<AdminPage />);
    fireEvent.click(screen.getByRole('button', { name: /manage resources/i }));

    await waitFor(() => expect(screen.getByText('Math 101')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(deleteResource).toHaveBeenCalledWith(1);
      expect(screen.getByText('Resource deleted successfully.')).toBeInTheDocument();
      expect(screen.queryByText('Math 101')).not.toBeInTheDocument(); // Removed from list
    });

    confirmSpy.mockRestore();
  });

  test('handles resource deletion cancellation', async () => {
    fetchAllUsers.mockResolvedValueOnce({ data: mockUsers });
    fetchResources.mockResolvedValueOnce({ data: [mockResources[0]] });
    
    // Mock window.confirm to return false
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => false);

    render(<AdminPage />);
    fireEvent.click(screen.getByRole('button', { name: /manage resources/i }));

    await waitFor(() => expect(screen.getByText('Math 101')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(deleteResource).not.toHaveBeenCalled();
    expect(screen.getByText('Math 101')).toBeInTheDocument(); // Still in list

    confirmSpy.mockRestore();
  });

  test('handles resource deletion error', async () => {
    fetchAllUsers.mockResolvedValueOnce({ data: mockUsers });
    fetchResources.mockResolvedValueOnce({ data: [mockResources[0]] });
    deleteResource.mockRejectedValueOnce(new Error('Delete failed'));
    
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);

    render(<AdminPage />);
    fireEvent.click(screen.getByRole('button', { name: /manage resources/i }));

    await waitFor(() => expect(screen.getByText('Math 101')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to delete resource.')).toBeInTheDocument();
    });

    confirmSpy.mockRestore();
  });
});
