
import { useState } from 'react'
import {
  Box,
  Search,
  Bell,
  Terminal,
  ChevronDown,
  GitBranch,
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Trash2,
} from 'lucide-react'

function Header({ search, onSearchChange }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [terminalInput, setTerminalInput] = useState('')

  const [terminalOutput, setTerminalOutput] = useState([
    'Welcome to DepShield Security Terminal.',
    'Type "help" to see available commands.',
    'System ready.',
  ])

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New vulnerability detected',
      message: 'A new security vulnerability was found in a dependency.',
      time: '5 minutes ago',
      type: 'warning',
      read: false,
    },
    {
      id: 2,
      title: 'Scan completed successfully',
      message: 'The latest repository scan has completed.',
      time: '20 minutes ago',
      type: 'success',
      read: false,
    },
    {
      id: 3,
      title: 'Critical vulnerability requires attention',
      message: 'A critical security issue needs remediation.',
      time: '1 hour ago',
      type: 'critical',
      read: false,
    },
  ])

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    )
  }

  const runCommand = (e) => {
    e.preventDefault()

    const command = terminalInput.trim().toLowerCase()

    if (!command) return

    let response = ''

    switch (command) {
      case 'help':
        response = [
          'Available commands:',
          'help     - Show available commands',
          'status   - Show scanner status',
          'scan     - Simulate a security scan',
          'repo     - Show repository information',
          'clear    - Clear terminal output',
        ].join('\n')
        break

      case 'status':
        response = [
          'DEPShield Scanner Status',
          'Engine: SECURE',
          'Scanner: Ready',
          'Repository: org/payments-core-api',
          'Branch: main',
          'Backend connection: Not connected',
        ].join('\n')
        break

      case 'scan':
        response = [
          'Starting simulated security scan...',
          'Checking dependencies...',
          'Checking vulnerabilities...',
          'Checking licenses...',
          'Demo scan completed successfully.',
          'Note: No real repository scan was performed.',
        ].join('\n')
        break

      case 'repo':
        response = [
          'Repository Information',
          'Name: org/payments-core-api',
          'Branch: main',
          'Environment: Production',
        ].join('\n')
        break

      case 'clear':
        setTerminalOutput([])
        setTerminalInput('')
        return

      default:
        response = `Command not found: ${command}. Type "help" for available commands.`
    }

    setTerminalOutput((previous) => [
      ...previous,
      `depShield@security:~$ ${command}`,
      ...response.split('\n'),
    ])

    setTerminalInput('')
  }

  return (
    <header className="relative z-20 w-full border-b border-[#303640] bg-[#0A0E16] px-5 py-4 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

        {/* Repository */}
        <button className="flex shrink-0 items-center gap-3 rounded-lg border border-[#303640] bg-[#1C2028] px-4 py-3 text-left transition hover:border-cyan-500">
          <Box size={22} className="text-cyan-400" />
          <div>
            <p className="text-sm font-bold text-slate-100">
              org/payments-core-api
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <GitBranch size={12} />
              main
            </p>
          </div>
          <ChevronDown size={16} className="ml-2 text-slate-400" />
        </button>

        {/* Search and user controls */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-3 xl:ml-6">

          {/* Search */}
          <div className="relative min-w-0 flex-1 xl:max-w-[520px]">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search packages, CVEs, dependencies..."
              className="w-full rounded-lg border border-[#303640] bg-[#1C2028] py-3 pl-11 pr-10 text-sm text-slate-200 outline-none placeholder:text-slate-500 transition focus:border-cyan-500"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X size={17} />
              </button>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              title="Notifications"
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowTerminal(false)
              }}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-[#262A33] hover:text-cyan-400"
            >
              <Bell size={21} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-14 z-50 w-[320px] max-w-[90vw] overflow-hidden rounded-xl border border-[#303640] bg-[#1C2028] shadow-2xl sm:w-[380px]">
                <div className="flex items-center justify-between border-b border-[#303640] p-4">
                  <div>
                    <h3 className="font-bold text-slate-100">Notifications</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {unreadCount} unread notifications
                    </p>
                  </div>
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`flex w-full gap-3 border-b border-[#303640] p-4 text-left transition hover:bg-[#262A33] ${
                        notification.read ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="mt-1 shrink-0">
                        {notification.type === 'success' ? (
                          <CheckCircle2 size={20} className="text-green-400" />
                        ) : notification.type === 'critical' ? (
                          <ShieldAlert size={20} className="text-red-400" />
                        ) : (
                          <AlertTriangle size={20} className="text-yellow-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-100">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          {notification.message}
                        </p>
                        <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock size={12} />
                          {notification.time}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Terminal button */}
          <button
            title="Terminal"
            onClick={() => {
              setShowTerminal(!showTerminal)
              setShowNotifications(false)
            }}
            className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg transition sm:flex ${
              showTerminal
                ? 'bg-cyan-500/10 text-cyan-400'
                : 'text-slate-300 hover:bg-[#262A33] hover:text-cyan-400'
            }`}
          >
            <Terminal size={22} />
          </button>

          {/* User profile */}
          <button className="flex shrink-0 items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-[#1C2028]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 text-sm font-bold text-cyan-400">
              SO
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-slate-100">sec-ops.lead</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Production Access
              </p>
            </div>
            <ChevronDown size={15} className="hidden text-slate-500 lg:block" />
          </button>
        </div>
      </div>

      {/* Terminal Panel */}
      {showTerminal && (
        <div className="absolute right-5 top-full z-50 mt-2 w-[min(650px,calc(100vw-32px))] overflow-hidden rounded-xl border border-[#303640] bg-[#0A0E16] shadow-2xl lg:right-8">

          <div className="flex items-center justify-between border-b border-[#303640] bg-[#1C2028] px-4 py-3">
            <div className="flex items-center gap-2">
              <Terminal size={17} className="text-cyan-400" />
              <span className="text-sm font-semibold text-slate-200">
                DepShield Security Terminal
              </span>
              <span className="ml-2 h-2 w-2 rounded-full bg-green-400" />
            </div>
            <div className="flex items-center gap-3">
              <button
                title="Clear terminal"
                onClick={() => setTerminalOutput([])}
                className="text-slate-400 hover:text-cyan-400"
              >
                <Trash2 size={16} />
              </button>
              <button
                title="Close terminal"
                onClick={() => setShowTerminal(false)}
                className="text-slate-400 hover:text-red-400"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="h-[280px] overflow-y-auto p-4 font-mono text-xs leading-6">
            {terminalOutput.map((line, index) => (
              <p
                key={index}
                className={
                  line.startsWith('depShield@')
                    ? 'text-cyan-400'
                    : 'whitespace-pre-wrap text-green-300'
                }
              >
                {line}
              </p>
            ))}
          </div>

          <form
            onSubmit={runCommand}
            className="flex items-center gap-2 border-t border-[#303640] p-3"
          >
            <span className="whitespace-nowrap font-mono text-xs text-cyan-400">
              $
            </span>
            <input
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Type a command..."
              className="min-w-0 flex-1 bg-transparent font-mono text-xs text-slate-200 outline-none placeholder:text-slate-600"
            />
            <button
              type="submit"
              title="Run command"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 transition hover:bg-cyan-400"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </header>
  )
}

export default Header
