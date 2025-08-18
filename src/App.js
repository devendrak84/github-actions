import easyjetLogo from './easyjet-logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [selectedHost, setSelectedHost] = useState('ALL_HOSTS');
  const [activeTab, setActiveTab] = useState('sessions');
  // eslint-disable-next-line no-unused-vars
  const [editableFields, setEditableFields] = useState({});
  const [selectedSessions, setSelectedSessions] = useState({});
  const [customBroadcastMessage, setCustomBroadcastMessage] = useState('');
  const [messagingHost, setMessagingHost] = useState('ALL_HOSTS');
  const [selectedChannel, setSelectedChannel] = useState('ALL');
  
  // Dummy data for 12+ servers
  const hostServers = {
    'server-01.example.com': {
      host: 'server-01.example.com',
      username: 'admin',
      agentName: 'SSH-Agent-001',
      machineName: 'WORKSTATION-DEV',
      port: 22,
      status: 'Connected',
      connectedSince: '2025-07-29 10:30:45',
      lastActivity: '2025-07-30 09:15:23'
    },
    'server-02.production.com': {
      host: 'server-02.production.com',
      username: 'prod-user',
      agentName: 'SSH-Agent-002',
      machineName: 'PROD-SERVER-01',
      port: 22,
      status: 'Connected',
      connectedSince: '2025-07-30 08:45:12',
      lastActivity: '2025-07-30 09:20:45'
    },
    'server-03.staging.com': {
      host: 'server-03.staging.com',
      username: 'staging-admin',
      agentName: 'SSH-Agent-003',
      machineName: 'STAGING-WEB-01',
      port: 2222,
      status: 'Disconnected',
      connectedSince: '2025-07-29 16:20:30',
      lastActivity: '2025-07-30 07:55:18'
    },
    'server-04.database.com': {
      host: 'server-04.database.com',
      username: 'dbadmin',
      agentName: 'SSH-Agent-004',
      machineName: 'DB-PRIMARY-01',
      port: 22,
      status: 'Connected',
      connectedSince: '2025-07-30 06:00:00',
      lastActivity: '2025-07-30 09:10:33'
    },
    'server-05.api.com': {
      host: 'server-05.api.com',
      username: 'api-service',
      agentName: 'SSH-Agent-005',
      machineName: 'API-GATEWAY-01',
      port: 22,
      status: 'Refreshed',
      connectedSince: '2025-07-30 07:30:15',
      lastActivity: '2025-07-30 09:18:42'
    },
    'server-06.monitoring.com': {
      host: 'server-06.monitoring.com',
      username: 'monitor',
      agentName: 'SSH-Agent-006',
      machineName: 'MONITOR-HUB-01',
      port: 2200,
      status: 'Connected',
      connectedSince: '2025-07-29 22:15:45',
      lastActivity: '2025-07-30 09:12:15'
    },
    'server-07.backup.com': {
      host: 'server-07.backup.com',
      username: 'backup-admin',
      agentName: 'SSH-Agent-007',
      machineName: 'BACKUP-STORAGE-01',
      port: 22,
      status: 'Connected',
      connectedSince: '2025-07-30 05:45:30',
      lastActivity: '2025-07-30 08:45:22'
    },
    'server-08.analytics.com': {
      host: 'server-08.analytics.com',
      username: 'analytics-user',
      agentName: 'SSH-Agent-008',
      machineName: 'ANALYTICS-PROC-01',
      port: 22,
      status: 'Disconnected',
      connectedSince: '2025-07-29 14:20:10',
      lastActivity: '2025-07-30 06:30:45'
    },
    'server-09.cache.com': {
      host: 'server-09.cache.com',
      username: 'cache-admin',
      agentName: 'SSH-Agent-009',
      machineName: 'REDIS-CLUSTER-01',
      port: 22,
      status: 'Connected',
      connectedSince: '2025-07-30 08:00:20',
      lastActivity: '2025-07-30 09:22:10'
    },
    'server-10.loadbalancer.com': {
      host: 'server-10.loadbalancer.com',
      username: 'lb-operator',
      agentName: 'SSH-Agent-010',
      machineName: 'LOAD-BALANCER-01',
      port: 2222,
      status: 'Connected',
      connectedSince: '2025-07-30 07:15:40',
      lastActivity: '2025-07-30 09:19:55'
    },
    'server-11.security.com': {
      host: 'server-11.security.com',
      username: 'security-admin',
      agentName: 'SSH-Agent-011',
      machineName: 'FIREWALL-MGMT-01',
      port: 22,
      status: 'Connected',
      connectedSince: '2025-07-29 20:30:25',
      lastActivity: '2025-07-30 09:05:30'
    },
    'server-12.logging.com': {
      host: 'server-12.logging.com',
      username: 'log-collector',
      agentName: 'SSH-Agent-012',
      machineName: 'LOG-AGGREGATOR-01',
      port: 22,
      status: 'Refreshed',
      connectedSince: '2025-07-30 06:45:15',
      lastActivity: '2025-07-30 09:17:28'
    },
    'server-13.ci-cd.com': {
      host: 'server-13.ci-cd.com',
      username: 'devops',
      agentName: 'SSH-Agent-013',
      machineName: 'CI-CD-PIPELINE-01',
      port: 22,
      status: 'Connected',
      connectedSince: '2025-07-30 08:20:50',
      lastActivity: '2025-07-30 09:21:40'
    },
    'server-14.testing.com': {
      host: 'server-14.testing.com',
      username: 'test-runner',
      agentName: 'SSH-Agent-014',
      machineName: 'TEST-AUTOMATION-01',
      port: 2200,
      status: 'Disconnected',
      connectedSince: '2025-07-29 18:45:35',
      lastActivity: '2025-07-30 07:20:15'
    }
  };
  
  const [sessionData, setSessionData] = useState(hostServers['server-01.example.com']);

  // Get filtered host data based on selection
  const getFilteredHosts = () => {
    if (selectedHost === 'ALL_HOSTS') {
      return hostServers;
    } else {
      return { [selectedHost]: hostServers[selectedHost] };
    }
  };

  // Get current session data based on selection
  const getCurrentSessionData = () => {
    if (selectedHost === 'ALL_HOSTS') {
      return {
        host: 'Multiple Hosts',
        username: 'Multiple Users',
        agentName: 'Multiple Agents',
        machineName: 'Multiple Machines',
        port: 'Various',
        status: 'Mixed',
        connectedSince: 'Various',
        lastActivity: 'Various'
      };
    } else {
      return hostServers[selectedHost];
    }
  };

  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
    // Auto-clear message after 8 seconds for longer messages
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 8000);
  };

  const handleHostChange = (newHost) => {
    setSelectedHost(newHost);
    if (newHost !== 'ALL_HOSTS') {
      setSessionData(hostServers[newHost]);
      showMessage(`Selected server: ${newHost}`, 'info');
    } else {
      setSessionData(getCurrentSessionData());
      showMessage(`Selected: All Hosts (${Object.keys(hostServers).length} servers)`, 'info');
    }
  };

  const startSession = async () => {
    if (selectedHost === 'ALL_HOSTS') {
      showMessage('Please select a specific host to start a session', 'warning');
      return;
    }
    
    try {
      const currentData = getCurrentSessionData();
      setSessionData(prev => ({
        ...prev,
        status: 'Connected',
        connectedSince: new Date().toLocaleString(),
        lastActivity: new Date().toLocaleString()
      }));
      
      const result = await broadcastToChannel('HOST', 'START_SESSION', {
        host: currentData.host,
        username: currentData.username,
        agentName: currentData.agentName,
        machineName: currentData.machineName,
        startedAt: new Date().toISOString()
      });
      
      showMessage(`✅ Session Started!\nHost: ${currentData.host}\nUser: ${currentData.username}\nBroadcasted to ${result.subscribersNotified} subscribers`, 'success');
    } catch (error) {
      showMessage('Error: Failed to start session', 'error');
    }
  };

    const stopSession = async () => {
    if (selectedHost === 'ALL_HOSTS') {
      showMessage('Please select a specific host to stop a session', 'warning');
      return;
    }
    
    try {
      const currentData = getCurrentSessionData();
      setSessionData(prev => ({
        ...prev,
        status: 'Disconnected',
        lastActivity: new Date().toLocaleString()
      }));
      
      const result = await broadcastToChannel('HOST', 'STOP_SESSION', {
        host: currentData.host,
        username: currentData.username,
        agentName: currentData.agentName,
        machineName: currentData.machineName,
        stoppedAt: new Date().toISOString()
      });
      
      showMessage(`🛑 Session Stopped!
Host: ${currentData.host}
User: ${currentData.username}
Broadcasted to ${result.subscribersNotified} subscribers`, 'warning');
    } catch (error) {
      showMessage('Error: Failed to stop session', 'error');
    }
  };

    const refreshSession = async () => {
    if (selectedHost === 'ALL_HOSTS') {
      setMessage('🔄 Refreshing data for all hosts...');
      setMessageType('info');
      // Simulate refreshing all hosts data
      setTimeout(() => {
        showMessage('✅ All hosts data refreshed successfully!', 'success');
      }, 1000);
      return;
    }
    
    try {
      const currentData = getCurrentSessionData();
      setMessage('🔄 Refreshing...');
      setMessageType('info');
      
      // Simulate API call
      setTimeout(() => {
        setSessionData(prev => ({
          ...prev,
          lastActivity: new Date().toLocaleString()
        }));
        showMessage(`✅ Data Refreshed!
Host: ${currentData.host}
Last Updated: ${new Date().toLocaleString()}`, 'success');
      }, 1000);
    } catch (error) {
      showMessage('Error: Failed to refresh data', 'error');
    }
  };

    const killSession = async () => {
    if (selectedHost === 'ALL_HOSTS') {
      showMessage('Please select a specific host to kill a session', 'warning');
      return;
    }
    
    try {
      const currentData = getCurrentSessionData();
      setSessionData(prev => ({
        ...prev,
        status: 'Terminated',
        lastActivity: new Date().toLocaleString()
      }));
      
      const result = await broadcastToChannel('HOST', 'KILL_SESSION', {
        host: currentData.host,
        username: currentData.username,
        agentName: currentData.agentName,
        machineName: currentData.machineName,
        terminatedAt: new Date().toISOString(),
        reason: 'Manual termination'
      });
      
      showMessage(`💀 Session Killed!
Host: ${currentData.host}
User: ${currentData.username}
Broadcasted to ${result.subscribersNotified} subscribers`, 'error');
    } catch (error) {
      showMessage('Error: Failed to kill session', 'error');
    }
  };

  const showSessionDetails = async () => {
    try {
      const result = await broadcastToChannel('HOST', 'SHOW_SESSION', {
        sessionData: sessionData,
        requestedBy: sessionData.username,
        host: sessionData.host
      });
      
      showMessage(
        `📋 Session Details for ${sessionData.host}:\n` +
        `User: ${sessionData.username}\n` +
        `Agent: ${sessionData.agentName}\n` +
        `Machine: ${sessionData.machineName}\n` +
        `Status: ${sessionData.status}\n` +
        `Port: ${sessionData.port}\n` +
        `Connected Since: ${sessionData.connectedSince}\n` +
        `Last Activity: ${sessionData.lastActivity}\n` +
        `Broadcasted to ${result.subscribersNotified} subscribers`,
        'info'
      );
    } catch (error) {
      showMessage('Error: Failed to show session details', 'error');
    }
  };

  const handleFieldEdit = (field, value) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: value
    }));
    setSessionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSessionSelect = (sessionId, isSelected) => {
    setSelectedSessions(prev => ({
      ...prev,
      [sessionId]: isSelected
    }));
  };

  const handleSelectAll = (isSelected) => {
    const allSessions = {};
    Object.keys(hostServers).forEach(host => {
      allSessions[host] = isSelected;
    });
    setSelectedSessions(allSessions);
  };

  // AWS AppSync Integration Functions
  const broadcastToChannel = async (channel, command, data) => {
    try {
      showMessage(`Fetching data from aws api gateway...`, 'loading');
      
      // Simulate AWS AppSync GraphQL mutation
      // const mutation = {
      //   operationName: 'BroadcastSSHCommand',
      //   query: `
      //     mutation BroadcastSSHCommand($input: SSHCommandInput!) {
      //       broadcastSSHCommand(input: $input) {
      //         id
      //         channel
      //         command
      //         timestamp
      //         subscribers
      //       }
      //     }
      //   `,
      //   variables: {
      //     input: {
      //       channel: channel,
      //       command: command,
      //       data: data,
      //       timestamp: new Date().toISOString(),
      //       source: {
      //         host: sessionData.host,
      //         username: sessionData.username,
      //         agentName: sessionData.agentName,
      //         machineName: sessionData.machineName
      //       }
      //     }
      //   }
      // };

      // Simulate API call to AWS AppSync
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        subscribersNotified: Math.floor(Math.random() * 10) + 1,
        messageId: `msg_${Date.now()}`
      };
    } catch (error) {
      throw new Error('Failed to broadcast message via AppSync');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-brand">
          <img src={easyjetLogo} className="App-logo" alt="EasyJet SSH Operations" />
          <div className="header-text">
            <h1>SSH Operations Dashboard</h1>
            <p>Real-time session management with AWS AppSync integration</p>
          </div>
        </div>

        {/* Message Display Area */}
        {message && (
          <div className={`message-container ${messageType}`} data-testid="message-container">
            <div className="message-content">
              {message.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>
        )}

        {/* Compact Navigation Tabs */}
        <div className="compact-navigation">
          <div className="nav-tabs-container">
            <button 
              className={`compact-nav-tab ${activeTab === 'sessions' ? 'active' : ''}`}
              onClick={() => setActiveTab('sessions')}
              title="SSH Session Management"
            >
              <span className="tab-icon" title="SSH Sessions">🖥️</span>
              <span className="tab-text">Sessions</span>
            </button>
            <button 
              className={`compact-nav-tab ${activeTab === 'messaging' ? 'active' : ''}`}
              onClick={() => setActiveTab('messaging')}
              title="Message Broadcasting Dashboard"
            >
              <span className="tab-icon" title="Broadcasting">📡</span>
              <span className="tab-text">Broadcasting</span>
            </button>
          </div>
        </div>

        {/* Session Management Tab */}
        {activeTab === 'sessions' && (
          <div className="tab-content compact-sessions-tab">
            {/* Compact Control Bar */}
            <div className="compact-session-controls">
              {/* Host Selection */}
              <div className="compact-host-selector">
                <label className="compact-control-label">Host:</label>
                <select 
                  className="compact-dropdown"
                  value={selectedHost}
                  onChange={(e) => handleHostChange(e.target.value)}
                >
                  <option value="ALL_HOSTS" title="Manage all connected hosts simultaneously">🌐 All ({Object.keys(hostServers).length})</option>
                  {Object.keys(hostServers).map(host => (
                    <option key={host} value={host}>{host}</option>
                  ))}
                </select>
              </div>

              {/* Quick Actions */}
              {selectedHost && selectedHost !== 'ALL_HOSTS' && (
                <div className="compact-quick-actions">
                  <button className="compact-action-btn start" onClick={startSession} disabled={sessionData.status === 'Connected'} title="Start SSH Session">▶️</button>
                  <button className="compact-action-btn stop" onClick={stopSession} disabled={sessionData.status === 'Disconnected'} title="Stop SSH Session">⏹️</button>
                  <button className="compact-action-btn refresh" onClick={refreshSession} title="Refresh Session Status">🔄</button>
                  <button className="compact-action-btn kill" onClick={killSession} disabled={sessionData.status === 'Disconnected'} title="Force Kill Session">💀</button>
                  <button className="compact-action-btn details" onClick={showSessionDetails} title="Show Session Details">📊</button>
                </div>
              )}

              {/* Global Actions */}
              {selectedHost === 'ALL_HOSTS' && (
                <div className="compact-global-actions">
                  <button className="compact-action-btn refresh" onClick={refreshSession} title="Refresh all host statuses">🔄 Refresh All</button>
                </div>
              )}

              {/* Selection Info */}
              <div className="compact-selection-info">
                <span className="selected-count">{Object.values(selectedSessions).filter(Boolean).length} selected</span>
                <label className="select-all-compact">
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={Object.values(selectedSessions).every(Boolean) && Object.keys(selectedSessions).length > 0}
                  />
                  All
                </label>
              </div>
            </div>

            {/* Compact Session Grid */}
            <div className="compact-session-grid">
              <div className="compact-grid-header">
                <span className="grid-title">
                  {selectedHost === 'ALL_HOSTS' ? 'All Sessions' : `${getCurrentSessionData().host} Session`}
                </span>
                <div className="compact-bulk-actions">
                  <button 
                    className="compact-bulk-btn connect"
                    onClick={() => {
                      const selectedHosts = Object.entries(selectedSessions).filter(([_, selected]) => selected).map(([host, _]) => host);
                      showMessage(`Connect to ${selectedHosts.length} servers`, 'info');
                    }}
                    disabled={Object.values(selectedSessions).filter(Boolean).length === 0}
                    title="Connect to selected servers"
                  >
                    Connect ({Object.values(selectedSessions).filter(Boolean).length})
                  </button>
                  <button 
                    className="compact-bulk-btn disconnect"
                    onClick={() => {
                      const selectedHosts = Object.entries(selectedSessions).filter(([_, selected]) => selected).map(([host, _]) => host);
                      showMessage(`Disconnect ${selectedHosts.length} servers`, 'warning');
                    }}
                    disabled={Object.values(selectedSessions).filter(Boolean).length === 0}
                    title="Disconnect selected servers"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
              
              <div className="compact-grid-wrapper">
                <table className="compact-session-table">
                  <thead>
                    <tr>
                      <th className="compact-checkbox" title="Select/Deselect all sessions">☑</th>
                      <th>Host</th>
                      <th>User</th>
                      <th>Agent</th>
                      <th>Machine</th>
                      <th>Port</th>
                      <th>Status</th>
                      <th>Connected</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(getFilteredHosts()).map(([hostKey, server]) => (
                      <tr key={hostKey} className={`compact-session-row ${selectedHost === hostKey ? 'active' : ''} ${selectedSessions[hostKey] ? 'selected' : ''}`}>
                        <td className="compact-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedSessions[hostKey] || false}
                            onChange={(e) => handleSessionSelect(hostKey, e.target.checked)}
                          />
                        </td>
                        <td className="compact-host-cell">
                          <span 
                            className={`compact-host-name ${selectedHost === hostKey ? 'current' : ''}`}
                            onClick={() => handleHostChange(hostKey)}
                          >
                            {server.host}
                          </span>
                        </td>
                        <td className="compact-editable">
                          <input
                            type="text"
                            value={selectedHost === hostKey ? getCurrentSessionData().username : server.username}
                            onChange={(e) => selectedHost === hostKey && handleFieldEdit('username', e.target.value)}
                            disabled={selectedHost !== hostKey}
                            className="compact-input"
                          />
                        </td>
                        <td className="compact-editable">
                          <input
                            type="text"
                            value={selectedHost === hostKey ? getCurrentSessionData().agentName : server.agentName}
                            onChange={(e) => selectedHost === hostKey && handleFieldEdit('agentName', e.target.value)}
                            disabled={selectedHost !== hostKey}
                            className="compact-input"
                          />
                        </td>
                        <td className="compact-editable">
                          <input
                            type="text"
                            value={selectedHost === hostKey ? getCurrentSessionData().machineName : server.machineName}
                            onChange={(e) => selectedHost === hostKey && handleFieldEdit('machineName', e.target.value)}
                            disabled={selectedHost !== hostKey}
                            className="compact-input"
                          />
                        </td>
                        <td className="compact-editable">
                          <input
                            type="number"
                            value={selectedHost === hostKey ? getCurrentSessionData().port : server.port}
                            onChange={(e) => selectedHost === hostKey && handleFieldEdit('port', parseInt(e.target.value))}
                            disabled={selectedHost !== hostKey}
                            className="compact-input compact-port"
                            min="1"
                            max="65535"
                          />
                        </td>
                        <td className="compact-status">
                          <select
                            value={selectedHost === hostKey ? getCurrentSessionData().status : server.status}
                            onChange={(e) => selectedHost === hostKey && handleFieldEdit('status', e.target.value)}
                            disabled={selectedHost !== hostKey}
                            className={`compact-status-select status-${(selectedHost === hostKey ? getCurrentSessionData().status : server.status).toLowerCase()}`}
                          >
                            <option value="Connected">Connected</option>
                            <option value="Disconnected">Disconnected</option>
                            <option value="Refreshed">Refreshed</option>
                            <option value="Connecting">Connecting</option>
                            <option value="Error">Error</option>
                          </select>
                        </td>
                        <td className="compact-time">
                          <span title={selectedHost === hostKey ? getCurrentSessionData().connectedSince : server.connectedSince}>
                            {(selectedHost === hostKey ? getCurrentSessionData().connectedSince : server.connectedSince).split(' ')[1]}
                          </span>
                        </td>
                        <td className="compact-actions">
                          <button 
                            className="compact-row-btn select"
                            onClick={() => handleHostChange(hostKey)}
                            disabled={selectedHost === hostKey}
                            title="Select this host session"
                          >
                            Select
                          </button>
                          <button 
                            className="compact-row-btn disconnect"
                            onClick={() => {
                              if (selectedHost === hostKey) {
                                handleFieldEdit('status', 'Disconnected');
                                handleFieldEdit('lastActivity', new Date().toLocaleString());
                              }
                              showMessage(`Disconnected ${server.host}`, 'warning');
                            }}
                            title="Disconnect this session"
                          >
                            Disc
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Compact Stats Footer */}
              <div className="compact-grid-footer">
                {selectedHost === 'ALL_HOSTS' ? (
                  <span className="compact-stats">
                    Total: {Object.keys(hostServers).length} | 
                    Connected: {Object.values(hostServers).filter(s => s.status === 'Connected').length} | 
                    Disconnected: {Object.values(hostServers).filter(s => s.status === 'Disconnected').length}
                  </span>
                ) : (
                  <span className="compact-stats">
                    {getCurrentSessionData().host} | {getCurrentSessionData().status} | {getCurrentSessionData().username}@{getCurrentSessionData().machineName}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Message Broadcasting Tab */}
        {activeTab === 'messaging' && (
          <div className="tab-content messaging-tab">
            <div className="compact-messaging-header">
              <h3 title="Real-time message broadcasting to SSH hosts">📡 Message Broadcasting</h3>
            </div>

            {/* Compact Broadcasting Interface */}
            <div className="compact-broadcasting-interface">
              {/* Top Row: Host Selection + Channel Selection */}
              <div className="broadcasting-controls-row">
                <div className="host-selection-compact">
                  <label className="compact-label">Target Host:</label>
                  <select 
                    className="compact-dropdown"
                    value={messagingHost}
                    onChange={(e) => setMessagingHost(e.target.value)}
                  >
                    <option value="ALL_HOSTS" title="Broadcast to all connected hosts">🌐 All Hosts</option>
                    {Object.keys(hostServers).map(host => (
                      <option key={host} value={host}>
                        {host}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="channel-selection-compact">
                  <label className="compact-label">Channel:</label>
                  <div className="channel-buttons-compact">
                    {['ALL', 'HOST', 'USER', 'MACHINE', 'AGENT'].map(channel => (
                      <button
                        key={channel}
                        className={`channel-btn-small ${selectedChannel === channel ? 'active' : ''}`}
                        onClick={() => setSelectedChannel(channel)}
                        title={`Broadcast to ${channel.toLowerCase()} channel${channel === 'ALL' ? 's' : ''}`}
                      >
                        {channel}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message Input Row */}
              <div className="message-input-row">
                <div className="target-info-compact">
                  <span title="Message broadcasting target">🎯</span> {messagingHost === 'ALL_HOSTS' ? 
                    `All ${Object.keys(hostServers).length} hosts` : 
                    `${hostServers[messagingHost]?.host}`
                  } → {selectedChannel === 'ALL' ? 'All channels' : selectedChannel}
                </div>
                
                <div className="message-input-compact">
                  <textarea
                    className="message-textarea-compact"
                    value={customBroadcastMessage}
                    onChange={(e) => setCustomBroadcastMessage(e.target.value)}
                    placeholder="Enter your message..."
                    rows="2"
                  />
                  <button
                    className="send-btn-compact"
                    onClick={async () => {
                      if (!customBroadcastMessage.trim()) {
                        showMessage('Please enter a message to broadcast', 'warning');
                        return;
                      }
                      
                      try {
                        let results = [];
                        let targetDescription = '';
                        
                        if (messagingHost === 'ALL_HOSTS') {
                          if (selectedChannel === 'ALL') {
                            const channels = ['HOST', 'USER', 'AGENT', 'MACHINE'];
                            results = await Promise.all(
                              channels.map(channel => 
                                broadcastToChannel(channel, 'ALL_HOSTS_ALL_CHANNELS', {
                                  message: customBroadcastMessage,
                                  broadcastType: 'ALL_HOSTS_ALL_CHANNELS',
                                  channel: channel,
                                  sender: 'SSH Operations Dashboard',
                                  timestamp: new Date().toISOString(),
                                  targetHosts: Object.keys(hostServers)
                                })
                              )
                            );
                            targetDescription = `All ${Object.keys(hostServers).length} hosts → All channels`;
                          } else {
                            const result = await broadcastToChannel(selectedChannel, 'ALL_HOSTS_SPECIFIC_CHANNEL', {
                              message: customBroadcastMessage,
                              broadcastType: 'ALL_HOSTS_SPECIFIC_CHANNEL',
                              channel: selectedChannel,
                              sender: 'SSH Operations Dashboard',
                              timestamp: new Date().toISOString(),
                              targetHosts: Object.keys(hostServers)
                            });
                            results = [result];
                            targetDescription = `All ${Object.keys(hostServers).length} hosts → ${selectedChannel} channel`;
                          }
                        } else {
                          if (selectedChannel === 'ALL') {
                            const channels = ['HOST', 'USER', 'AGENT', 'MACHINE'];
                            results = await Promise.all(
                              channels.map(channel => 
                                broadcastToChannel(channel, 'SPECIFIC_HOST_ALL_CHANNELS', {
                                  message: customBroadcastMessage,
                                  broadcastType: 'SPECIFIC_HOST_ALL_CHANNELS',
                                  channel: channel,
                                  targetHost: hostServers[messagingHost].host,
                                  targetMachine: hostServers[messagingHost].machineName,
                                  targetUser: hostServers[messagingHost].username,
                                  targetAgent: hostServers[messagingHost].agentName,
                                  sender: 'SSH Operations Dashboard',
                                  timestamp: new Date().toISOString()
                                })
                              )
                            );
                            targetDescription = `${hostServers[messagingHost].host} → All channels`;
                          } else {
                            const result = await broadcastToChannel(selectedChannel, 'SPECIFIC_HOST_SPECIFIC_CHANNEL', {
                              message: customBroadcastMessage,
                              broadcastType: 'SPECIFIC_HOST_SPECIFIC_CHANNEL',
                              channel: selectedChannel,
                              targetHost: hostServers[messagingHost].host,
                              targetMachine: hostServers[messagingHost].machineName,
                              targetUser: hostServers[messagingHost].username,
                              targetAgent: hostServers[messagingHost].agentName,
                              sender: 'SSH Operations Dashboard',
                              timestamp: new Date().toISOString()
                            });
                            results = [result];
                            targetDescription = `${hostServers[messagingHost].host} → ${selectedChannel} channel`;
                          }
                        }
                        
                        const totalSubscribers = results.reduce((sum, result) => sum + result.subscribersNotified, 0);
                        
                        showMessage(
                          `✅ Message Sent!\n${customBroadcastMessage}\nTarget: ${targetDescription}\nSubscribers: ${totalSubscribers}`,
                          'success'
                        );
                        setCustomBroadcastMessage('');
                      } catch (error) {
                        showMessage('❌ Error: Failed to broadcast message', 'error');
                      }
                    }}
                    disabled={!customBroadcastMessage.trim()}
                    title="Send message via AWS AppSync GraphQL"
                  >
                    📡 Send
                  </button>
                </div>
              </div>

              {/* Status Row */}
              <div className="status-info-compact">
                <span>AWS AppSync GraphQL • JSON Format • Real-time Delivery</span>
              </div>
            </div>
          </div>
        )}

        {/* Compact SSH Session Details - Bottom of Page */}
        {selectedHost !== 'ALL_HOSTS' && (
          <div className="compact-session-details">
            <h5 className="compact-session-title">🔗 Session: {getCurrentSessionData().username}@{getCurrentSessionData().host}</h5>
            <div className="compact-session-info">
              <span className="compact-item">Agent: {getCurrentSessionData().agentName}</span>
              <span className="compact-item">Machine: {getCurrentSessionData().machineName}</span>
              <span className="compact-item">Port: {getCurrentSessionData().port}</span>
              <span className={`compact-item status-${getCurrentSessionData().status.toLowerCase()}`}>
                Status: {getCurrentSessionData().status}
              </span>
              <span className="compact-item">Since: {getCurrentSessionData().connectedSince}</span>
            </div>
          </div>
        )}

      </header>
    </div>
  );
}

export default App;
