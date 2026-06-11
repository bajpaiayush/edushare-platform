import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UploadPage from './UploadPage';
import { uploadResource } from '../api';

jest.mock('../api');

describe('UploadPage White Box Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form correctly', () => {
    render(<UploadPage user={{ id: 1 }} onSuccess={() => {}} />);
    expect(screen.getByText('📤 Upload Resource')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Chapter 3 - Data Structures')).toBeInTheDocument();
  });

  test('handles missing file error', async () => {
    render(<UploadPage user={{ id: 1 }} onSuccess={() => {}} />);
    
    fireEvent.change(screen.getByPlaceholderText('e.g. Chapter 3 - Data Structures'), { target: { value: 'Title' } });
    fireEvent.click(screen.getByRole('button', { name: /upload resource/i }));

    await waitFor(() => {
      expect(screen.getByText('Please select a file to upload.')).toBeInTheDocument();
    });
  });

  test('handles successful upload', async () => {
    jest.useFakeTimers();
    uploadResource.mockResolvedValueOnce({ data: { message: 'Success' } });
    const mockOnSuccess = jest.fn();

    render(<UploadPage user={{ id: 1 }} onSuccess={mockOnSuccess} />);
    
    fireEvent.change(screen.getByPlaceholderText('e.g. Chapter 3 - Data Structures'), { target: { value: 'Title' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Computer Science'), { target: { value: 'CS' } });
    
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/select file/i);
    
    // Simulate file selection
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /upload resource/i }));

    await waitFor(() => {
      expect(screen.getByText('Resource uploaded successfully!')).toBeInTheDocument();
    });

    jest.advanceTimersByTime(1500);
    expect(mockOnSuccess).toHaveBeenCalled();
    jest.useRealTimers();
  });

  test('handles upload error from backend', async () => {
    uploadResource.mockRejectedValueOnce({
      response: { data: { message: 'File too large.' } }
    });

    render(<UploadPage user={{ id: 1 }} onSuccess={() => {}} />);
    
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText(/select file/i), { target: { files: [file] } });
    
    fireEvent.click(screen.getByRole('button', { name: /upload resource/i }));

    await waitFor(() => {
      expect(screen.getByText('File too large.')).toBeInTheDocument();
    });
  });

  test('handles generic network upload error', async () => {
    uploadResource.mockRejectedValueOnce(new Error('Network error'));

    render(<UploadPage user={{ id: 1 }} onSuccess={() => {}} />);
    
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText(/select file/i), { target: { files: [file] } });
    
    fireEvent.click(screen.getByRole('button', { name: /upload resource/i }));

    await waitFor(() => {
      expect(screen.getByText('Upload failed. Try again.')).toBeInTheDocument();
    });
  });
});
