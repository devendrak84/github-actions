import { render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Custom render function with common setup
export function renderApp(component, options = {}) {
  const { initialProps = {}, ...renderOptions } = options;
  
  const Wrapper = ({ children }) => {
    return children;
  };

  return rtlRender(component, { wrapper: Wrapper, ...renderOptions });
}

// Helper function to select a host from dropdown
export async function selectHost(hostName) {
  const user = userEvent.setup();
  const hostDropdown = screen.getByDisplayValue(/All \(14\)|🌐 All Hosts/);
  await user.selectOptions(hostDropdown, hostName);
  return user;
}

// Helper function to switch tabs
export async function switchToTab(tabName) {
  const user = userEvent.setup();
  await user.click(screen.getByText(tabName));
  return user;
}

// Helper function to select multiple sessions
export async function selectSessions(count = 2) {
  const user = userEvent.setup();
  const checkboxes = screen.getAllByRole('checkbox');
  
  // Skip the first checkbox which is "select all"
  for (let i = 1; i <= count && i < checkboxes.length; i++) {
    await user.click(checkboxes[i]);
  }
  
  return user;
}

// Helper function to enter and send broadcast message
export async function sendBroadcastMessage(message, host = null, channel = null) {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  
  // Switch to broadcasting tab if not already there
  if (!screen.queryByText('📡 Message Broadcasting')) {
    await switchToTab('Broadcasting');
  }
  
  // Select host if specified
  if (host) {
    const hostDropdown = screen.getByDisplayValue('🌐 All Hosts');
    await user.selectOptions(hostDropdown, host);
  }
  
  // Select channel if specified
  if (channel) {
    await user.click(screen.getByText(channel));
  }
  
  // Enter message
  const messageTextarea = screen.getByPlaceholderText('Enter your message...');
  await user.type(messageTextarea, message);
  
  // Send message
  const sendButton = screen.getByText('📡 Send');
  await user.click(sendButton);
  
  return user;
}

// Helper function to wait for message to appear and auto-clear
export async function waitForMessage(messageText, timeout = 10000) {
  const messageElement = await screen.findByText(new RegExp(messageText), {}, { timeout });
  
  // Wait for message to auto-clear
  jest.advanceTimersByTime(9000);
  
  return messageElement;
}

// Mock data helpers
export const mockServerData = {
  'test-server-01': {
    host: 'test-server-01.example.com',
    username: 'testuser',
    agentName: 'Test-Agent-001',
    machineName: 'TEST-MACHINE-01',
    port: 22,
    status: 'Connected',
    connectedSince: '2025-08-08 10:00:00',
    lastActivity: '2025-08-08 10:30:00'
  },
  'test-server-02': {
    host: 'test-server-02.example.com',
    username: 'testuser2',
    agentName: 'Test-Agent-002',
    machineName: 'TEST-MACHINE-02',
    port: 2222,
    status: 'Disconnected',
    connectedSince: '2025-08-08 09:00:00',
    lastActivity: '2025-08-08 09:45:00'
  }
};

// Helper to check if element has specific CSS class
export function hasClass(element, className) {
  return element.classList.contains(className);
}

// Helper to get all table rows with data
export function getTableDataRows() {
  const table = screen.getByRole('table');
  const rows = table.querySelectorAll('tbody tr');
  return Array.from(rows);
}

// Helper to get session count by status
export function getSessionCountByStatus(status) {
  const statusSelects = screen.getAllByDisplayValue(status);
  return statusSelects.length;
}

// Helper to simulate timer advancement
export function advanceTimersAndFlush(time = 2000) {
  jest.advanceTimersByTime(time);
  return Promise.resolve();
}

// Helper to check if button is enabled
export function isButtonEnabled(buttonText) {
  const button = screen.getByText(buttonText);
  return !button.disabled;
}

// Helper to get current selection count
export function getSelectionCount() {
  const selectionText = screen.getByText(/\d+ selected/);
  const match = selectionText.textContent.match(/(\d+) selected/);
  return match ? parseInt(match[1]) : 0;
}

// Helper for testing responsive behavior
export function setViewportSize(width, height = 600) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  window.dispatchEvent(new Event('resize'));
}

// Helper to create custom events
export function createCustomEvent(eventType, detail = {}) {
  return new CustomEvent(eventType, { detail });
}

// Test data for common scenarios
export const testScenarios = {
  singleHostSelection: 'server-01.example.com',
  productionHost: 'server-02.production.com',
  stagingHost: 'server-03.staging.com',
  disconnectedHost: 'server-03.staging.com', // This one is disconnected by default
  customPort: 'server-06.monitoring.com', // This one uses port 2200
  
  broadcastMessages: {
    emergency: 'EMERGENCY: System maintenance in 5 minutes',
    info: 'Regular maintenance scheduled for tonight',
    test: 'This is a test broadcast message'
  },
  
  channels: ['ALL', 'HOST', 'USER', 'MACHINE', 'AGENT']
};

// Performance testing helper
export function measureRenderTime(renderFunction) {
  const startTime = performance.now();
  const result = renderFunction();
  const endTime = performance.now();
  
  return {
    result,
    renderTime: endTime - startTime
  };
}

// Helper to verify table structure
export function verifyTableStructure() {
  const expectedHeaders = [
    'Host', 'User', 'Agent', 'Machine', 'Port', 'Status', 'Connected', 'Actions'
  ];
  
  expectedHeaders.forEach(header => {
    expect(screen.getByText(header)).toBeInTheDocument();
  });
  
  // Verify table has data rows
  const dataRows = getTableDataRows();
  expect(dataRows.length).toBeGreaterThan(0);
  
  return dataRows;
}

// Helper to verify message broadcasting interface
export function verifyBroadcastingInterface() {
  expect(screen.getByText('📡 Message Broadcasting')).toBeInTheDocument();
  expect(screen.getByText('Target Host:')).toBeInTheDocument();
  expect(screen.getByText('Channel:')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter your message...')).toBeInTheDocument();
  expect(screen.getByText('📡 Send')).toBeInTheDocument();
}

export default {
  renderApp,
  selectHost,
  switchToTab,
  selectSessions,
  sendBroadcastMessage,
  waitForMessage,
  mockServerData,
  hasClass,
  getTableDataRows,
  getSessionCountByStatus,
  advanceTimersAndFlush,
  isButtonEnabled,
  getSelectionCount,
  setViewportSize,
  createCustomEvent,
  testScenarios,
  measureRenderTime,
  verifyTableStructure,
  verifyBroadcastingInterface
};
