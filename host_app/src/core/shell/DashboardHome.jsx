import React, { useMemo, useState } from 'react';

export function DashboardHome({ schoolContext, onAddStudent }) {
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
          background: 'linear-gradient(135deg, #f8fbff 0%, #eef6ff 100%)',
          border: '1px solid #dbeafe',
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
            color: '#64748b',
          }}
        >
          Dashboard
        </p>

        <h1
          style={{
            margin: '8px 0 10px 0',
            fontSize: '32px',
            color: '#0f172a',
          }}
        >
          {currentUser?.name}
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: '15px',
            color: '#334155',
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
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '20px',
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Visible classes</p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: '#0f172a' }}>
            {visibleClassrooms.length}
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
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Visible students</p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: '#0f172a' }}>
            {visibleStudents.length}
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
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Selected class</p>
          <h2
            style={{
              margin: '8px 0 0 0',
              fontSize: '20px',
              color: '#0f172a',
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
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '24px',
            padding: '24px',
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: '6px', color: '#0f172a' }}>
            Add student
          </h2>
          <p style={{ marginTop: 0, marginBottom: '20px', color: '#64748b', fontSize: '14px' }}>
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
                  color: '#334155',
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

            <div style={{ marginBottom: '14px' }}>
              <label
                htmlFor="first-name"
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#334155',
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
                  border: '1px solid #cbd5e1',
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
                  color: '#334155',
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
                  border: '1px solid #cbd5e1',
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
              <h2 style={{ margin: 0, color: '#0f172a' }}>
                {selectedClassroom?.name ?? 'Class list'}
              </h2>
              <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>
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
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '14px 16px',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '4px',
                  }}
                >
                  {student.firstName} {student.lastName}
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
            ))}

            {studentsForSelectedClass.length === 0 && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '16px',
                  padding: '18px',
                  color: '#64748b',
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