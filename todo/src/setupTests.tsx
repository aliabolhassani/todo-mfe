import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { StateProvider } from './state';
import MainApp from './App';

// Helper to render with context
const renderWithProvider = (ui: React.ReactElement) => {
  return render(<StateProvider>{ui}</StateProvider>);
};

test('renders todo list title', () => {
  renderWithProvider(<MainApp />);
  const titleElement = screen.getByText(/TODO LIST/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders Add Task button', () => {
  renderWithProvider(<MainApp />);
  const addButton = screen.getByRole('button', { name: /Add Task/i });
  expect(addButton).toBeInTheDocument();
});

test('opens Task Dialog when Add Task button is clicked', () => {
  renderWithProvider(<MainApp />);
  const addButton = screen.getByRole('button', { name: /Add Task/i });
  fireEvent.click(addButton);
  const dialogTitle = screen.getByText(/Add New Task/i);
  expect(dialogTitle).toBeInTheDocument();
});

test('adds a new task', () => {
  renderWithProvider(<MainApp />);
  const addButton = screen.getByRole('button', { name: /Add Task/i });
  fireEvent.click(addButton);

  const taskInput = screen.getByLabelText(/Task input/i);
  fireEvent.change(taskInput, { target: { value: 'New Task' } });

  const submitButton = screen.getByRole('button', { name: /Add/i });
  fireEvent.click(submitButton);

  const newTask = screen.getByText(/New Task/i);
  expect(newTask).toBeInTheDocument();
});

test('toggles task completion', () => {
  renderWithProvider(<MainApp />);

  const addButton = screen.getByRole('button', { name: /Add Task/i });
  fireEvent.click(addButton);

  const taskInput = screen.getByLabelText(/Task input/i);
  fireEvent.change(taskInput, { target: { value: 'Toggle Task' } });

  const submitButton = screen.getByRole('button', { name: /Add/i });
  fireEvent.click(submitButton);

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  expect(checkbox).toBeChecked();
});

test('filters tasks', () => {
  renderWithProvider(<MainApp />);

  const addButton = screen.getByRole('button', { name: /Add Task/i });
  fireEvent.click(addButton);

  const taskInput = screen.getByLabelText(/Task input/i);
  fireEvent.change(taskInput, { target: { value: 'Active Task' } });

  const submitButton = screen.getByRole('button', { name: /Add/i });
  fireEvent.click(submitButton);

  const filterDropdown = screen.getByLabelText(/Filter Tasks/i);
  fireEvent.change(filterDropdown, { target: { value: 'completed' } });

  const task = screen.queryByText(/Active Task/i);
  expect(task).not.toBeInTheDocument();
});

test('deletes a task', () => {
  renderWithProvider(<MainApp />);

  const addButton = screen.getByRole('button', { name: /Add Task/i });
  fireEvent.click(addButton);

  const taskInput = screen.getByLabelText(/Task input/i);
  fireEvent.change(taskInput, { target: { value: 'Delete Task' } });

  const submitButton = screen.getByRole('button', { name: /Add/i });
  fireEvent.click(submitButton);

  const deleteButton = screen.getByLabelText(/Delete Delete Task/i);
  fireEvent.click(deleteButton);

  const confirmDeleteButton = screen.getByRole('button', { name: /Delete/i });
  fireEvent.click(confirmDeleteButton);

  const deletedTask = screen.queryByText(/Delete Task/i);
  expect(deletedTask).not.toBeInTheDocument();
});
