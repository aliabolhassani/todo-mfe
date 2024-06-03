import { renderHook, act } from '@testing-library/react-hooks';
import { StateProvider, useStateContext, reducer, initialState } from './state';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <StateProvider>{children}</StateProvider>
);

test('should initialize state with default values', () => {
    const { result } = renderHook(() => useStateContext(), { wrapper });
    expect(result.current.state).toEqual(initialState);
});

test('should add a new task', () => {
  const { result } = renderHook(() => useStateContext(), { wrapper });

  act(() => {
    result.current.dispatch({
      type: 'ADD_TASK',
      payload: { id: 1, text: 'New Task', time: '10:00 AM', completed: false }
    });
  });

  expect(result.current.state.tasks).toHaveLength(1);
  expect(result.current.state.tasks[0].text).toBe('New Task');
});

test('should update an existing task', () => {
  const { result } = renderHook(() => useStateContext(), { wrapper });

  act(() => {
    result.current.dispatch({
      type: 'ADD_TASK',
      payload: { id: 1, text: 'New Task', time: '10:00 AM', completed: false }
    });
  });

  act(() => {
    result.current.dispatch({
      type: 'UPDATE_TASK',
      payload: { id: 1, text: 'Updated Task', time: '10:00 AM', completed: false }
    });
  });

  expect(result.current.state.tasks).toHaveLength(1);
  expect(result.current.state.tasks[0].text).toBe('Updated Task');
});

test('should delete a task', () => {
  const { result } = renderHook(() => useStateContext(), { wrapper });

  act(() => {
    result.current.dispatch({
      type: 'ADD_TASK',
      payload: { id: 1, text: 'New Task', time: '10:00 AM', completed: false }
    });
  });

  act(() => {
    result.current.dispatch({ type: 'DELETE_TASK', payload: 1 });
  });

  expect(result.current.state.tasks).toHaveLength(0);
});

test('should load tasks', () => {
  const { result } = renderHook(() => useStateContext(), { wrapper });

  const tasks = [
    { id: 1, text: 'Task 1', time: '10:00 AM', completed: false },
    { id: 2, text: 'Task 2', time: '11:00 AM', completed: true }
  ];

  act(() => {
    result.current.dispatch({ type: 'LOAD_TASKS', payload: tasks });
  });

  expect(result.current.state.tasks).toHaveLength(2);
  expect(result.current.state.tasks[0].text).toBe('Task 1');
  expect(result.current.state.tasks[1].text).toBe('Task 2');
});

test('should open task dialog', () => {
  const { result } = renderHook(() => useStateContext(), { wrapper });

  act(() => {
    result.current.dispatch({ type: 'OPEN_TASK_DIALOG', payload: null });
  });

  expect(result.current.state.taskDialog.isOpen).toBe(true);
});

test('should close task dialog', () => {
  const { result } = renderHook(() => useStateContext(), { wrapper });

  act(() => {
    result.current.dispatch({ type: 'OPEN_TASK_DIALOG', payload: null });
  });

  act(() => {
    result.current.dispatch({ type: 'CLOSE_TASK_DIALOG' });
  });

  expect(result.current.state.taskDialog.isOpen).toBe(false);
});

test('should open delete dialog', () => {
  const { result } = renderHook(() => useStateContext(), { wrapper });

  const task = { id: 1, text: 'Task to delete', time: '10:00 AM', completed: false };

  act(() => {
    result.current.dispatch({ type: 'OPEN_DELETE_DIALOG', payload: task });
  });

  expect(result.current.state.deleteDialog.isOpen).toBe(true);
  expect(result.current.state.deleteDialog.task).toEqual(task);
});

test('should close delete dialog', () => {
  const { result } = renderHook(() => useStateContext(), { wrapper });

  act(() => {
    result.current.dispatch({ type: 'OPEN_DELETE_DIALOG', payload: null } as any);
  });

  act(() => {
    result.current.dispatch({ type: 'CLOSE_DELETE_DIALOG' });
  });

  expect(result.current.state.deleteDialog.isOpen).toBe(false);
});
