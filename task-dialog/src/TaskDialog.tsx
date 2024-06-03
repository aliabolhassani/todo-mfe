import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Snackbar } from "@mui/material";
import { StateProvider } from 'mainApp/state';

interface Task {
  id: number;
  text: string;
  time: string;
  completed: boolean;
}

interface TaskDialogProps {
  task: Task | null;
  onClose: (disback: any) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ task, onClose }) => {
  const [taskText, setTaskText] = useState(task ? task.text : "");
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (task) {
      setTaskText(task.text);
    }
  }, [task]);

  const handleAddOrUpdateTask = () => {
    try {
      if (task) {
        onClose({ type: "UPDATE_TASK", payload: { ...task, text: taskText } });
      } else {
        onClose({ type: "ADD_TASK", payload: { id: Date.now(), text: taskText, time: new Date().toLocaleString(), completed: false } });
      }
    } catch (e) {
      setError("An error occurred while saving the task");
      setSnackbarOpen(true);
    } finally {
      onClose({});
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open onClose={onClose} aria-labelledby="task-dialog-title" aria-describedby="task-dialog-description">
        <DialogTitle id="task-dialog-title">{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="task-dialog-description">
            Please enter the details of the task.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Task"
            type="text"
            fullWidth
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            aria-label="Task input"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} aria-label="Cancel">Cancel</Button>
          <Button onClick={handleAddOrUpdateTask} color="primary" aria-label={task ? "Update task" : "Add task"}>
            {task ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={error}
        action={
          <Button color="inherit" size="small" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
      />
    </>
  );
};

const TaskDialogWrapper: React.FC<TaskDialogProps> = ({ task, onClose }) => (
  <TaskDialog task={task} onClose={onClose} />
);

const App: React.FC<{ task: TaskDialogProps['task']; onClose: TaskDialogProps['onClose']; }> = ({ task, onClose }) => (

  <React.StrictMode>
    <StateProvider>
      <TaskDialogWrapper task={task} onClose={onClose} />
    </StateProvider>
  </React.StrictMode>
);

export default App;
