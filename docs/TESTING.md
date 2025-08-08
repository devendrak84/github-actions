# SSH Operations Dashboard - Test Suite

This document describes the comprehensive test suite for the SSH Operations Dashboard application.

## Overview

The test suite covers all major functionality of the SSH Operations Dashboard including:
- Session management (start, stop, refresh, kill sessions)
- Message broadcasting via AWS AppSync
- User interface interactions
- Data handling and state management
- Integration testing
- Performance testing

## Test Structure

### Test Files

```
src/
├── App.test.js                           # Main application tests
├── components/
│   ├── SessionManagement.test.js         # Session operations tests
│   ├── MessageBroadcasting.test.js       # Broadcasting functionality tests
│   ├── UIComponents.test.js              # User interface tests
│   ├── DataHandling.test.js              # State management tests
│   └── Integration.test.js               # End-to-end integration tests
├── utils/
│   └── testUtils.js                      # Common test utilities
├── config/
│   └── testConfig.js                     # Test configuration
└── setupTests.js                         # Test environment setup
```

### Test Categories

#### 1. Unit Tests
- **App.test.js**: Core application rendering and navigation
- **SessionManagement.test.js**: SSH session operations
- **MessageBroadcasting.test.js**: Message broadcasting features
- **UIComponents.test.js**: User interface components
- **DataHandling.test.js**: State management and data flow

#### 2. Integration Tests
- **Integration.test.js**: Complete user workflows and cross-component interactions

#### 3. Performance Tests
- Render time measurements
- Memory usage monitoring
- Large dataset handling

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run with verbose output
npm run test:verbose

# Run silently
npm run test:silent

# Run performance tests
npm run test:performance
```

### Using the Test Runner

```bash
# Run all tests with the custom test runner
npm run test:runner all

# Run specific test suites
npm run test:runner smoke      # Basic functionality
npm run test:runner session    # Session management
npm run test:runner broadcasting # Message broadcasting

# Run with different modes
npm run test:runner watch       # Watch mode
npm run test:runner coverage    # Detailed coverage
npm run test:runner performance # Performance tests
```

## Test Coverage

The test suite aims for comprehensive coverage of:

### Functional Coverage
- ✅ Host selection and switching
- ✅ Session management (start/stop/refresh/kill)
- ✅ Message broadcasting to different channels
- ✅ Bulk operations on multiple sessions
- ✅ Tab navigation and state persistence
- ✅ Editable fields and data validation
- ✅ Error handling and recovery

### UI Coverage
- ✅ Component rendering
- ✅ User interactions (clicks, typing, selection)
- ✅ Message display and auto-clearing
- ✅ Responsive design behavior
- ✅ Accessibility features

### Data Coverage
- ✅ State management
- ✅ Data persistence across tab switches
- ✅ Field validation
- ✅ Session statistics calculation

## Test Utilities

### Custom Render Function
```javascript
import { renderApp } from '../utils/testUtils';

// Render with custom setup
renderApp(<App />);
```

### Helper Functions
```javascript
import testUtils from '../utils/testUtils';

// Select a host
await testUtils.selectHost('server-01.example.com');

// Switch tabs
await testUtils.switchToTab('Broadcasting');

// Send broadcast message
await testUtils.sendBroadcastMessage('Test message', 'server-01.example.com', 'HOST');

// Select multiple sessions
await testUtils.selectSessions(3);
```

## Mocking Strategy

### Timer Mocking
```javascript
jest.useFakeTimers();
// Test async operations
jest.advanceTimersByTime(2000);
jest.useRealTimers();
```

### API Mocking
- AWS AppSync operations are mocked to return consistent test data
- Network requests simulate realistic delays and responses
- Error scenarios are testable through mock configurations

## Testing Best Practices

### 1. Arrange-Act-Assert Pattern
```javascript
test('starts SSH session successfully', async () => {
  // Arrange
  const user = userEvent.setup();
  render(<App />);
  
  // Act
  await user.selectOptions(hostDropdown, 'server-01.example.com');
  await user.click(startButton);
  
  // Assert
  expect(screen.getByText(/Session Started!/)).toBeInTheDocument();
});
```

### 2. User-Centric Testing
- Tests focus on user interactions rather than implementation details
- Uses accessible selectors (text, roles, labels)
- Simulates real user behavior

### 3. Async Testing
- Proper handling of async operations
- Uses `waitFor` for eventual consistency
- Advances timers for time-based operations

### 4. Error Testing
- Tests error scenarios and recovery
- Validates error messages and states
- Ensures graceful degradation

## Accessibility Testing

The test suite includes accessibility checks:
- Keyboard navigation
- Screen reader compatibility
- ARIA labels and roles
- Color contrast (where applicable)

## Performance Testing

Performance tests monitor:
- Initial render time (< 100ms target)
- Tab switching speed (< 50ms target)
- Memory usage for large datasets
- Network request optimization

## CI/CD Integration

Tests are designed to run in CI environments:
- No watch mode in CI
- Deterministic results
- Proper exit codes
- Coverage reporting

### Environment Variables
```bash
CI=true          # Run in CI mode
VERBOSE=true     # Enable verbose output
COVERAGE=true    # Generate coverage reports
```

## Debugging Tests

### Running Individual Tests
```bash
# Run specific test file
npm test -- SessionManagement.test.js

# Run specific test case
npm test -- --testNamePattern="starts SSH session"

# Run with debugging
npm test -- --verbose
```

### Common Issues
1. **Timer-related failures**: Ensure proper timer mocking
2. **Async operation timeouts**: Increase timeout or use proper awaiting
3. **State persistence issues**: Check cleanup between tests

## Coverage Goals

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## Continuous Improvement

The test suite is continuously improved by:
- Adding tests for new features
- Improving test reliability
- Enhancing performance testing
- Expanding accessibility coverage
- Regular review and refactoring

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Add integration tests for complex workflows
4. Update this documentation
5. Maintain coverage targets

For questions or issues with the test suite, please refer to the main project documentation or open an issue.
