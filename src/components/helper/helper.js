import swal from '@sweetalert/with-react';

export const _showAlert = (title, type) => {
    const icon = type === 'ok' ? 'success' : 'error';
    return swal({
        title,
        icon,
        button: 'Cerrar',
    });
};