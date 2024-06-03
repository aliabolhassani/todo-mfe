import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Snackbar } from "@mui/material";
import { StateProvider } from 'mainApp/state';

interface Task {
  id: number;
  text: string;
  time: string;
  completed: boolean;
}

interface DeleteTaskDialogProps {
  task: Task | null;
  onClose: (disback: any) => void;
}

const DeleteTaskDialog: React.FC<DeleteTaskDialogProps> = ({ task, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleDeleteTask = () => {
    try {
      if (task) {
        onClose({ type: "DELETE_TASK", payload: task.id });
      }
    } catch (e) {
      setError("An error occurred while deleting the task");
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
      <Dialog
        open onClose={onClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} aria-label="Cancel">Cancel</Button>
          <Button onClick={handleDeleteTask} color="primary" autoFocus aria-label="Delete">
            Delete
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

const DeleteTaskDialogWrapper: React.FC<DeleteTaskDialogProps> = ({ task, onClose }) => (
  <DeleteTaskDialog task={task} onClose={onClose} />
);

const App: React.FC<{ task: DeleteTaskDialogProps['task']; onClose: DeleteTaskDialogProps['onClose']; }> = ({ task, onClose }) => (

  <React.StrictMode>
    <StateProvider>
      <DeleteTaskDialogWrapper task={task} onClose={onClose} />
    </StateProvider>
  </React.StrictMode>
);

export default App;
