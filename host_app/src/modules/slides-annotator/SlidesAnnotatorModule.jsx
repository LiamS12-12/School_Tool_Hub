export function SlidesAnnotatorModule({ schoolContext }) {
  const classroom = schoolContext?.visibleClassrooms?.[0];
  const students = schoolContext?.visibleStudents ?? [];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '8px' }}>Slides Annotator</h1>
      <p style={{ marginTop: 0, marginBottom: '24px', opacity: 0.8 }}>
        Demo module for presentation overlays and teaching annotations
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        <div
          style={{
            border: '1px solid #2a2a2a',
            borderRadius: '16px',
            padding: '16px',
            background: '#f8fafc',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Shared Class Data</h2>
          <p><strong>Active Class:</strong> {classroom?.name ?? 'No class selected'}</p>
          <p><strong>Student Count:</strong> {students.length}</p>

          <div style={{ marginTop: '16px' }}>
            <strong>Students</strong>
            <ul style={{ paddingLeft: '20px' }}>
              {students.slice(0, 5).map((student) => (
                <li key={student.id}>{student.firstName} {student.lastName}</li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            border: '1px solid #2a2a2a',
            borderRadius: '16px',
            padding: '16px',
            background: '#f8fafc',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Presentation Area</h2>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '16px',
              flexWrap: 'wrap',
            }}
          >
            <button>Move</button>
            <button>Pen</button>
            <button>Highlight</button>
            <button>Eraser</button>
            <button>Text</button>
            <button>Clear</button>
          </div>

          <div
            style={{
              height: '480px',
              borderRadius: '12px',
              border: '1px dashed #444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8fafc',
              textAlign: 'center',
              padding: '24px',
            }}
          >
            <div>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>
                Slide deck / annotation canvas goes here
              </p>
              <p style={{ opacity: 0.7, margin: 0 }}>
                Will add google slide intigration
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}