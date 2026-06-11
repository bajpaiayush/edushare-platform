import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResourcesPage from './ResourcesPage';
import { fetchResources } from '../api';

jest.mock('../api');

describe('ResourcesPage White Box Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockResources = [
    { id: 1, title: 'Math 101', subject: 'Math', description: 'Intro', uploader_name: 'Mr. Smith', file_url: 'http://test.com/1.pdf' },
    { id: 2, title: 'Science', subject: 'Physics', description: '', file_url: 'http://test.com/2.pdf' }
  ];

  test('renders loading state initially', () => {
    fetchResources.mockReturnValue(new Promise(() => {})); // Never resolves to keep it loading
    render(<ResourcesPage user={{ id: 1 }} />);
    expect(screen.getByText('Loading resources...')).toBeInTheDocument();
  });

  test('fetches and displays resources successfully', async () => {
    fetchResources.mockResolvedValueOnce({ data: mockResources });
    render(<ResourcesPage user={{ id: 1 }} />);

    await waitFor(() => {
      expect(screen.getByText('Math 101')).toBeInTheDocument();
      expect(screen.getByText('Science')).toBeInTheDocument();
    });
  });

  test('displays no resources found message', async () => {
    fetchResources.mockResolvedValueOnce({ data: [] });
    render(<ResourcesPage user={{ id: 1 }} />);

    await waitFor(() => {
      expect(screen.getByText('No resources found.')).toBeInTheDocument();
    });
  });

  test('handles search functionality and clear button', async () => {
    fetchResources.mockResolvedValueOnce({ data: mockResources }); // Initial load
    render(<ResourcesPage user={{ id: 1 }} />);
    
    await waitFor(() => expect(screen.getByText('Math 101')).toBeInTheDocument());

    fetchResources.mockResolvedValueOnce({ data: [mockResources[0]] }); // Search result
    
    const searchInput = screen.getByPlaceholderText('Search by title or subject...');
    fireEvent.change(searchInput, { target: { value: 'Math' } });
    
    // Simulate enter key
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(fetchResources).toHaveBeenCalledWith('Math');
    });

    // Clear search
    const clearBtn = screen.getByRole('button', { name: /clear/i });
    fetchResources.mockResolvedValueOnce({ data: mockResources }); // Clear result
    fireEvent.click(clearBtn);

    await waitFor(() => {
      expect(searchInput.value).toBe('');
      expect(fetchResources).toHaveBeenCalledWith('');
    });
  });

  test('handles search button click', async () => {
    fetchResources.mockResolvedValue({ data: [] });
    render(<ResourcesPage user={{ id: 1 }} />);
    
    fireEvent.change(screen.getByPlaceholderText('Search by title or subject...'), { target: { value: 'Physics' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(fetchResources).toHaveBeenCalledWith('Physics');
    });
  });

  test('handles error state', async () => {
    fetchResources.mockRejectedValueOnce(new Error('Failed to load'));
    render(<ResourcesPage user={{ id: 1 }} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load resources. Please try again.')).toBeInTheDocument();
    });
  });
});
