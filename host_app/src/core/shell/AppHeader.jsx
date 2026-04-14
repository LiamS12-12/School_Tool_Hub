import React, { useState } from 'react';
import { Bell, Search, User, Moon, Sun } from 'lucide-react';

export function AppHeader({
  school,
  currentUser,
  users,
  onSwitchUser,
  isDarkMode,
  onToggleDarkMode,
  theme,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const prettyRole =
    currentUser?.role === 'admin'
      ? 'Admin'
      : currentUser?.role === 'teacher'
        ? 'Teacher'
        : currentUser?.role ?? 'User';

  return (
    <header
      style={{
        background: theme.panelBg,
        borderBottom: `1px solid ${theme.border}`,
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: theme.mutedText,
            }}
          >
            School Tool Hub
          </p>

          <h1
            style={{
              margin: '6px 0 2px 0',
              fontSize: '24px',
              color: theme.text,
            }}
          >
            {school?.name}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: theme.mutedText,
            }}
          >
            Signed in as {currentUser?.name} · {prettyRole}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '999px',
              padding: '10px 14px',
              minWidth: '260px',
            }}
          >
            <Search size={16} color={theme.mutedText} />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search tools, students, or classes..."
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: '14px',
                color: theme.text,
              }}
            />
          </div>

          <button
            type="button"
            onClick={onToggleDarkMode}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '999px',
              border: `1px solid ${theme.border}`,
              background: theme.cardBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun size={18} color={theme.mutedText} />
            ) : (
              <Moon size={18} color={theme.mutedText} />
            )}
          </button>

          <button
            type="button"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '999px',
              border: `1px solid ${theme.border}`,
              background: theme.cardBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Bell size={18} color={theme.mutedText} />
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '14px',
              padding: '8px 10px',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '999px',
                background: theme.accentBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={18} color={theme.text} />
            </div>

            <select
              value={currentUser?.id}
              onChange={(event) => onSwitchUser(event.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '14px',
                fontWeight: 600,
                color: theme.text,
                cursor: 'pointer',
              }}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}