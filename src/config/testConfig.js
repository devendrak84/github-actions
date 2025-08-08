/**
 * Jest configuration for SSH Operations Dashboard tests
 */

// Test environment setup
export const testConfig = {
  // Mock timers configuration
  fakeTimers: {
    advanceTimers: true,
    doNotFake: ['nextTick', 'setImmediate']
  },
  
  // Test timeout for async operations
  testTimeout: 10000,
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Mock implementations
  mocks: {
    // Mock AWS AppSync operations
    mockBroadcastToChannel: jest.fn(() => 
      Promise.resolve({
        success: true,
        subscribersNotified: Math.floor(Math.random() * 10) + 1,
        messageId: `msg_${Date.now()}`
      })
    ),
    
    // Mock setTimeout for message auto-clear
    mockSetTimeout: jest.fn((callback, delay) => {
      setTimeout(callback, delay);
    }),
    
    // Mock fetch for API calls
    mockFetch: jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    )
  }
};

// Common test utilities and constants
export const testConstants = {
  DEFAULT_TIMEOUT: 5000,
  MESSAGE_CLEAR_TIME: 8000,
  API_RESPONSE_TIME: 1500,
  
  // Test server data
  TEST_SERVERS: {
    total: 14,
    connected: 9,
    disconnected: 3,
    refreshed: 2
  },
  
  // Expected element counts
  EXPECTED_ELEMENTS: {
    navigationTabs: 2,
    sessionTableHeaders: 9, // Including checkbox column
    bulkActionButtons: 2,
    channelButtons: 5
  }
};

// Test data generators
export const generateTestData = {
  randomServer: () => ({
    host: `test-server-${Math.random().toString(36).substr(2, 9)}.com`,
    username: `user-${Math.random().toString(36).substr(2, 5)}`,
    agentName: `Agent-${Math.random().toString(36).substr(2, 8)}`,
    machineName: `MACHINE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    port: Math.floor(Math.random() * 9000) + 1000,
    status: ['Connected', 'Disconnected', 'Refreshed'][Math.floor(Math.random() * 3)],
    connectedSince: new Date().toISOString(),
    lastActivity: new Date().toISOString()
  }),
  
  randomMessage: () => `Test message ${Math.random().toString(36).substr(2, 10)}`,
  
  randomChannel: () => ['ALL', 'HOST', 'USER', 'MACHINE', 'AGENT'][Math.floor(Math.random() * 5)]
};

// Test selectors (consistent element identification)
export const testSelectors = {
  // Main navigation
  sessionTab: '[data-testid="session-tab"], text=Sessions',
  broadcastingTab: '[data-testid="broadcasting-tab"], text=Broadcasting',
  
  // Host selection
  hostDropdown: 'select[data-testid="host-dropdown"], select:has-text("All")',
  
  // Session actions
  startSessionBtn: '[title="Start SSH Session"]',
  stopSessionBtn: '[title="Stop SSH Session"]',
  refreshSessionBtn: '[title="Refresh Session Status"]',
  killSessionBtn: '[title="Force Kill Session"]',
  showDetailsBtn: '[title="Show Session Details"]',
  
  // Table elements
  sessionTable: 'table[data-testid="session-table"], table',
  selectAllCheckbox: 'input[data-testid="select-all"], input[type="checkbox"]:first',
  sessionCheckboxes: 'input[data-testid^="session-checkbox-"], tbody input[type="checkbox"]',
  
  // Broadcasting elements
  messageTextarea: 'textarea[placeholder="Enter your message..."]',
  sendButton: 'button:has-text("Send"), [data-testid="send-button"]',
  channelButtons: '[data-testid^="channel-"], button:has-text("ALL,HOST,USER,MACHINE,AGENT")',
  
  // Status and feedback
  messageContainer: '.message-container, [data-testid="message-container"]',
  selectionCount: '[data-testid="selection-count"], text=selected',
  sessionStats: '[data-testid="session-stats"], text=Total'
};

// Accessibility testing configuration
export const a11yConfig = {
  rules: {
    // Color contrast requirements
    'color-contrast': { enabled: true },
    
    // Keyboard navigation
    'keyboard': { enabled: true },
    
    // ARIA labels and roles
    'aria-labels': { enabled: true },
    'role-has-required-aria-props': { enabled: true },
    
    // Form controls
    'label': { enabled: true },
    'form-field-multiple-labels': { enabled: true }
  },
  
  // Tags to test
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']
};

// Performance testing benchmarks
export const performanceBenchmarks = {
  initialRender: 100, // ms
  tabSwitch: 50, // ms
  hostSelection: 100, // ms
  messageDisplay: 50, // ms
  bulkOperation: 200, // ms
  
  // Memory usage (approximate)
  maxMemoryUsage: 50 * 1024 * 1024, // 50MB
  
  // Network requests
  maxApiCalls: 5, // per user action
  apiTimeout: 5000 // ms
};

// Error scenarios for testing
export const errorScenarios = {
  networkError: {
    type: 'NetworkError',
    message: 'Failed to fetch',
    simulate: () => Promise.reject(new Error('Network error'))
  },
  
  timeoutError: {
    type: 'TimeoutError',
    message: 'Request timeout',
    simulate: () => new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 1000)
    )
  },
  
  validationError: {
    type: 'ValidationError',
    message: 'Invalid input',
    conditions: ['empty message', 'invalid port', 'missing host']
  }
};

// Browser compatibility testing
export const browserCompat = {
  supported: [
    'Chrome >= 90',
    'Firefox >= 88',
    'Safari >= 14',
    'Edge >= 90'
  ],
  
  features: [
    'CSS Grid',
    'CSS Flexbox',
    'ES6 Modules',
    'Async/Await',
    'WebSocket',
    'Local Storage'
  ]
};

export default {
  testConfig,
  testConstants,
  generateTestData,
  testSelectors,
  a11yConfig,
  performanceBenchmarks,
  errorScenarios,
  browserCompat
};
