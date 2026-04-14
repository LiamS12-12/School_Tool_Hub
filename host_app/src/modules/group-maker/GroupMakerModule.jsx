import React, { useEffect, useMemo, useState } from 'react';

const GROUP_SIZES = [2, 3, 4, 5];

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getStudentName(student) {
  return `${student?.firstName ?? ''} ${student?.lastName ?? ''}`.trim() || 'Student';
}

function buildForcedClusters(students, forcedPairs) {
  const adjacency = new Map();
  const validIds = new Set(students.map((student) => student.id));

  students.forEach((student) => {
    adjacency.set(student.id, new Set());
  });

  forcedPairs.forEach((pair) => {
    if (!validIds.has(pair.studentAId) || !validIds.has(pair.studentBId)) return;
    adjacency.get(pair.studentAId).add(pair.studentBId);
    adjacency.get(pair.studentBId).add(pair.studentAId);
  });

  const visited = new Set();
  const clusters = [];

  students.forEach((student) => {
    if (visited.has(student.id)) return;

    const stack = [student.id];
    const clusterIds = [];

    while (stack.length > 0) {
      const current = stack.pop();
      if (visited.has(current)) continue;

      visited.add(current);
      clusterIds.push(current);

      adjacency.get(current)?.forEach((neighborId) => {
        if (!visited.has(neighborId)) {
          stack.push(neighborId);
        }
      });
    }

    const clusterStudents = clusterIds
      .map((id) => students.find((studentEntry) => studentEntry.id === id))
      .filter(Boolean);

    clusters.push(clusterStudents);
  });

  return clusters;
}

function generateGroups(students, targetGroupSize, forcedPairs) {
  if (!students.length) return [];

  const forcedClusters = buildForcedClusters(students, forcedPairs);
  const randomizedClusters = shuffleArray(forcedClusters).sort(
    (a, b) => b.length - a.length
  );

  const groupCount = Math.max(1, Math.ceil(students.length / targetGroupSize));
  const groups = Array.from({ length: groupCount }, () => []);

  randomizedClusters.forEach((cluster) => {
    let bestGroupIndex = -1;
    let smallestSize = Number.POSITIVE_INFINITY;

    groups.forEach((group, index) => {
      const nextSize = group.length + cluster.length;
      if (nextSize <= targetGroupSize && group.length < smallestSize) {
        smallestSize = group.length;
        bestGroupIndex = index;
      }
    });

    if (bestGroupIndex === -1) {
      groups.forEach((group, index) => {
        if (group.length < smallestSize) {
          smallestSize = group.length;
          bestGroupIndex = index;
        }
      });
    }

    groups[bestGroupIndex].push(...cluster);
  });

  return groups.filter((group) => group.length > 0);
}

