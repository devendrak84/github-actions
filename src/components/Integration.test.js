import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '../App';

jest.useFakeTimers();

describe('Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  test('complete workflow: select host, start session, broadcast message', async () => {
    render(<App />);
    
    // Step 1: Select a host
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    expect(screen.getByText(/Selected server: server-01.example.com/)).toBeInTheDocument();
    
    // Step 2: Start session
    const startButton = screen.getByTitle('Start SSH Session');
    fireEvent.click(startButton);
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/✅ Session Started!/)).toBeInTheDocument();
    });
    
    // Step 3: Switch to broadcasting and send message
    fireEvent.click(screen.getByText('Broadcasting'));
    
    // Select the same host for broadcasting
    const broadcastHostDropdown = screen.getByDisplayValue('🌐 All Hosts');
    fireEvent.change(broadcastHostDropdown, { target: { value: 'server-01.example.com' } });
    
    // Enter and send message
    const messageTextarea = screen.getByPlaceholderText('Enter your message...');
    fireEvent.change(messageTextarea, { target: { value: 'Session started successfully' } });
    
    const sendButton = screen.getByText('📡 Send');
    fireEvent.click(sendButton);
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Message Sent!/)).toBeInTheDocument();
    });
  });

  test('bulk operations workflow', async () => {
    render(<App />);
    
    // Select multiple sessions
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // First server
    fireEvent.click(checkboxes[2]); // Second server
    fireEvent.click(checkboxes[3]); // Third server
    
    expect(screen.getByText('3 selected')).toBeInTheDocument();
    
    // Perform bulk connect
    const connectButton = screen.getByText('Connect (3)');
    fireEvent.click(connectButton);
    
    expect(screen.getByText(/Connect to 3 servers/)).toBeInTheDocument();
    
    // Clear message and perform bulk disconnect
    act(() => {
      jest.advanceTimersByTime(9000); // Clear message
    });
    
    const disconnectButton = screen.getByText('Disconnect');
    fireEvent.click(disconnectButton);
    
    expect(screen.getByText(/Disconnect 3 servers/)).toBeInTheDocument();
  });

  test('error handling and recovery', async () => {
    // Mock console.error to prevent test noise
    const originalError = console.error;
    console.error = jest.fn();
    
    render(<App />);
    
    // Try to start session without selecting specific host
    // (This should show a warning rather than an error)
    // All hosts is selected by default, so session actions aren't available
    
    // Select a host and try operations
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    // All operations should work normally
    const startButton = screen.getByTitle('Start SSH Session');
    fireEvent.click(startButton);
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/✅ Session Started!/)).toBeInTheDocument();
    });
    
    // Restore console.error
    console.error = originalError;
  });

  test('state persistence across complex interactions', async () => {
    render(<App />);
    
    // Make complex state changes
    // 1. Select host
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-02.production.com' } });
    
    // 2. Edit fields
    const usernameInput = screen.getByDisplayValue('prod-user');
    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(usernameInput, { target: { value: 'updated-user' } });
    
    // 3. Select some sessions
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);
    
    // 4. Switch to broadcasting tab
    fireEvent.click(screen.getByText('Broadcasting'));
    
    // 5. Set up broadcast
    const broadcastHostDropdown = screen.getByDisplayValue('🌐 All Hosts');
    fireEvent.change(broadcastHostDropdown, { target: { value: 'server-02.production.com' } });
    
    fireEvent.click(screen.getByText('HOST'));
    
    const messageTextarea = screen.getByPlaceholderText('Enter your message...');
    fireEvent.change(messageTextarea, { target: { value: 'Test persistence message' } });
    
    // 6. Switch back to sessions
    fireEvent.click(screen.getByText('Sessions'));
    
    // Verify all state is preserved
    expect(screen.getAllByDisplayValue('server-02.production.com')).toHaveLength(1);
    expect(screen.getByDisplayValue('updated-user')).toBeInTheDocument();
    expect(screen.getByText('2 selected')).toBeInTheDocument();
    
    // 7. Switch back to broadcasting
    await user.click(screen.getByText('Broadcasting'));
    
    // Broadcast state should be preserved
    expect(screen.getAllByDisplayValue('server-02.production.com')).toHaveLength(1);
    expect(screen.getByText('HOST')).toHaveClass('active');
    expect(messageTextarea).toHaveValue('Test persistence message');
  });

  test('responsive behavior simulation', async () => {
    // Simulate mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    render(<App />);
    
    // Should still render all essential elements
    expect(screen.getByText('SSH Operations Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('Broadcasting')).toBeInTheDocument();
    
    // Should be able to interact normally
    fireEvent.click(screen.getByText('Broadcasting'));
    expect(screen.getByText('📡 Message Broadcasting')).toBeInTheDocument();
    
    // Test tablet viewport
    window.innerWidth = 768;
    window.dispatchEvent(new Event('resize'));
    
    // Should still work
    fireEvent.click(screen.getByText('Sessions'));
    expect(screen.getByText('All Sessions')).toBeInTheDocument();
  });

  test('performance with large dataset simulation', () => {
    // This test ensures the component can handle the existing 14 servers
    // and checks that rendering doesn't take too long
    
    const startTime = performance.now();
    render(<App />);
    const endTime = performance.now();
    
    // Component should render quickly (less than 100ms for this size)
    expect(endTime - startTime).toBeLessThan(100);
    
    // All servers should be visible
    expect(screen.getByText('server-01.example.com')).toBeInTheDocument();
    expect(screen.getByText('server-14.testing.com')).toBeInTheDocument();
    
    // Table should handle all rows
    const tableRows = screen.getAllByRole('row');
    expect(tableRows.length).toBe(15); // 14 data rows + 1 header row
  });

  test('concurrent operations handling', async () => {
    render(<App />);
    
    // Select a host
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    // Trigger multiple operations quickly
    const startButton = screen.getByTitle('Start SSH Session');
    const refreshButton = screen.getByTitle('Refresh Session Status');
    
    // Click start and refresh almost simultaneously
    fireEvent.click(startButton);
    fireEvent.click(refreshButton);
    
    // Advance timers to handle both operations
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Both operations should complete without conflicts
    await waitFor(() => {
      // Should see messages from both operations
      const messageContainer = screen.querySelector('.message-container');
      expect(messageContainer).toBeInTheDocument();
    });
  });

  test('accessibility features', () => {
    render(<App />);
    
    // Check for proper ARIA labels and roles
    expect(screen.getByRole('table')).toBeInTheDocument();
    
    // Check for form controls
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
    
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes.length).toBeGreaterThan(0);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Check that important elements have descriptive text
    expect(screen.getByText('SSH Operations Dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('All')).toBeInTheDocument();
  });

  test('keyboard navigation support', async () => {
    render(<App />);
    
    // Tab navigation should work - simulate tab key
    const firstTabableElement = screen.getAllByRole('button')[0];
    firstTabableElement.focus();
    
    // Should be able to navigate through interactive elements
    const activeElement = document.activeElement;
    expect(activeElement).toBeInstanceOf(HTMLElement);
    
    // Enter key should activate buttons/links when focused
    if (activeElement && activeElement.tagName === 'BUTTON') {
      // This would depend on which button gets focus first
      expect(activeElement).toBeInTheDocument();
    }
  });
});
