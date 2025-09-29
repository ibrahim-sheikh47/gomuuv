import Toast, { ToastShowParams } from 'react-native-toast-message';
export const toastMessage = (props: ToastShowParams) => {
    if (props) {
        Toast.show(props)
    }
};