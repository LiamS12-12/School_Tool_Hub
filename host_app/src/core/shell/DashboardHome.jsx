import React, { useMemo, useState } from 'react';

export function DashboardHome({ schoolContext, onAddStudent, theme }) {
  const visibleClassrooms = schoolContext?.visibleClassrooms ?? [];
  const visibleStudents = schoolContext?.visibleStudents ?? [];
  const currentUser = schoolContext?.currentUser ?? null;
  const isAdmin = currentUser?.role === 'admin';
  const activeClassroom = visibleClassrooms[0] ?? null;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [classroomId, setClassroomId] = useState(activeClassroom?.id ?? '');

  const selectedClassroom =
    visibleClassrooms.find((classroom) => classroom.id === classroomId) ??
    activeClassroom;

  const studentsForSelectedClass = useMemo(() => {
    return visibleStudents.filter((student) => student.classroomId === classroomId);
  }, [visibleStudents, classroomId]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!firstName.trim() || !classroomId) return;

    onAddStudent({
      firstName,
      lastName,
      classroomId,
    });

    setFirstName('');
    setLastName('');
  };

  return (
    <div style={{ padding: '8px' }}>
      <div
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
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
            color: theme.mutedText,
          }}
        >
          Dashboard
        </p>

        <h1
          style={{
            margin: '8px 0 10px 0',
            fontSize: '32px',
            color: theme.text,
          }}
        >
          {currentUser?.name}
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: '15px',
            color: theme.mutedText,
          }}
        >
          {isAdmin
            ? 'Admin view - you can review classroom data across the host app.'
            : selectedClassroom?.name ?? 'No class selected'}
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
            Visible classes
          </p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: theme.text }}>
            {visibleClassrooms.length}
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
            Visible students
          </p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: theme.text }}>
            {visibleStudents.length}
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
            Selected class
          </p>
          <h2
            style={{
              margin: '8px 0 0 0',
              fontSize: '20px',
              color: theme.text,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {selectedClassroom?.name ?? 'None'}
          </h2>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 420px) minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'start',
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
          <h2 style={{ marginTop: 0, marginBottom: '6px', color: theme.text }}>
            Add student
          </h2>
          <p
            style={{
              marginTop: 0,
              marginBottom: '20px',
              color: theme.mutedText,
              fontSize: '14px',
            }}
          >
            Add a student to the shared classroom list for this host app.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label
                htmlFor="classroom-select"
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
                id="classroom-select"
                value={classroomId}
                onChange={(event) => setClassroomId(event.target.value)}
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

            <div style={{ marginBottom: '14px' }}>
              <label
                htmlFor="first-name"
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: theme.text,
                }}
              >
                First name
              </label>
              <input
                id="first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Enter first name"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: `1px solid ${theme.border}`,
                  background: theme.panelBg,
                  color: theme.text,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label
                htmlFor="last-name"
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: theme.text,
                }}
              >
                Last name
              </label>
              <input
                id="last-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Enter last name"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: `1px solid ${theme.border}`,
                  background: theme.panelBg,
                  color: theme.text,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: '#0ea5e9',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                padding: '12px 18px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              Add student
            </button>
          </form>
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
              <h2 style={{ margin: 0, color: theme.text }}>
                {selectedClassroom?.name ?? 'Class list'}
              </h2>
              <p style={{ margin: '6px 0 0 0', color: theme.mutedText, fontSize: '14px' }}>
                Students in this class: {studentsForSelectedClass.length}
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gap: '12px',
            }}
          >
            {studentsForSelectedClass.map((student) => (
              <div
                key={student.id}
                style={{
                  background: theme.panelBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '16px',
                  padding: '14px 16px',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: theme.text,
                    marginBottom: '4px',
                  }}
                >
                  {student.firstName} {student.lastName}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: theme.mutedText,
                  }}
                >
                  {selectedClassroom?.name ?? 'Classroom'}
                </div>
              </div>
            ))}

            {studentsForSelectedClass.length === 0 && (
              <div
                style={{
                  background: theme.panelBg,
                  border: `1px dashed ${theme.border}`,
                  borderRadius: '16px',
                  padding: '18px',
                  color: theme.mutedText,
                }}
              >
                No students added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}