import React, { useEffect, useMemo, useState } from 'react';
import {
  Highlighter,
  PenTool,
  Eraser,
  Type,
  Move,
  MonitorPlay,
  Users,
  Layers3,
} from 'lucide-react';

export function SlidesAnnotatorModule({ schoolContext }) {
  const visibleClassrooms = schoolContext?.visibleClassrooms ?? [];
  const visibleStudents = schoolContext?.visibleStudents ?? [];
  const currentUser = schoolContext?.currentUser ?? null;

  const [selectedTool, setSelectedTool] = useState('pen');
  const [selectedClassroomId, setSelectedClassroomId] = useState(
    visibleClassrooms[0]?.id ?? ''
  );
  const [spotlightStudent, setSpotlightStudent] = useState(null);
  const [spotlightNotice, setSpotlightNotice] = useState('');

  useEffect(() => {
    const stillValid = visibleClassrooms.some(
      (classroom) => classroom.id === selectedClassroomId
    );

    if (!stillValid) {
      setSelectedClassroomId(visibleClassrooms[0]?.id ?? '');
    }

    setSpotlightStudent(null);
    setSpotlightNotice('');
  }, [visibleClassrooms, selectedClassroomId]);

  const selectedClassroom =
    visibleClassrooms.find((classroom) => classroom.id === selectedClassroomId) ??
    visibleClassrooms[0] ??
    null;

  const studentsForClassroom = useMemo(() => {
    return visibleStudents.filter(
      (student) => student.classroomId === selectedClassroom?.id
    );
  }, [visibleStudents, selectedClassroom]);

  const handleSpotlightStudent = () => {
    if (studentsForClassroom.length === 0) {
      setSpotlightStudent(null);
      setSpotlightNotice('No students in this class yet.');
      return;
    }

    if (studentsForClassroom.length === 1) {
      setSpotlightStudent(studentsForClassroom[0]);
      setSpotlightNotice('');
      return;
    }

    const availableStudents = studentsForClassroom.filter(
      (student) => student.id !== spotlightStudent?.id
    );

    const pool = availableStudents.length > 0 ? availableStudents : studentsForClassroom;
    const randomStudent = pool[Math.floor(Math.random() * pool.length)];

    setSpotlightStudent(randomStudent);
    setSpotlightNotice('');
  };

  const tools = [
    { id: 'move', label: 'Move', icon: Move },
    { id: 'spotlight', label: 'Spotlight', icon: Users },
    { id: 'pen', label: 'Pen', icon: PenTool },
    { id: 'highlight', label: 'Highlight', icon: Highlighter },
    { id: 'eraser', label: 'Eraser', icon: Eraser },
    { id: 'text', label: 'Text', icon: Type },
  ];

  return (
    <div style={{ padding: '8px' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #fff1f2 100%)',
          border: '1px solid #fed7aa',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '24px',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#9a3412',
          }}
        >
          Module Demo
        </p>

        <h1
          style={{
            margin: '8px 0 10px 0',
            fontSize: '32px',
            color: '#431407',
          }}
        >
          Slides Annotator
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: '15px',
            color: '#7c2d12',
            maxWidth: '760px',
          }}
        >
          This module shows how a teaching tool can live inside the host app while
          still using shared classroom data like the active teacher, class roster,
          and student count.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '20px',
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            Active teacher
          </p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', color: '#0f172a' }}>
            {currentUser?.name ?? 'Unknown'}
          </h2>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '20px',
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            Selected classroom
          </p>
          <h2
            style={{
              margin: '8px 0 0 0',
              fontSize: '22px',
              color: '#0f172a',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {selectedClassroom?.name ?? 'No class selected'}
          </h2>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '20px',
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            Students in roster
          </p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: '#0f172a' }}>
            {studentsForClassroom.length}
          </h2>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: '24px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '18px',
              }}
            >
              <MonitorPlay size={20} color="#ea580c" />
              <h2 style={{ margin: 0, color: '#0f172a' }}>Presentation setup</h2>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="slides-classroom-select"
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#334155',
                }}
              >
                Class
              </label>
              <select
                id="slides-classroom-select"
                value={selectedClassroomId}
                onChange={(event) => {
                  setSelectedClassroomId(event.target.value);
                  setSpotlightStudent(null);
                  setSpotlightNotice('');
                }}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              >
                {visibleClassrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '10px',
              }}
            >
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '14px 16px',
                }}
              >
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  Slide deck
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Connected to the host demo presentation area
                </div>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '14px 16px',
                }}
              >
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  Shared roster
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Using the same class list from the host app home page
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '18px',
              }}
            >
              <Users size={20} color="#0ea5e9" />
              <h2 style={{ margin: 0, color: '#0f172a' }}>Class roster preview</h2>
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              {studentsForClassroom.slice(0, 6).map((student) => (
                <div
                  key={student.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>
                    {student.firstName} {student.lastName}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                    {selectedClassroom?.name ?? 'Classroom'}
                  </div>
                </div>
              ))}

              {studentsForClassroom.length === 0 && (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '16px',
                    padding: '16px',
                    color: '#64748b',
                  }}
                >
                  No students available for this classroom yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '24px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '18px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2 style={{ margin: 0, color: '#0f172a' }}>Annotation workspace</h2>
              <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                A polished preview of how a teaching presentation tool could live
                inside the host app.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              {tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = selectedTool === tool.id;

                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      setSelectedTool(tool.id);

                      if (tool.id === 'spotlight') {
                        handleSpotlightStudent();
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      borderRadius: '14px',
                      border: isActive ? '1px solid #f97316' : '1px solid #e2e8f0',
                      background: isActive ? '#fff7ed' : '#ffffff',
                      color: '#0f172a',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    <Icon size={16} />
                    <span>{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '18px',
              marginBottom: '18px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  Live session
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {currentUser?.name} presenting to {selectedClassroom?.name ?? 'class'}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  color: '#64748b',
                }}
              >
                <Layers3 size={16} />
                Active tool: {tools.find((tool) => tool.id === selectedTool)?.label}
              </div>
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              minHeight: '560px',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid #cbd5e1',
              background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            }}
          >
            <div
              style={{
                height: '52px',
                borderBottom: '1px solid #e2e8f0',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 18px',
              }}
            >
              <div style={{ fontWeight: 700, color: '#0f172a' }}>
                Math Lesson Deck
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Slide 4 of 18
              </div>
            </div>

            <div
              style={{
                padding: '28px',
                height: 'calc(100% - 52px)',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: '20px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    padding: '36px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#0ea5e9',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: '14px',
                    }}
                  >
                    Lesson Objective
                  </div>

                  <h3
                    style={{
                      margin: '0 0 12px 0',
                      fontSize: '34px',
                      color: '#0f172a',
                      maxWidth: '720px',
                    }}
                  >
                    Compare fractions using visual models and discussion prompts
                  </h3>

                  <p
                    style={{
                      margin: '0 0 26px 0',
                      maxWidth: '700px',
                      color: '#475569',
                      fontSize: '16px',
                      lineHeight: 1.6,
                    }}
                  >
                    Students review fraction bars, explain equivalent fractions, and
                    participate in guided annotation during whole-group instruction.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                      gap: '16px',
                      maxWidth: '760px',
                    }}
                  >
                    {['1/2', '2/4', '4/8'].map((fraction) => (
                      <div
                        key={fraction}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '18px',
                          padding: '20px',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '28px',
                            fontWeight: 800,
                            color: '#0f172a',
                            marginBottom: '10px',
                          }}
                        >
                          {fraction}
                        </div>
                        <div
                          style={{
                            height: '14px',
                            borderRadius: '999px',
                            background: '#e2e8f0',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: '50%',
                              height: '100%',
                              background: '#38bdf8',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      right: '36px',
                      top: '120px',
                      width: '180px',
                      background: 'rgba(249, 115, 22, 0.12)',
                      border: '2px solid #fb923c',
                      borderRadius: '18px',
                      padding: '16px',
                      color: '#9a3412',
                      fontWeight: 700,
                      transform: 'rotate(-3deg)',
                    }}
                  >
                    Demo annotation overlay
                  </div>

                  {spotlightStudent && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '36px',
                        top: '140px',
                        width: '260px',
                        background: '#eff6ff',
                        border: '3px solid #0ea5e9',
                        borderRadius: '20px',
                        padding: '18px',
                        boxShadow: '0 24px 50px rgba(14, 165, 233, 0.28)',
                        zIndex: 5,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: '#0284c7',
                          marginBottom: '8px',
                        }}
                      >
                        Student Spotlight
                      </div>

                      <div
                        style={{
                          fontSize: '22px',
                          fontWeight: 800,
                          color: '#0f172a',
                          marginBottom: '6px',
                        }}
                      >
                        {spotlightStudent.firstName} {spotlightStudent.lastName}
                      </div>

                      <div
                        style={{
                          fontSize: '13px',
                          color: '#64748b',
                        }}
                      >
                        {selectedClassroom?.name ?? 'Classroom'}
                      </div>
                    </div>
                  )}

                  {!spotlightStudent && spotlightNotice && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '36px',
                        top: '140px',
                        width: '260px',
                        background: '#fff7ed',
                        border: '2px dashed #fb923c',
                        borderRadius: '20px',
                        padding: '18px',
                        color: '#9a3412',
                        fontWeight: 700,
                        zIndex: 5,
                      }}
                    >
                      {spotlightNotice}
                    </div>
                  )}

                  <svg
                    viewBox="0 0 500 220"
                    style={{
                      position: 'absolute',
                      left: '120px',
                      bottom: '60px',
                      width: '420px',
                      height: '180px',
                      pointerEvents: 'none',
                    }}
                  >
                    <path
                      d="M20 150 C 100 70, 220 70, 300 115 S 420 155, 480 95"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <circle cx="300" cy="115" r="10" fill="#f97316" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}