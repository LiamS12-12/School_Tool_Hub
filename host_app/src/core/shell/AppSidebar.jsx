import React, { useState } from 'react';
import {
  ChevronLeft,
  Home,
  LayoutGrid,
  Clock3,
  Wallet,
  Presentation,
} from 'lucide-react';

function getModuleIcon(moduleId) {
  switch (moduleId) {
    case 'classroom-economy':
      return Wallet;
    case 'classroom-timer':
      return Clock3;
    case 'slides-annotator':
      return Presentation;
    default:
      return LayoutGrid;
  }
}

export function AppSidebar({ modules, activeModuleId, onSelectModule }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: isCollapsed ? '92px' : '280px',
        transition: 'width 0.25s ease',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '16px',
          position: 'sticky',
          top: '96px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            marginBottom: '18px',
            gap: '12px',
          }}
        >
          {!isCollapsed && (
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Navigation
              </p>
              <h2
                style={{
                  margin: '6px 0 0 0',
                  fontSize: '20px',
                  color: '#0f172a',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Teacher Tools
              </h2>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ChevronLeft
              size={18}
              color="#475569"
              style={{
                transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gap: '10px',
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={() => onSelectModule(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              maxWidth: '100%',
              padding: isCollapsed ? '14px 0' : '14px 16px',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              borderRadius: '16px',
              border: activeModuleId === null ? '1px solid #0ea5e9' : '1px solid #e2e8f0',
              background: activeModuleId === null ? '#e0f2fe' : '#ffffff',
              color: '#0f172a',
              cursor: 'pointer',
              fontWeight: 600,
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
            title="Home"
          >
            <Home size={18} style={{ flexShrink: 0 }} />
            {!isCollapsed && (
              <span
                style={{
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                Home
              </span>
            )}
          </button>

          {modules.map((module) => {
            const Icon = getModuleIcon(module.id);
            const isActive = activeModuleId === module.id;

            return (
              <button
                key={module.id}
                type="button"
                onClick={() => onSelectModule(module.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  maxWidth: '100%',
                  padding: isCollapsed ? '14px 0' : '14px 16px',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  borderRadius: '16px',
                  border: isActive ? '1px solid #0ea5e9' : '1px solid #e2e8f0',
                  background: isActive ? '#e0f2fe' : '#ffffff',
                  color: '#0f172a',
                  cursor: 'pointer',
                  textAlign: 'left',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
                title={module.name}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />

                {!isCollapsed && (
                  <div
                    style={{
                      minWidth: 0,
                      maxWidth: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '14px',
                        marginBottom: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {module.name}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {module.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}