import React, { useMemo, useState } from 'react';

export function DashboardHome({ schoolContext, onAddStudent }) {
  const visibleClassrooms = schoolContext?.visibleClassrooms ?? [];
  const visibleStudents = schoolContext?.visibleStudents ?? [];
  const activeClassroom = visibleClassrooms[0] ?? null;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [classroomId, setClassroomId] = useState(activeClassroom?.id ?? '');

  const studentsForSelectedClass = useMemo(() => {
    return visibleStudents.filter((student) => student.classroomId === classroomId);
  }, [visibleStudents, classroomId]);

  const selectedClassroom =
    visibleClassrooms.find((classroom) => classroom.id === classroomId) ??
    activeClassroom;

  const isAdmin = schoolContext?.currentUser?.role === 'admin';

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
    <div style={{ padding: '24px' }}>
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #dbeafe',
          borderRadius: '18px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>
          Teacher Home
        </p>
        <h1 style={{ margin: '8px 0 10px 0', fontSize: '32px', color: '#0f172a' }}>
          {schoolContext?.currentUser?.name}
        </h1>
        <p style={{ margin: 0, color: '#334155' }}>
          {isAdmin
            ? 'Admin view - all classroom data is available across the host app.'
            : selectedClassroom?.name ?? 'No class selected'}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '20px',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#0f172a' }}>Add student</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label
                htmlFor="classroom-select"
                style={{ display: 'block', marginBottom: '6px', color: '#334155' }}
              >
                Class
              </label>
              <select
                id="classroom-select"
                value={classroomId}
                onChange={(event) => setClassroomId(event.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
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
                style={{ display: 'block', marginBottom: '6px', color: '#334155' }}
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
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label
                htmlFor="last-name"
                style={{ display: 'block', marginBottom: '6px', color: '#334155' }}
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
                  padding: '10px 12px',
                  borderRadius: '10px',
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
                borderRadius: '10px',
                padding: '10px 16px',
                cursor: 'pointer',
                fontWeight: 600,
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
            borderRadius: '18px',
            padding: '20px',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#0f172a' }}>
            {selectedClassroom?.name ?? 'Class list'}
          </h2>
          <p style={{ color: '#475569', marginTop: 0 }}>
            Students in this class: {studentsForSelectedClass.length}
          </p>

          <div
            style={{
              display: 'grid',
              gap: '10px',
            }}
          >
            {studentsForSelectedClass.map((student) => (
              <div
                key={student.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 14px',
                }}
              >
                {student.firstName} {student.lastName}
              </div>
            ))}

            {studentsForSelectedClass.length === 0 && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '14px',
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