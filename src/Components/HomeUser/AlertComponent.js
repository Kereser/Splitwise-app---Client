import { Dialog, DialogContent, Alert } from '@mui/material'

//store
import useStore from '../../store/state'

function AlertComponent() {
  const alert = useStore((state) => state.alert)
  const setAlert = useStore((state) => state.setAlert)

  return (
    <div>
      <Dialog
        open={alert.trigger}
        onClose={() => setAlert({ ...alert, trigger: false })}
      >
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
