import React, { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';

export function AppHeader({ school, currentUser, users, onSwitchUser }) {
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
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
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
              color: '#64748b',
            }}
          >
            School Tool Hub
          </p>

          <h1
            style={{
              margin: '6px 0 2px 0',
              fontSize: '24px',
              color: '#0f172a',
            }}
          >
            {school?.name}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: '#475569',
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
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '999px',
              padding: '10px 14px',
              minWidth: '260px',
            }}
          >
            <Search size={16} color="#64748b" />
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
                color: '#0f172a',
              }}
            />
          </div>

          <button
            type="button"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '999px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Bell size={18} color="#475569" />
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '8px 10px',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '999px',
                background: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={18} color="#0369a1" />
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
                color: '#0f172a',
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