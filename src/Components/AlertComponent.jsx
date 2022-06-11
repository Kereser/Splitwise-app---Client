import {
  Dialog,
  DialogContent,
  Alert,
  DialogTitle,
  IconButton,
  Divider,
} from '@mui/material'

//icons
import CloseIcon from '@mui/icons-material/Close'

//store
import useStore from '../store/state'

function AlertComponent() {
  const alert = useStore((state) => state.alert)
  const setAlert = useStore((state) => state.setAlert)

  const handleClose = () => {
    setAlert({ ...alert, trigger: false })
  }

  return (
    <div>
      <Dialog data-testid="modal" open={alert.trigger} onClose={handleClose}>
        <DialogTitle sx={{ m: 0.5 }}>
          <IconButton
            id="close-btn"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 1,
              top: 0,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Alert variant="outlined" severity={alert.type}>
            {alert.user
              ? `${alert.user.username} ${alert.message}`
              : alert.message}
          </Alert>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AlertComponent
