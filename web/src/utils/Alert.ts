import { toast } from 'react-toastify';

const Alert = (message: string) => toast(message, { 
   type: 'success',
   className: 'toast'
});

export default Alert;