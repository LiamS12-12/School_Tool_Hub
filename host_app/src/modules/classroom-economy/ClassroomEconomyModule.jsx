import React, { useEffect, useMemo, useState } from 'react';
import { canManageClassroom } from '../../shared/permissions/schoolPermissions';
import { classroomEconomyData } from './economyData';
import { loadStoredValue, saveStoredValue } from '../../shared/utils/localStorage';

function createInitialModuleState(defaultClassroomId) {
  return {
    selectedClassroomId: defaultClassroomId || null,
    accounts: classroomEconomyData.accounts,
    storeByClassroom: classroomEconomyData.storeItems,
    transactionsByClassroom: classroomEconomyData.transactions,
  };
}

function getStudentName(student) {
  if (student?.displayName) return student.displayName;
  return `${student?.firstName ?? ''} ${student?.lastName ?? ''}`.trim() || 'Student';
}

export function ClassroomEconomyModule({ schoolContext, theme }) {
  const teacherClassrooms = schoolContext.visibleClassrooms;
  const defaultClassroomId =
    schoolContext.teacherProfile.defaultClassroomId ||
    teacherClassrooms[0]?.id ||
    null;

  const classroomEconomyStorageKey = `school-tool-hub:classroom-economy:${schoolContext.currentUser.id}`;

  const [persistedModuleState, setPersistedModuleState] = useState(() =>
    loadStoredValue(
      classroomEconomyStorageKey,
      createInitialModuleState(defaultClassroomId)
    )
  );

  const { selectedClassroomId, accounts, storeByClassroom, transactionsByClassroom } =
    persistedModuleState;

  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardCost, setNewRewardCost] = useState('');

  const updateModuleState = (updates) => {
    setPersistedModuleState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const selectedClassroom = useMemo(
    () =>
      teacherClassrooms.find((classroom) => classroom.id === selectedClassroomId) ||
      teacherClassrooms[0] ||
      null,
    [selectedClassroomId, teacherClassrooms]
  );

  const classroomStudents = useMemo(
    () =>
      schoolContext.visibleStudents.filter(
        (student) => student.classroomId === selectedClassroom?.id
      ),
    [schoolContext.visibleStudents, selectedClassroom]
  );

  const classroomGoal = selectedClassroom
    ? classroomEconomyData.classroomGoals[selectedClassroom.id]
    : null;

  const storeItems = selectedClassroom
    ? storeByClassroom[selectedClassroom.id] || []
    : [];

  const classroomTransactions = selectedClassroom
    ? transactionsByClassroom[selectedClassroom.id] || []
    : [];

  const studentSummaries = classroomStudents.map((student) => {
    const account = accounts[student.id] || {
      balance: 0,
      jobTitle: 'Unassigned',
      weeklySalary: 0,
      savingsGoal: null,
    };

    return {
      ...student,
      ...account,
      studentName: getStudentName(student),
    };
  });

  const totalClassBalance = studentSummaries.reduce(
    (sum, student) => sum + student.balance,
    0
  );

  const totalWeeklyPayroll = studentSummaries.reduce(
    (sum, student) => sum + student.weeklySalary,
    0
  );

  const goalProgress = classroomGoal
    ? Math.min(
        100,
        Math.round((totalClassBalance / classroomGoal.targetAmount) * 100)
      )
    : 0;

  useEffect(() => {
    setPersistedModuleState(
      loadStoredValue(
        classroomEconomyStorageKey,
        createInitialModuleState(defaultClassroomId)
      )
    );
  }, [classroomEconomyStorageKey, defaultClassroomId]);

  useEffect(() => {
    if (!selectedClassroom && teacherClassrooms[0]?.id) {
      updateModuleState({ selectedClassroomId: teacherClassrooms[0].id });
    }
  }, [selectedClassroom, teacherClassrooms]);

  useEffect(() => {
    saveStoredValue(classroomEconomyStorageKey, persistedModuleState);
  }, [classroomEconomyStorageKey, persistedModuleState]);

  const addTransaction = (studentId, amount, reason) => {
    if (!selectedClassroom) return;

    const transaction = {
      id: `tx-${Date.now()}`,
      studentId,
      amount,
      reason,
      timestamp: new Date().toISOString(),
    };

    const currentAccount = accounts[studentId] || {
      balance: 0,
      jobTitle: 'Unassigned',
      weeklySalary: 0,
      savingsGoal: null,
    };

    const nextAccounts = {
      ...accounts,
      [studentId]: {
        ...currentAccount,
        balance: currentAccount.balance + amount,
      },
    };

    const nextTransactionsByClassroom = {
      ...transactionsByClassroom,
      [selectedClassroom.id]: [
        transaction,
        ...(transactionsByClassroom[selectedClassroom.id] || []),
      ],
    };

    updateModuleState({
      accounts: nextAccounts,
      transactionsByClassroom: nextTransactionsByClassroom,
    });
  };

  const runPayday = () => {
    studentSummaries.forEach((student) => {
      if (student.weeklySalary > 0) {
        addTransaction(
          student.id,
          student.weeklySalary,
          `Weekly Salary: ${student.jobTitle}`
        );
      }
    });
  };

  const addRewardItem = () => {
    if (!selectedClassroom || !newRewardName.trim() || !Number(newRewardCost)) {
      return;
    }

    const reward = {
      id: `reward-${Date.now()}`,
      name: newRewardName.trim(),
      cost: Number(newRewardCost),
    };

    updateModuleState({
      storeByClassroom: {
        ...storeByClassroom,
        [selectedClassroom.id]: [
          ...(storeByClassroom[selectedClassroom.id] || []),
          reward,
        ],
      },
    });

    setNewRewardName('');
    setNewRewardCost('');
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
          Classroom Economy
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '15px',
            color: theme.mutedText,
            maxWidth: '760px',
          }}
        >
          A classroom rewards and balances module that keeps its own economy
          workflows while still respecting the host app’s classroom and student
          visibility rules.
        </p>
      </div>

      {teacherClassrooms.length > 1 && (
        <div style={panelStyle}>
          <h2 style={{ margin: 0, fontSize: '20px', color: theme.text }}>
            Choose classroom
          </h2>
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {teacherClassrooms.map((classroom) => {
              const isActive = selectedClassroom?.id === classroom.id;

              return (
                <button
                  key={classroom.id}
                  type="button"
                  onClick={() => updateModuleState({ selectedClassroomId: classroom.id })}
                  style={{
                    ...buttonStyle(isActive),
                    background: isActive ? '#0ea5e9' : theme.panelBg,
                    color: isActive ? '#ffffff' : theme.text,
                  }}
                >
                  {classroom.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '16px',
        }}
      >
        <div style={panelStyle}>
          <p style={{ margin: 0, fontSize: '12px', color: theme.mutedText }}>
            Students
          </p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: theme.text }}>
            {studentSummaries.length}
          </h2>
        </div>

        <div style={panelStyle}>
          <p style={{ margin: 0, fontSize: '12px', color: theme.mutedText }}>
            Class balance
          </p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: theme.text }}>
            ${totalClassBalance}
          </h2>
        </div>

        <div style={panelStyle}>
          <p style={{ margin: 0, fontSize: '12px', color: theme.mutedText }}>
            Weekly payroll
          </p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', color: theme.text }}>
            ${totalWeeklyPayroll}
          </h2>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 380px) minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={panelStyle}>
            <h2 style={{ margin: 0, fontSize: '20px', color: theme.text }}>
              Teacher actions
            </h2>
            <p style={{ margin: '8px 0 16px 0', color: theme.mutedText, fontSize: '14px' }}>
              Use these quick actions to start interacting with the hosted module.
            </p>
            <button type="button" onClick={runPayday} style={buttonStyle(true)}>
              Run Payday
            </button>
          </div>

          <div style={panelStyle}>
            <h2 style={{ margin: 0, fontSize: '20px', color: theme.text }}>
              Current classroom
            </h2>

            {selectedClassroom ? (
              <div style={{ marginTop: '16px', display: 'grid', gap: '14px' }}>
                <div style={softPanelStyle}>
                  <div style={{ fontWeight: 700, color: theme.text }}>
                    {selectedClassroom.name}
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '13px', color: theme.mutedText }}>
                    Grade {selectedClassroom.gradeLevel}
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '13px', color: theme.mutedText }}>
                    {canManageClassroom(schoolContext.currentUser, selectedClassroom)
                      ? 'Manage'
                      : 'View'}
                  </div>
                </div>

                {classroomGoal && (
                  <div style={softPanelStyle}>
                    <div style={{ fontWeight: 700, color: theme.text }}>
                      {classroomGoal.name}
                    </div>
                    <div
                      style={{
                        marginTop: '6px',
                        fontSize: '13px',
                        color: theme.mutedText,
                      }}
                    >
                      ${totalClassBalance} of ${classroomGoal.targetAmount} saved
                    </div>

                    <div
                      style={{
                        marginTop: '12px',
                        height: '12px',
                        borderRadius: '999px',
                        background: theme.border,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${goalProgress}%`,
                          height: '100%',
                          background: '#0ea5e9',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ marginTop: '16px', color: theme.mutedText }}>
                No classroom is currently available for this user.
              </p>
            )}
          </div>

          <div style={panelStyle}>
            <h2 style={{ margin: 0, fontSize: '20px', color: theme.text }}>
              Class store
            </h2>

            <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
              <input
                value={newRewardName}
                onChange={(event) => setNewRewardName(event.target.value)}
                placeholder="New reward name"
                style={inputStyle}
              />

              <input
                value={newRewardCost}
                onChange={(event) => setNewRewardCost(event.target.value)}
                placeholder="Cost"
                style={inputStyle}
              />

              <button type="button" onClick={addRewardItem} style={buttonStyle(true)}>
                Add Reward
              </button>
            </div>

            <div style={{ marginTop: '18px', display: 'grid', gap: '10px' }}>
              {storeItems.map((item) => (
                <div key={item.id} style={softPanelStyle}>
                  <div style={{ fontWeight: 700, color: theme.text }}>{item.name}</div>
                  <div style={{ marginTop: '4px', fontSize: '13px', color: theme.mutedText }}>
                    ${item.cost}
                  </div>
                </div>
              ))}

              {storeItems.length === 0 && (
                <div style={softPanelStyle}>
                  <span style={{ color: theme.mutedText }}>
                    No store items have been added for this classroom yet.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={panelStyle}>
            <h2 style={{ margin: 0, fontSize: '20px', color: theme.text }}>
              Student accounts
            </h2>

            <div style={{ marginTop: '18px', display: 'grid', gap: '14px' }}>
              {studentSummaries.map((student) => (
                <div key={student.id} style={softPanelStyle}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: theme.text }}>
                        {student.studentName}
                      </div>
                      <div
                        style={{
                          marginTop: '4px',
                          fontSize: '13px',
                          color: theme.mutedText,
                        }}
                      >
                        {student.jobTitle} - ${student.weeklySalary}/week
                      </div>
                      <div
                        style={{
                          marginTop: '4px',
                          fontSize: '13px',
                          color: theme.mutedText,
                        }}
                      >
                        Goal:{' '}
                        {student.savingsGoal
                          ? `${student.savingsGoal.name} ($${student.savingsGoal.targetAmount})`
                          : 'No goal set'}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: '22px',
                          fontWeight: 800,
                          color: theme.text,
                          textAlign: 'right',
                        }}
                      >
                        ${student.balance}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: '14px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => addTransaction(student.id, 5, 'Great Day')}
                      style={buttonStyle(false)}
                    >
                      +$5 Great Day
                    </button>
                    <button
                      type="button"
                      onClick={() => addTransaction(student.id, -1, 'Warning')}
                      style={buttonStyle(false)}
                    >
                      -$1 Warning
                    </button>
                  </div>
                </div>
              ))}

              {studentSummaries.length === 0 && (
                <div style={softPanelStyle}>
                  <span style={{ color: theme.mutedText }}>
                    No visible students are available in this classroom.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={panelStyle}>
            <h2 style={{ margin: 0, fontSize: '20px', color: theme.text }}>
              Recent activity
            </h2>

            <div style={{ marginTop: '18px', display: 'grid', gap: '10px' }}>
              {classroomTransactions.map((transaction) => {
                const student = studentSummaries.find(
                  (entry) => entry.id === transaction.studentId
                );

                return (
                  <div key={transaction.id} style={softPanelStyle}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '16px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: theme.text }}>
                          {transaction.reason}
                        </div>
                        <div
                          style={{
                            marginTop: '4px',
                            fontSize: '13px',
                            color: theme.mutedText,
                          }}
                        >
                          {student?.studentName || 'Student'} -{' '}
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </div>
                      </div>

                      <div
                        style={{
                          fontWeight: 800,
                          color:
                            transaction.amount >= 0 ? '#10b981' : '#f43f5e',
                        }}
                      >
                        {transaction.amount >= 0 ? '+' : ''}${transaction.amount}
                      </div>
                    </div>
                  </div>
                );
              })}

              {classroomTransactions.length === 0 && (
                <div style={softPanelStyle}>
                  <span style={{ color: theme.mutedText }}>
                    No transactions have been recorded for this classroom yet.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={panelStyle}>
            <h2 style={{ margin: 0, fontSize: '20px', color: theme.text }}>
              Module contract
            </h2>
            <div style={{ marginTop: '14px', display: 'grid', gap: '8px' }}>
              <div style={{ color: theme.mutedText, fontSize: '14px' }}>
                • The host provides current user, visible classrooms, and visible students.
              </div>
              <div style={{ color: theme.mutedText, fontSize: '14px' }}>
                • The module owns economy-specific workflows like balances, rewards, and transactions.
              </div>
              <div style={{ color: theme.mutedText, fontSize: '14px' }}>
                • The host remains responsible for layout, navigation, and teacher-scoped access.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}