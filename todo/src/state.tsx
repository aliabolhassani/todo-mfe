import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';

interface Task {
  id: number;
  text: string;
  time: string;
  completed: boolean;
}

type Action =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'LOAD_TASKS'; payload: Task[] }
  | { type: 'OPEN_TASK_DIALOG'; payload: Task | null }
  | { type: 'CLOSE_TASK_DIALOG' }
  | { type: 'OPEN_DELETE_DIALOG'; payload: Task }
  | { type: 'CLOSE_DELETE_DIALOG' };

interface State {
  tasks: Task[];
  taskDialog: { isOpen: boolean; task: Task | null };
  deleteDialog: { isOpen: boolean; task: Task | null };
}

export const initialState: State = {
  tasks: JSON.parse(localStorage.getItem("tasks") || "[]"),
  taskDialog: { isOpen: false, task: null },
  deleteDialog: { isOpen: false, task: null },
};

export function reducer(state: State, action: Action): State {    
  switch (action.type) {
    case 'ADD_TASK':  
      return { ...state, tasks: [...state.tasks, action.payload]};
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'LOAD_TASKS':      
      return { ...state, tasks: action.payload };
    case 'OPEN_TASK_DIALOG':
      return { ...state, taskDialog: { isOpen: true, task: action.payload } };
    case 'CLOSE_TASK_DIALOG':      
      return { ...state, taskDialog: { isOpen: false, task: null } };
    case 'OPEN_DELETE_DIALOG':
      return { ...state, deleteDialog: { isOpen: true, task: action.payload } };
    case 'CLOSE_DELETE_DIALOG':
      return { ...state, deleteDialog: { isOpen: false, task: null } };    
    default:
      return state;
  }
}

const StateContext = createContext<{ state: State; dispatch: React.Dispatch<Action> }>({
  state: initialState,
  dispatch: () => undefined,
});

export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'tasks') {
        const tasks = JSON.parse(event.newValue || '[]') as Task[];
        dispatch({ type: 'LOAD_TASKS', payload: tasks });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
