import { toast } from 'react-toastify'

export const triggerNotifier = ({ type, message, position }) => {
    toast[ type ](message, {
        hideProgressBar: true,
        className: 'notifier-custom',
        position: position === 'top-right' ? toast.POSITION.TOP_RIGHT : toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: true,
        autoClose: type === 'error' ? 1000 : 3000,
    })
}