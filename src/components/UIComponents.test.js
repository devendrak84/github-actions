import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';

jest.useFakeTimers();

describe('User Interface Components', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  test('displays EasyJet logo and branding', () => {
    render(<App />);
    
    const logo = screen.getByAltText('EasyJet SSH Operations');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('easyjet-logo.svg'));
  });

  test('shows compact navigation with icons', () => {
    render(<App />);
    
    // Check for tab icons
    expect(screen.getByTitle('SSH Sessions')).toBeInTheDocument();
    expect(screen.getByTitle('Broadcasting')).toBeInTheDocument();
  });

  test('displays message container with different types', async () => {
    render(<App />);
    
    // Select a host and trigger an action to show message
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    // Should show selection message
    expect(screen.getByText(/Selected server: server-01.example.com/)).toBeInTheDocument();
  });

  test('message auto-clears after timeout', async () => {
    jest.useFakeTimers();
    
    render(<App />);
    
    // Trigger a message
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    // Message should be visible
    expect(screen.getByText(/Selected server: server-01.example.com/)).toBeInTheDocument();
    
    // Fast forward 9 seconds (message clears after 8)
    act(() => {
      jest.advanceTimersByTime(9000);
    });
    
    // Message should be gone
    expect(screen.queryByText(/Selected server: server-01.example.com/)).not.toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('displays session statistics footer', () => {
    render(<App />);
    
    const statsFooter = screen.getByText(/Total: 14/);
    expect(statsFooter).toBeInTheDocument();
    expect(statsFooter.textContent).toMatch(/Connected: \d+/);
    expect(statsFooter.textContent).toMatch(/Disconnected: \d+/);
  });

  test('shows session details panel for selected host', async () => {
    render(<App />);
    
    // Select a specific host
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    // Check session details panel
    expect(screen.getByText(/🔗 Session: admin@server-01.example.com/)).toBeInTheDocument();
    expect(screen.getByText(/Agent: SSH-Agent-001/)).toBeInTheDocument();
    expect(screen.getByText(/Machine: WORKSTATION-DEV/)).toBeInTheDocument();
  });

  test('hides session details panel when all hosts selected', () => {
    render(<App />);
    
    // With "All Hosts" selected, session details should not be visible
    expect(screen.queryByText(/🔗 Session:/)).not.toBeInTheDocument();
  });

  test('displays responsive table with proper headers', () => {
    render(<App />);
    
    // Check table structure
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    // Check headers
    expect(screen.getByText('Host')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Agent')).toBeInTheDocument();
    expect(screen.getByText('Machine')).toBeInTheDocument();
    expect(screen.getByText('Port')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences
    expect(screen.getAllByText('Connected')[0]).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  test('shows status indicators with correct styling classes', () => {
    render(<App />);
    
    // Look for status elements - they should have status classes
    const statusElements = screen.getAllByRole('combobox').filter(element => 
      element.className.includes('status-select')
    );
    
    expect(statusElements.length).toBeGreaterThan(0);
  });

  test('displays port numbers correctly', () => {
    render(<App />);
    
    // Check for various port numbers in the data - use getAllByDisplayValue for multiple occurrences
    expect(screen.getAllByDisplayValue('22')[0]).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('2222')[0]).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('2200')[0]).toBeInTheDocument();
  });

  test('shows tooltips for action buttons', async () => {
    render(<App />);
    
    // Select a host to show action buttons
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    // Check for button tooltips
    expect(screen.getByTitle('Start SSH Session')).toBeInTheDocument();
    expect(screen.getByTitle('Stop SSH Session')).toBeInTheDocument();
    expect(screen.getByTitle('Refresh Session Status')).toBeInTheDocument();
    expect(screen.getByTitle('Force Kill Session')).toBeInTheDocument();
    expect(screen.getByTitle('Show Session Details')).toBeInTheDocument();
  });

  test('displays bulk operation buttons with counters', async () => {
    render(<App />);
    
    // Initially no selections
    expect(screen.getByText('Connect (0)')).toBeInTheDocument();
    expect(screen.getByText('0 selected')).toBeInTheDocument();
    
    // Select some sessions
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // First server
    fireEvent.click(checkboxes[2]); // Second server
    
    // Check updated counters
    expect(screen.getByText('Connect (2)')).toBeInTheDocument();
    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  test('handles window resize and responsive design', () => {
    // Mock window.innerWidth for responsive testing
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });
    
    render(<App />);
    
    // The component should render without errors at different screen sizes
    expect(screen.getByText('SSH Operations Dashboard')).toBeInTheDocument();
    
    // Test mobile size
    window.innerWidth = 480;
    window.dispatchEvent(new Event('resize'));
    
    expect(screen.getByText('SSH Operations Dashboard')).toBeInTheDocument();
  });

  test('tab navigation maintains state', async () => {
    render(<App />);
    
    // Select a host in sessions tab
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    // Switch to broadcasting tab
    fireEvent.click(screen.getByText('Broadcasting'));
    expect(screen.getByText('📡 Message Broadcasting')).toBeInTheDocument();
    
    // Switch back to sessions tab
    fireEvent.click(screen.getByText('Sessions'));
    
    // Selected host should be maintained
    expect(screen.getByDisplayValue('server-01.example.com')).toBeInTheDocument();
  });
});
