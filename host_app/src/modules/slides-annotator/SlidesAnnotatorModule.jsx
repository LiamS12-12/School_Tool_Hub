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

export function SlidesAnnotatorModule({ schoolContext, isDarkMode, theme }) {
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

  const heroBackground = isDarkMode
    ? 'linear-gradient(135deg, #3f1d0f 0%, #3b1020 100%)'
    : 'linear-gradient(135deg, #fff7ed 0%, #fff1f2 100%)';

  const heroBorder = isDarkMode ? '#7c2d12' : '#fed7aa';
  const heroLabel = isDarkMode ? '#fdba74' : '#9a3412';
  const heroHeading = isDarkMode ? '#fff7ed' : '#431407';
  const heroText = isDarkMode ? '#fed7aa' : '#7c2d12';

  const slideCanvasBg = isDarkMode ? '#0b1220' : '#ffffff';
  const lessonSurface = isDarkMode ? '#111827' : '#ffffff';
  const lessonMutedSurface = isDarkMode ? '#1f2937' : '#f8fafc';
  const lessonText = isDarkMode ? '#f8fafc' : '#0f172a';
  const lessonMutedText = isDarkMode ? '#cbd5e1' : '#475569';

  return (
    <div style={{ padding: '8px' }}>
      <div
        style={{
          background: heroBackground,
          border: `1px solid ${heroBorder}`,
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
            color: heroLabel,
          }}
        >
          Module Demo
        </p>

        <h1
          style={{
            margin: '8px 0 10px 0',
            fontSize: '32px',
            color: heroHeading,
          }}
        >
          Slides Annotator
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: '15px',
            color: heroText,
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
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '20px',
            padding: '20px',
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', color: theme.mutedText }}>
            Active teacher
          </p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', color: theme.text }}>
            {currentUser?.name ?? 'Unknown'}
          </h2>
        </div>

        <div
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '20px',
            padding: '20px',
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', color: theme.mutedText }}>
            Selected classroom
          </p>
          <h2
            style={{
              margin: '8px 0 0 0',
              fontSize: '22px',
              color: theme.text,
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
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '20px',
            padding: '20px',
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', color: theme.mutedText }}>
            Students in roster
          </p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: theme.text }}>
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
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
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
              <h2 style={{ margin: 0, color: theme.text }}>Presentation setup</h2>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="slides-classroom-select"
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: theme.text,
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
                  border: `1px solid ${theme.border}`,
                  background: theme.panelBg,
                  color: theme.text,
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
                  background: theme.panelBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '16px',
                  padding: '14px 16px',
                }}
              >
                <div style={{ fontWeight: 700, color: theme.text, marginBottom: '4px' }}>
                  Slide deck
                </div>
                <div style={{ fontSize: '13px', color: theme.mutedText }}>
                  Connected to the host demo presentation area
                </div>
              </div>

              <div
                style={{
                  background: theme.panelBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '16px',
                  padding: '14px 16px',
                }}
              >
                <div style={{ fontWeight: 700, color: theme.text, marginBottom: '4px' }}>
                  Shared roster
                </div>
                <div style={{ fontSize: '13px', color: theme.mutedText }}>
                  Using the same class list from the host app home page
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
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
              <h2 style={{ margin: 0, color: theme.text }}>Class roster preview</h2>
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              {studentsForClassroom.slice(0, 6).map((student) => (
                <div
                  key={student.id}
                  style={{
                    background: theme.panelBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '16px',
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: theme.text }}>
                    {student.firstName} {student.lastName}
                  </div>
                  <div style={{ fontSize: '13px', color: theme.mutedText, marginTop: '4px' }}>
                    {selectedClassroom?.name ?? 'Classroom'}
                  </div>
                </div>
              ))}

              {studentsForClassroom.length === 0 && (
                <div
                  style={{
                    background: theme.panelBg,
                    border: `1px dashed ${theme.border}`,
                    borderRadius: '16px',
                    padding: '16px',
                    color: theme.mutedText,
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
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
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
              <h2 style={{ margin: 0, color: theme.text }}>Annotation workspace</h2>
              <p style={{ margin: '6px 0 0 0', color: theme.mutedText, fontSize: '14px' }}>
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
                      border: isActive ? '1px solid #f97316' : `1px solid ${theme.border}`,
                      background: isActive ? '#fff7ed' : theme.panelBg,
                      color: isActive ? '#9a3412' : theme.text,
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
              background: theme.panelBg,
              border: `1px solid ${theme.border}`,
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
                <div style={{ fontWeight: 700, color: theme.text, marginBottom: '4px' }}>
                  Live session
                </div>
                <div style={{ fontSize: '13px', color: theme.mutedText }}>
                  {currentUser?.name} presenting to {selectedClassroom?.name ?? 'class'}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  color: theme.mutedText,
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
              border: `1px solid ${theme.border}`,
              background: slideCanvasBg,
            }}
          >
            <div
              style={{
                height: '52px',
                borderBottom: `1px solid ${theme.border}`,
                background: theme.cardBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 18px',
              }}
            >
              <div style={{ fontWeight: 700, color: theme.text }}>
                Math Lesson Deck
              </div>
              <div style={{ fontSize: '13px', color: theme.mutedText }}>
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
                  background: lessonSurface,
                  border: `1px solid ${theme.border}`,
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
                      color: '#38bdf8',
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
                      color: lessonText,
                      maxWidth: '720px',
                    }}
                  >
                    Compare fractions using visual models and discussion prompts
                  </h3>

                  <p
                    style={{
                      margin: '0 0 26px 0',
                      maxWidth: '700px',
                      color: lessonMutedText,
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
                          background: lessonMutedSurface,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '18px',
                          padding: '20px',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '28px',
                            fontWeight: 800,
                            color: lessonText,
                            marginBottom: '10px',
                          }}
                        >
                          {fraction}
                        </div>
                        <div
                          style={{
                            height: '14px',
                            borderRadius: '999px',
                            background: isDarkMode ? '#334155' : '#e2e8f0',
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
                      color: isDarkMode ? '#fdba74' : '#9a3412',
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
                        background: isDarkMode ? '#082f49' : '#eff6ff',
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
                          color: '#38bdf8',
                          marginBottom: '8px',
                        }}
                      >
                        Student Spotlight
                      </div>

                      <div
                        style={{
                          fontSize: '22px',
                          fontWeight: 800,
                          color: isDarkMode ? '#f8fafc' : '#0f172a',
                          marginBottom: '6px',
                        }}
                      >
                        {spotlightStudent.firstName} {spotlightStudent.lastName}
                      </div>

                      <div
                        style={{
                          fontSize: '13px',
                          color: isDarkMode ? '#cbd5e1' : '#64748b',
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
                        background: isDarkMode ? '#3f1d0f' : '#fff7ed',
                        border: '2px dashed #fb923c',
                        borderRadius: '20px',
                        padding: '18px',
                        color: isDarkMode ? '#fdba74' : '#9a3412',
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