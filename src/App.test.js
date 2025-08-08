import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock timers for testing setTimeout
jest.useFakeTimers();

describe('SSH Operations Dashboard', () => {
  beforeEach(() => {
    // Clear any previous timers
    jest.clearAllTimers();
  });

  afterEach(() => {
    // Run all pending timers
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  test('renders SSH Operations Dashboard header', () => {
    render(<App />);
    expect(screen.getByText('SSH Operations Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Real-time session management with AWS AppSync integration')).toBeInTheDocument();
  });

  test('renders navigation tabs', () => {
    render(<App />);
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('Broadcasting')).toBeInTheDocument();
  });

  test('displays sessions tab by default', () => {
    render(<App />);
    expect(screen.getByText('All Sessions')).toBeInTheDocument();
    expect(screen.getByDisplayValue('🌐 All (14)')).toBeInTheDocument();
  });

  test('switches between tabs', async () => {
    render(<App />);
    
    // Click on Broadcasting tab
    fireEvent.click(screen.getByText('Broadcasting'));
    expect(screen.getByText('📡 Message Broadcasting')).toBeInTheDocument();
    
    // Click back on Sessions tab
    fireEvent.click(screen.getByText('Sessions'));
    expect(screen.getByText('All Sessions')).toBeInTheDocument();
  });

  test('displays host dropdown with all servers', () => {
    render(<App />);
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    expect(hostDropdown).toBeInTheDocument();
    
    // Open dropdown to check options
    fireEvent.click(hostDropdown);
    expect(screen.getAllByText('server-01.example.com')[0]).toBeInTheDocument();
    expect(screen.getAllByText('server-02.production.com')[0]).toBeInTheDocument();
  });

  test('selects a specific host and shows session details', async () => {
    render(<App />);
    
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    // Check if session details are displayed
    expect(screen.getByText('server-01.example.com Session')).toBeInTheDocument();
  });

  test('displays session action buttons when host is selected', async () => {
    render(<App />);
    
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    // Check for action buttons
    expect(screen.getByTitle('Start SSH Session')).toBeInTheDocument();
    expect(screen.getByTitle('Stop SSH Session')).toBeInTheDocument();
    expect(screen.getByTitle('Refresh Session Status')).toBeInTheDocument();
    expect(screen.getByTitle('Force Kill Session')).toBeInTheDocument();
    expect(screen.getByTitle('Show Session Details')).toBeInTheDocument();
  });

  test('shows message when starting a session', async () => {
    render(<App />);
    
    // Select a specific host
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    // Click start session button
    const startButton = screen.getByTitle('Start SSH Session');
    fireEvent.click(startButton);
    
    // Advance timers to simulate the async operation
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/✅ Session Started!/)).toBeInTheDocument();
    });
  });

  test('shows warning when trying to start session with all hosts selected', async () => {
    render(<App />);
    
    // Ensure "All Hosts" is selected (default state)
    expect(screen.getByDisplayValue('🌐 All (14)')).toBeInTheDocument();
    
    // There should be no start button when all hosts are selected
    expect(screen.queryByTitle('Start SSH Session')).not.toBeInTheDocument();
  });

  test('refreshes all hosts when all hosts are selected', async () => {
    render(<App />);
    
    // Click refresh all button
    const refreshButton = screen.getByTitle('Refresh all host statuses');
    fireEvent.click(refreshButton);
    
    // Advance timers
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/All hosts data refreshed successfully!/)).toBeInTheDocument();
    });
  });

  test('displays session table with server data', () => {
    render(<App />);
    
    // Check if table headers are present
    expect(screen.getByText('Host')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Agent')).toBeInTheDocument();
    expect(screen.getByText('Machine')).toBeInTheDocument();
    expect(screen.getByText('Port')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    
    // Check if server data is displayed - use getAllByText for multiple occurrences
    expect(screen.getAllByText('server-01.example.com')[0]).toBeInTheDocument();
    expect(screen.getAllByText('server-02.production.com')[0]).toBeInTheDocument();
  });

  test('allows selecting individual sessions', async () => {
    render(<App />);
    
    // Find and click a checkbox
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // First server checkbox (index 0 is select all)
    
    // Check if selection count updates
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  test('allows selecting all sessions', async () => {
    render(<App />);
    
    // Find and click select all checkbox
    const selectAllCheckbox = screen.getByLabelText('All');
    fireEvent.click(selectAllCheckbox);
    
    // Check if all sessions are selected
    expect(screen.getByText('14 selected')).toBeInTheDocument();
  });

  test('enables bulk actions when sessions are selected', async () => {
    render(<App />);
    
    // Select a session
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    
    // Check if bulk action buttons are enabled
    const connectButton = screen.getByText('Connect (1)');
    expect(connectButton).not.toBeDisabled();
    
    const disconnectButton = screen.getByText('Disconnect');
    expect(disconnectButton).not.toBeDisabled();
  });

  test('disables bulk actions when no sessions are selected', () => {
    render(<App />);
    
    // Check if bulk action buttons are disabled
    const connectButton = screen.getByText('Connect (0)');
    expect(connectButton).toBeDisabled();
    
    const disconnectButton = screen.getByText('Disconnect');
    expect(disconnectButton).toBeDisabled();
  });
});