export function GroupMakerModule({ schoolContext, theme }) {
  const visibleClassrooms = schoolContext?.visibleClassrooms ?? [];
  const visibleStudents = schoolContext?.visibleStudents ?? [];

  const [selectedClassroomId, setSelectedClassroomId] = useState(
    visibleClassrooms[0]?.id ?? ''
  );
  const [targetGroupSize, setTargetGroupSize] = useState(2);
  const [studentAId, setStudentAId] = useState('');
  const [studentBId, setStudentBId] = useState('');
  const [forcedPairs, setForcedPairs] = useState([]);
  const [generatedGroups, setGeneratedGroups] = useState([]);

  useEffect(() => {
    const stillValid = visibleClassrooms.some(
      (classroom) => classroom.id === selectedClassroomId
    );

    if (!stillValid) {
      setSelectedClassroomId(visibleClassrooms[0]?.id ?? '');
      setGeneratedGroups([]);
      setForcedPairs([]);
    }
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

  useEffect(() => {
    setGeneratedGroups([]);
    setForcedPairs([]);
    setStudentAId('');
    setStudentBId('');
  }, [selectedClassroomId]);

  const addForcedPair = () => {
    if (!studentAId || !studentBId || studentAId === studentBId) return;

    const pairKey = [studentAId, studentBId].sort().join('--');
    const alreadyExists = forcedPairs.some(
      (pair) => [pair.studentAId, pair.studentBId].sort().join('--') === pairKey
    );

    if (alreadyExists) return;

    const studentA = studentsForClassroom.find((student) => student.id === studentAId);
    const studentB = studentsForClassroom.find((student) => student.id === studentBId);

    setForcedPairs((prev) => [
      ...prev,
      {
        id: `pair-${Date.now()}`,
        studentAId,
        studentBId,
        label: `${getStudentName(studentA)} + ${getStudentName(studentB)}`,
      },
    ]);

    setStudentAId('');
    setStudentBId('');
  };

  const removeForcedPair = (pairId) => {
    setForcedPairs((prev) => prev.filter((pair) => pair.id !== pairId));
  };

  const handleGenerateGroups = () => {
    const groups = generateGroups(
      studentsForClassroom,
      targetGroupSize,
      forcedPairs
    );
    setGeneratedGroups(groups);
  };

  const panelStyle = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: '24px',
    padding: '24px',
  };

  const softPanelStyle = {
    background: theme.panelBg,
    border: `1px solid ${theme.border}`,
    borderRadius: '18px',
    padding: '16px',
  };

  const buttonStyle = (primary = false) => ({
    padding: '12px 16px',
    borderRadius: '14px',
    border: primary ? '1px solid #0ea5e9' : `1px solid ${theme.border}`,
    background: primary ? '#0ea5e9' : theme.panelBg,
    color: primary ? '#ffffff' : theme.text,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '14px',
  });

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '14px',
    border: `1px solid ${theme.border}`,
    background: theme.panelBg,
    color: theme.text,
    boxSizing: 'border-box',
    outline: 'none',
  };

  return (
    <div style={{ display: 'grid', gap: '24px', padding: '8px' }}>
      <div style={panelStyle}>
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
          Module
        </p>
        <h1
          style={{
            margin: '8px 0 10px 0',
            fontSize: '32px',
            color: theme.text,
          }}
        >
          Group Maker
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '15px',
            color: theme.mutedText,
            maxWidth: '820px',
          }}
        >
          Build random student groups from the shared classroom roster. Teachers
          only see their own visible classes and students, while admin can use the
          same tool with the broader host app view.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '16px',
        }}
      >
        <div style={panelStyle}>
          <p style={{ margin: 0, fontSize: '12px', color: theme.mutedText }}>
            Selected class
          </p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', color: theme.text }}>
            {selectedClassroom?.name ?? 'No class selected'}
          </h2>
        </div>

        <div style={panelStyle}>
          <p style={{ margin: 0, fontSize: '12px', color: theme.mutedText }}>
            Students available
          </p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: theme.text }}>
            {studentsForClassroom.length}
          </h2>
        </div>

        <div style={panelStyle}>
          <p style={{ margin: 0, fontSize: '12px', color: theme.mutedText }}>
            Forced together rules
          </p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: theme.text }}>
            {forcedPairs.length}
          </h2>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '360px minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={panelStyle}>
            <h2 style={{ margin: 0, fontSize: '20px', color: theme.text }}>
              Group settings
            </h2>

            <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
              <div>
                <label
                  htmlFor="group-classroom-select"
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
                  id="group-classroom-select"
                  value={selectedClassroomId}
                  onChange={(event) => setSelectedClassroomId(event.target.value)}
                  style={inputStyle}
                >
                  {visibleClassrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="group-size-select"
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: theme.text,
                  }}
                >
                  Group size
                </label>
                <select
                  id="group-size-select"
                  value={targetGroupSize}
                  onChange={(event) => setTargetGroupSize(Number(event.target.value))}
                  style={inputStyle}
                >
                  {GROUP_SIZES.map((size) => (
                    <option key={size} value={size}>
                      Groups of {size}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleGenerateGroups}
                style={buttonStyle(true)}
              >
                Generate random groups
              </button>
            </div>
          </div>

          <div style={panelStyle}>
            <h2 style={{ margin: 0, fontSize: '20px', color: theme.text }}>
              Keep students together
            </h2>
            <p
              style={{
                margin: '8px 0 16px 0',
                fontSize: '14px',
                color: theme.mutedText,
              }}
            >
              Add rules for students who should land in the same group.
            </p>

            <div style={{ display: 'grid', gap: '12px' }}>
              <select
                value={studentAId}
                onChange={(event) => setStudentAId(event.target.value)}
                style={inputStyle}
              >
                <option value="">Choose first student</option>
                {studentsForClassroom.map((student) => (
                  <option key={student.id} value={student.id}>
                    {getStudentName(student)}
                  </option>
                ))}
              </select>

              <select
                value={studentBId}
                onChange={(event) => setStudentBId(event.target.value)}
                style={inputStyle}
              >
                <option value="">Choose second student</option>
                {studentsForClassroom.map((student) => (
                  <option key={student.id} value={student.id}>
                    {getStudentName(student)}
                  </option>
                ))}
              </select>

              <button type="button" onClick={addForcedPair} style={buttonStyle(false)}>
                Add together rule
              </button>
            </div>

            <div style={{ marginTop: '18px', display: 'grid', gap: '10px' }}>
              {forcedPairs.map((pair) => (
                <div key={pair.id} style={softPanelStyle}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '12px',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ color: theme.text, fontWeight: 700 }}>
                      {pair.label}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeForcedPair(pair.id)}
                      style={buttonStyle(false)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {forcedPairs.length === 0 && (
                <div style={softPanelStyle}>
                  <span style={{ color: theme.mutedText }}>
                    No together-rules added yet.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={panelStyle}>
          <h2 style={{ margin: 0, fontSize: '20px', color: theme.text }}>
            Generated groups
          </h2>
          <p
            style={{
              margin: '8px 0 18px 0',
              fontSize: '14px',
              color: theme.mutedText,
            }}
          >
            Groups are random, while still keeping forced student pairings
            together when possible.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '16px',
            }}
          >
            {generatedGroups.map((group, index) => (
              <div key={`group-${index + 1}`} style={softPanelStyle}>
                <div
                  style={{
                    fontWeight: 800,
                    color: theme.text,
                    marginBottom: '12px',
                    fontSize: '18px',
                  }}
                >
                  Group {index + 1}
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                  {group.map((student) => (
                    <div
                      key={student.id}
                      style={{
                        background: theme.cardBg,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '14px',
                        padding: '12px 14px',
                        color: theme.text,
                        fontWeight: 600,
                      }}
                    >
                      {getStudentName(student)}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {generatedGroups.length === 0 && (
              <div style={softPanelStyle}>
                <span style={{ color: theme.mutedText }}>
                  No groups generated yet. Choose a class, set a group size, and
                  click “Generate random groups.”
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}