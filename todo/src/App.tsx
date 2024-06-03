
import React, { useEffect, useRef, useState, Suspense, lazy } from "react";
import ReactDOM from 'react-dom/client';
import styled from "styled-components";
import { useStateContext } from "mainApp/state";
import { StateProvider } from 'mainApp/state';

const TaskDialog = lazy(() => import('taskDialog/TaskDialog'));
const DeleteTaskDialog = lazy(() => import('deleteTaskDialog/DeleteTaskDialog'));

interface Task {
  id: number;
  text: string;
  time: string;
  completed: boolean;
}

const MainApp: React.FC = () => {
  const { state, dispatch } = useStateContext();
  const [filter, setFilter] = useState<string>("all");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const openTaskDialog = (task: Task | null = null) => {
    dispatch({ type: 'OPEN_TASK_DIALOG', payload: task });
  };

  const openDeleteTaskDialog = (taskId: number) => {
    const task = state.tasks.find((task: any) => task.id === taskId) || null;
    if (task) {
      dispatch({ type: 'OPEN_DELETE_DIALOG', payload: task });
    }
  };

  const handleToggleTaskCompletion = (taskId: number) => {
    const task = state.tasks.find((task: any) => task.id === taskId);
    if (task) {
      dispatch({
        type: "UPDATE_TASK",
        payload: { ...task, completed: !task.completed },
      });
    }
  };

  const filteredTasks = state.tasks.filter((task: any) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <Container>
      <Title id="todo-list-title">TODO LIST</Title>
      <ControlsContainer>
        <AddTaskButton onClick={() => openTaskDialog()} aria-label="Add Task">Add Task</AddTaskButton>
        <FilterDropdown value={filter} onChange={handleFilterChange} aria-label="Filter Tasks">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </FilterDropdown>
      </ControlsContainer>

      <TaskList aria-labelledby="todo-list-title">
        {filteredTasks.map((task: any) => (
          <TaskComponent key={task.id} completed={task.completed} aria-live="polite">
            <Checkbox
              checked={task.completed}
              onChange={() => handleToggleTaskCompletion(task.id)}
              aria-label={`Mark ${task.text} as ${task.completed ? 'incomplete' : 'complete'}`}
            />
            <TaskText completed={task.completed}>{task.text}</TaskText>
            <TaskTime>{task.time}</TaskTime>
            <ActionButton onClick={() => openTaskDialog(task)} aria-label={`Edit ${task.text}`}>Edit</ActionButton>
            <ActionButton onClick={() => openDeleteTaskDialog(task.id)} aria-label={`Delete ${task.text}`}>Delete</ActionButton>
          </TaskComponent>
        ))}
      </TaskList>
      {state.taskDialog.isOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <TaskDialog
            task={state.taskDialog.task}
            onClose={(disback: any) => {
              dispatch({ type: 'CLOSE_TASK_DIALOG' });
              dispatch(disback);
            }}
          />
        </Suspense>
      )}
      {state.deleteDialog.isOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <DeleteTaskDialog
            task={state.deleteDialog.task}
            onClose={(disback: any) => {
              dispatch({ type: 'CLOSE_DELETE_DIALOG' });
              dispatch(disback);
            }}
          />
        </Suspense>
      )}
    </Container>
  );
};

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
`;

const Container = styled.div`
  width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 24px;
  font-weight: bold;
  font-family: system-ui;
`;

const AddTaskButton = styled.button`
  display: block;
  padding: 10px 20px;
  background: #5865f2;
  color: white;
  border: none;
  border-radius: 8px; 
  cursor: pointer;
  font-size: 16px;
`;

const FilterDropdown = styled.select`
  display: block;
  padding: 8px;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  background: #f4f6fc;
`;

const TaskList = styled.div`
  margin-top: 20px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  accent-color: #5865f2;
  margin-right: 10px;
`;

const TaskComponent = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  background: ${props => (props.completed ? "#d3e2ff" : "white")};
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  ${Checkbox} {    
    margin-right: 10px;
  }
`;

const TaskText = styled.span<{ completed: boolean }>`
  flex: 1;
  margin: 0 10px;
  text-decoration: ${props => (props.completed ? "line-through" : "none")};
  font-size: 16px;
  font-family: sans-serif;
`;

const TaskTime = styled.span`
  color: #888;
  font-size: 12px;
  font-family: monospace;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #5865f2;
  margin-left: 5px;
  cursor: pointer;
  font-size: 16px;
  font-family: monospace;
`;

const App: React.FC = () => (
  <React.StrictMode>
    <StateProvider>
      <MainApp />
    </StateProvider>
  </React.StrictMode>
);

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export default App;
