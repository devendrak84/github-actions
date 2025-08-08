import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';

jest.useFakeTimers();

describe('Data Handling and State Management', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  test('initializes with correct default data', () => {
    render(<App />);
    
    // Check default host selection
    expect(screen.getByDisplayValue('🌐 All (14)')).toBeInTheDocument();
    
    // Check default tab
    expect(screen.getByText('Sessions')).toHaveClass('active');
    
    // Check default channel in broadcasting (when switched)
    // This will be tested in a separate test
  });

  test('manages host server data correctly', () => {
    render(<App />);
    
    // Verify all 14 servers are present - use getAllByText for multiple occurrences
    const serverNames = [
      'server-01.example.com',
      'server-02.production.com',
      'server-03.staging.com',
      'server-04.database.com',
      'server-05.api.com',
      'server-06.monitoring.com',
      'server-07.backup.com',
      'server-08.analytics.com',
      'server-09.cache.com',
      'server-10.loadbalancer.com',
      'server-11.security.com',
      'server-12.logging.com',
      'server-13.ci-cd.com',
      'server-14.testing.com'
    ];
    
    serverNames.forEach(serverName => {
      expect(screen.getAllByText(serverName)[0]).toBeInTheDocument();
    });
  });

  test('updates session data when host changes', async () => {
    render(<App />);
    
    // Initially shows "Multiple" values
    expect(screen.getByDisplayValue('Multiple Users')).toBeInTheDocument();
    
    // Select specific host
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-02.production.com' } });
    
    // Should show specific user data
    expect(screen.getByDisplayValue('prod-user')).toBeInTheDocument();
    expect(screen.getByDisplayValue('SSH-Agent-002')).toBeInTheDocument();
    expect(screen.getByDisplayValue('PROD-SERVER-01')).toBeInTheDocument();
  });

  test('maintains editable field state', async () => {
    render(<App />);
    
    // Select a host
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    // Edit username
    const usernameInput = screen.getByDisplayValue('admin');
    fireEvent.change(usernameInput, { target: { value: 'newadmin' } });
    
    // Edit agent name
    const agentInput = screen.getByDisplayValue('SSH-Agent-001');
    fireEvent.change(agentInput, { target: { value: 'New-Agent-001' } });
    
    // Verify changes persist
    expect(screen.getByDisplayValue('newadmin')).toBeInTheDocument();
    expect(screen.getByDisplayValue('New-Agent-001')).toBeInTheDocument();
  });

  test('handles multiple session selections', async () => {
    render(<App />);
    
    // Get all checkboxes (excluding select all)
    const checkboxes = screen.getAllByRole('checkbox');
    const sessionCheckboxes = checkboxes.slice(1); // Skip the select all checkbox
    
    // Select first 3 sessions
    fireEvent.click(sessionCheckboxes[0]);
    fireEvent.click(sessionCheckboxes[1]);
    fireEvent.click(sessionCheckboxes[2]);
    
    // Check selection count
    expect(screen.getByText('3 selected')).toBeInTheDocument();
    
    // Verify bulk action buttons are enabled
    expect(screen.getByText('Connect (3)')).not.toBeDisabled();
    expect(screen.getByText('Disconnect')).not.toBeDisabled();
  });

  test('select all functionality', async () => {
    render(<App />);
    
    // Click select all
    const selectAllCheckbox = screen.getByLabelText('All');
    fireEvent.click(selectAllCheckbox);
    
    // All 14 sessions should be selected
    expect(screen.getByText('14 selected')).toBeInTheDocument();
    
    // Click again to deselect all
    fireEvent.click(selectAllCheckbox);
    
    // Should be back to 0 selected
    expect(screen.getByText('0 selected')).toBeInTheDocument();
  });

  test('preserves state when switching between tabs', async () => {
    render(<App />);
    
    // Make selections in sessions tab
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-03.staging.com' } });
    
    // Select some sessions
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);
    
    // Switch to broadcasting tab
    fireEvent.click(screen.getByText('Broadcasting'));
    
    // Switch back to sessions tab
    fireEvent.click(screen.getByText('Sessions'));
    
    // State should be preserved
    expect(screen.getByDisplayValue('server-03.staging.com')).toBeInTheDocument();
    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  test('handles status changes correctly', async () => {
    render(<App />);
    
    // Select a host
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    // Find and change status - use getAllByDisplayValue for multiple occurrences
    const statusSelect = screen.getAllByDisplayValue('Connected')[0];
    fireEvent.change(statusSelect, { target: { value: 'Disconnected' } });
    
    // Status should be updated
    expect(screen.getAllByDisplayValue('Disconnected')[0]).toBeInTheDocument();
  });

  test('validates port number inputs', async () => {
    render(<App />);
    
    // Select a host
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    // Find port input - use getAllByDisplayValue for multiple occurrences
    const portInput = screen.getAllByDisplayValue('22')[0];
    
    // Test valid port
    fireEvent.change(portInput, { target: { value: '8080' } });
    expect(portInput).toHaveValue(8080);
    
    // Port input should have min/max constraints
    expect(portInput).toHaveAttribute('min', '1');
    expect(portInput).toHaveAttribute('max', '65535');
  });

  test('calculates session statistics correctly', () => {
    render(<App />);
    
    // Get the stats element
    const statsElement = screen.getByText(/Total: 14/);
    
    // Parse the text to verify calculations
    const statsText = statsElement.textContent;
    expect(statsText).toMatch(/Total: 14/);
    expect(statsText).toMatch(/Connected: \d+/);
    expect(statsText).toMatch(/Disconnected: \d+/);
    
    // The numbers should add up logically
    const connectedMatch = statsText.match(/Connected: (\d+)/);
    const disconnectedMatch = statsText.match(/Disconnected: (\d+)/);
    
    if (connectedMatch && disconnectedMatch) {
      const connected = parseInt(connectedMatch[1]);
      const disconnected = parseInt(disconnectedMatch[1]);
      
      // Should have some connected and some disconnected servers
      expect(connected).toBeGreaterThan(0);
      expect(disconnected).toBeGreaterThan(0);
      expect(connected + disconnected).toBeLessThanOrEqual(14);
    }
  });

  test('handles empty or invalid states gracefully', async () => {
    render(<App />);
    
    // Select a host and clear required fields
    const hostDropdown = screen.getByDisplayValue('🌐 All (14)');
    fireEvent.change(hostDropdown, { target: { value: 'server-01.example.com' } });
    
    // Clear username (which might be required)
    const usernameInput = screen.getByDisplayValue('admin');
    fireEvent.change(usernameInput, { target: { value: '' } });
    
    // App should still function
    expect(usernameInput).toHaveValue('');
    
    // Other operations should still work
    const refreshButton = screen.getByTitle('Refresh Session Status');
    expect(refreshButton).toBeInTheDocument();
  });

  test('manages time-based data correctly', () => {
    render(<App />);
    
    // Check that timestamps are displayed
    // Look for time patterns in connected since column
    const timeElements = screen.getAllByText(/\d{2}:\d{2}:\d{2}/);
    expect(timeElements.length).toBeGreaterThan(0);
  });
});
