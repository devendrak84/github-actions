import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '../App';

jest.useFakeTimers();

describe('Message Broadcasting Features', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  test('switches to broadcasting tab', async () => {
    render(<App />);
    
    // Click on Broadcasting tab
    fireEvent.click(screen.getByText('Broadcasting'));
    
    expect(screen.getByText('📡 Message Broadcasting')).toBeInTheDocument();
    expect(screen.getByText('Target Host:')).toBeInTheDocument();
    expect(screen.getByText('Channel:')).toBeInTheDocument();
  });

  test('displays target host selection', async () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('Broadcasting'));
    
    // Check host dropdown
    const hostDropdown = screen.getByDisplayValue('🌐 All Hosts');
    expect(hostDropdown).toBeInTheDocument();
    
    // Test selecting a specific host
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    expect(hostDropdown).toHaveValue('server-01.example.com');
  });

  test('displays channel selection buttons', async () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('Broadcasting'));
    
    // Check all channel buttons
    expect(screen.getByText('ALL')).toBeInTheDocument();
    expect(screen.getByText('HOST')).toBeInTheDocument();
    expect(screen.getByText('USER')).toBeInTheDocument();
    expect(screen.getByText('MACHINE')).toBeInTheDocument();
    expect(screen.getByText('AGENT')).toBeInTheDocument();
    
    // Test selecting a channel
    fireEvent.click(screen.getByText('HOST'));
    expect(screen.getByText('HOST')).toHaveClass('active');
  });

  test('shows message input area', async () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('Broadcasting'));
    
    // Check message textarea
    const messageTextarea = screen.getByPlaceholderText('Enter your message...');
    expect(messageTextarea).toBeInTheDocument();
    
    // Check send button
    const sendButton = screen.getByText('📡 Send');
    expect(sendButton).toBeInTheDocument();
    expect(sendButton).toBeDisabled(); // Should be disabled when no message
  });

  test('enables send button when message is entered', async () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('Broadcasting'));
    
    const messageTextarea = screen.getByPlaceholderText('Enter your message...');
    const sendButton = screen.getByText('📡 Send');
    
    // Initially disabled
    expect(sendButton).toBeDisabled();
    
    // Type a message
    fireEvent.change(messageTextarea, { target: { value: 'Test broadcast message' } });
    
    // Should be enabled now
    expect(sendButton).not.toBeDisabled();
  });

  test('displays target information correctly', async () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('Broadcasting'));
    
    // Check default target info
    expect(screen.getByText(/All 14 hosts → All channels/)).toBeInTheDocument();
    
    // Change to specific host
    const hostDropdown = screen.getByDisplayValue('🌐 All Hosts');
    fireEvent.change(hostDropdown, { target: { value: 'server-02.production.com' } });
    
    expect(screen.getByText(/server-02.production.com → All channels/)).toBeInTheDocument();
    
    // Change channel
    fireEvent.click(screen.getByText('USER'));
    
    expect(screen.getByText(/server-02.production.com → USER/)).toBeInTheDocument();
  });

  test('shows AWS AppSync status information', async () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('Broadcasting'));
    
    expect(screen.getByText('AWS AppSync GraphQL • JSON Format • Real-time Delivery')).toBeInTheDocument();
  });

  test('broadcasts message successfully', async () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('Broadcasting'));
    
    // Enter message
    const messageTextarea = screen.getByPlaceholderText('Enter your message...');
    fireEvent.change(messageTextarea, { target: { value: 'Test message' } });
    
    // Send message
    const sendButton = screen.getByText('📡 Send');
    fireEvent.click(sendButton);
    
    // Wait for completion
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Message Sent!/)).toBeInTheDocument();
    });
  });

  test('clears message after successful broadcast', async () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('Broadcasting'));
    
    const messageTextarea = screen.getByPlaceholderText('Enter your message...');
    fireEvent.change(messageTextarea, { target: { value: 'Test message to clear' } });
    
    expect(messageTextarea).toHaveValue('Test message to clear');
    
    const sendButton = screen.getByText('📡 Send');
    fireEvent.click(sendButton);
    
    // Wait for completion
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(messageTextarea).toHaveValue('');
    });
  });
});
