#!/usr/bin/env node

/**
 * Test runner script for SSH Operations Dashboard
 * Provides different testing modes and reporting options
 */

const { spawn } = require('child_process');
const path = require('path');

// Configuration
const config = {
  testDir: path.join(__dirname, '../src'),
  coverageDir: path.join(__dirname, '../coverage'),
  reportsDir: path.join(__dirname, '../test-reports')
};

// Test commands
const commands = {
  // Run all tests
  all: 'react-scripts test --coverage --silent --watchAll=false',
  
  // Run tests with coverage
  coverage: 'react-scripts test --coverage --coverageDirectory=coverage --watchAll=false',
  
  // Run tests in watch mode
  watch: 'react-scripts test',
  
  // Run specific test file
  file: (filename) => `react-scripts test ${filename} --watchAll=false`,
  
  // Run tests by pattern
  pattern: (pattern) => `react-scripts test --testNamePattern="${pattern}" --watchAll=false`,
  
  // Run integration tests only
  integration: 'react-scripts test --testPathPattern="Integration" --watchAll=false',
  
  // Run unit tests only (exclude integration)
  unit: 'react-scripts test --testPathIgnorePatterns="Integration" --watchAll=false',
  
  // Run tests with verbose output
  verbose: 'react-scripts test --verbose --watchAll=false',
  
  // Run tests silently
  silent: 'react-scripts test --silent --watchAll=false',
  
  // Run performance tests
  performance: 'react-scripts test --testNamePattern="performance|Performance" --watchAll=false'
};

// Test suites
const testSuites = {
  smoke: [
    'App.test.js',
    'components/UIComponents.test.js'
  ],
  
  session: [
    'components/SessionManagement.test.js',
    'components/DataHandling.test.js'
  ],
  
  broadcasting: [
    'components/MessageBroadcasting.test.js'
  ],
  
  integration: [
    'components/Integration.test.js'
  ]
};

// Utility functions
function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

function displayHelp() {
  console.log(`
SSH Operations Dashboard Test Runner

Usage: node scripts/test-runner.js [command] [options]

Commands:
  all          Run all tests with coverage
  watch        Run tests in watch mode
  coverage     Run tests with detailed coverage report
  unit         Run unit tests only
  integration  Run integration tests only
  verbose      Run tests with verbose output
  silent       Run tests silently
  performance  Run performance tests only

Test Suites:
  smoke        Run smoke tests (basic functionality)
  session      Run session management tests
  broadcasting Run message broadcasting tests

Examples:
  node scripts/test-runner.js all
  node scripts/test-runner.js watch
  node scripts/test-runner.js unit
  node scripts/test-runner.js smoke
  
Environment Variables:
  CI=true      Run in CI mode (no watch, exit after tests)
  VERBOSE=true Run with verbose output
  `);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';
  
  // Handle help
  if (command === 'help' || command === '--help' || command === '-h') {
    displayHelp();
    return;
  }
  
  console.log('🧪 SSH Operations Dashboard Test Runner');
  console.log('=====================================\n');
  
  try {
    switch (command) {
      case 'all':
        console.log('📋 Running all tests with coverage...\n');
        await runCommand('npm', ['test', '--', '--coverage', '--watchAll=false']);
        break;
        
      case 'watch':
        console.log('👀 Running tests in watch mode...\n');
        await runCommand('npm', ['test']);
        break;
        
      case 'coverage':
        console.log('📊 Running tests with detailed coverage...\n');
        await runCommand('npm', ['test', '--', '--coverage', '--coverageDirectory=coverage', '--watchAll=false', '--verbose']);
        break;
        
      case 'unit':
        console.log('🔧 Running unit tests only...\n');
        await runCommand('npm', ['test', '--', '--testPathIgnorePatterns=Integration', '--watchAll=false']);
        break;
        
      case 'integration':
        console.log('🔗 Running integration tests only...\n');
        await runCommand('npm', ['test', '--', '--testPathPattern=Integration', '--watchAll=false']);
        break;
        
      case 'verbose':
        console.log('🗣️ Running tests with verbose output...\n');
        await runCommand('npm', ['test', '--', '--verbose', '--watchAll=false']);
        break;
        
      case 'silent':
        console.log('🤫 Running tests silently...\n');
        await runCommand('npm', ['test', '--', '--silent', '--watchAll=false']);
        break;
        
      case 'performance':
        console.log('⚡ Running performance tests...\n');
        await runCommand('npm', ['test', '--', '--testNamePattern=performance|Performance', '--watchAll=false']);
        break;
        
      // Test suites
      case 'smoke':
        console.log('💨 Running smoke tests...\n');
        for (const testFile of testSuites.smoke) {
          await runCommand('npm', ['test', '--', testFile, '--watchAll=false']);
        }
        break;
        
      case 'session':
        console.log('🖥️ Running session management tests...\n');
        for (const testFile of testSuites.session) {
          await runCommand('npm', ['test', '--', testFile, '--watchAll=false']);
        }
        break;
        
      case 'broadcasting':
        console.log('📡 Running broadcasting tests...\n');
        for (const testFile of testSuites.broadcasting) {
          await runCommand('npm', ['test', '--', testFile, '--watchAll=false']);
        }
        break;
        
      default:
        console.log(`❌ Unknown command: ${command}`);
        console.log('Use "help" to see available commands.\n');
        displayHelp();
        process.exit(1);
    }
    
    console.log('\n✅ Tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Tests failed:', error.message);
    process.exit(1);
  }
}

// Handle process interruption
process.on('SIGINT', () => {
  console.log('\n⚠️ Test runner interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️ Test runner terminated');
  process.exit(0);
});

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  commands,
  testSuites,
  runCommand,
  main
};
