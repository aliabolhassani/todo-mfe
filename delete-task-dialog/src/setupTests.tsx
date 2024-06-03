import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { StateProvider } from 'mainApp/state';
import DeleteTaskDialog from './DeleteTaskDialog';
import { act } from 'react-dom/test-utils';

const renderWithProvider = (ui: React.ReactElement) => {
    return render(<StateProvider>{ui}</StateProvider>);
};

const mockTask = {
    id: 1,
    text: 'Test Task',
    time: '10:00 AM',
    completed: false
};

test('renders delete task dialog with correct title', () => {
    renderWithProvider(<DeleteTaskDialog task={mockTask} onClose={jest.fn()} />);
    const dialogTitle = screen.getByText(/Confirm Delete/i);
    expect(dialogTitle).toBeInTheDocument();
});

test('calls onClose when cancel button is clicked', () => {
    const onCloseMock = jest.fn();
    renderWithProvider(<DeleteTaskDialog task={mockTask} onClose={onCloseMock} />);
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
});

test('deletes the task on confirm', () => {
    const { result }: any = renderWithProvider(<DeleteTaskDialog task={mockTask} onClose={jest.fn()} />);

    act(() => {
        result.current.dispatch({ type: 'ADD_TASK', payload: mockTask } as any);
    });

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    const { state } = result.current;
    expect(state.tasks).toHaveLength(0);
});
