import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, alpha, useTheme } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'error'
}: ConfirmDialogProps) {
  const theme = useTheme();

  return (
    <Dialog 
      open={open} 
      onClose={onCancel}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: `0 24px 48px -12px ${alpha(theme.palette[variant].main, 0.2)}`,
          border: '1px solid',
          borderColor: 'divider',
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: `${variant}.main`, fontSize: '1.25rem' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.secondary', fontWeight: 500, mt: 1 }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button 
          onClick={onCancel} 
          color="inherit" 
          sx={{ fontWeight: 600, borderRadius: 2 }}
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={variant}
          sx={{ 
            fontWeight: 700, 
            borderRadius: 2, 
            boxShadow: `0 4px 14px 0 ${alpha(theme.palette[variant].main, 0.4)}`,
            px: 3
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
