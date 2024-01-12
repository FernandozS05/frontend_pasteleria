import { toast } from 'vue3-toastify';

const toastConf  = {
        autoClose: 2000,
        type: toast.TYPE.INFO,
        hideProgressBar: false,
        position: toast.POSITION.BOTTOM_RIGHT,
        transition: toast.TRANSITIONS.BOUNCE,
      }
export default toastConf;
