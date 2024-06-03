import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { StateProvider } from 'mainApp/state';
import TaskDialog from './TaskDialog';

const renderWithProvider = (ui: React.ReactElement) => {
    return render(<StateProvider>{ui}</StateProvider>);
};

const mockTask = {
    id: 1,
    text: 'Test Task',
    time: '10:00 AM',
    completed: false
};

test('renders task dialog with correct title when adding a new task', () => {
    renderWithProvider(<TaskDialog task={null} onClose={jest.fn()} />);
    const dialogTitle = screen.getByText(/Add New Task/i);
    expect(dialogTitle).toBeInTheDocument();
});

test('renders task dialog with correct title when editing an existing task', () => {
    renderWithProvider(<TaskDialog task={mockTask} onClose={jest.fn()} />);
    const dialogTitle = screen.getByText(/Edit Task/i);
    expect(dialogTitle).toBeInTheDocument();
});

test('calls onClose when cancel button is clicked', () => {
    const onCloseMock = jest.fn();
    renderWithProvider(<TaskDialog task={null} onClose={onCloseMock} />);
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
});

test('adds a new task on submit', () => {
    const { result }: any = renderWithProvider(<TaskDialog task={null} onClose={jest.fn()} />);
    const taskInput = screen.getByLabelText(/Task input/i);
    fireEvent.change(taskInput, { target: { value: 'New Task' } });

    const addButton = screen.getByRole('button', { name: /Add/i });
    fireEvent.click(addButton);

    const { state } = result.current;
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].text).toBe('New Task');
});

test('updates an existing task on submit', () => {
    const { result }: any = renderWithProvider(<TaskDialog task={mockTask} onClose={jest.fn()} />);
    const taskInput = screen.getByLabelText(/Task input/i);
    fireEvent.change(taskInput, { target: { value: 'Updated Task' } });

    const updateButton = screen.getByRole('button', { name: /Update/i });
    fireEvent.click(updateButton);

    const { state } = result.current;
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].text).toBe('Updated Task');
});
