import Swal from 'sweetalert2';

/**
 * Alerta de confirmación de eliminación con SweetAlert2
 */
export const confirmDelete = async ({
  title,
  text,
  confirmButtonText = 'Sí, eliminar',
  cancelButtonText = 'Cancelar',
}: {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text: text || 'Esta acción no se puede deshacer.',
    icon: 'warning',
    iconColor: '#dc2626',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      popup: 'rounded-2xl shadow-2xl border border-gray-200 p-6 font-sans',
      title: 'text-gray-900 font-bold text-base sm:text-lg',
      htmlContainer: 'text-gray-600 text-xs sm:text-sm mt-2',
      confirmButton: 'px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md cursor-pointer transition',
      cancelButton: 'px-4 py-2.5 rounded-xl font-semibold text-xs cursor-pointer transition',
    },
  });

  return result.isConfirmed;
};

/**
 * Alerta genérica de confirmación
 */
export const confirmAction = async ({
  title,
  text,
  icon = 'question',
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  confirmButtonColor = '#1e3a8a',
}: {
  title: string;
  text?: string;
  icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
}): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor: '#64748b',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl shadow-2xl border border-gray-200 p-6 font-sans',
      title: 'text-gray-900 font-bold text-base sm:text-lg',
      htmlContainer: 'text-gray-600 text-xs sm:text-sm mt-2',
      confirmButton: 'px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md cursor-pointer transition',
      cancelButton: 'px-4 py-2.5 rounded-xl font-semibold text-xs cursor-pointer transition',
    },
  });

  return result.isConfirmed;
};

/**
 * Alerta de Éxito
 */
export const showSuccessAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    iconColor: '#16a34a',
    confirmButtonColor: '#1e3a8a',
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'rounded-2xl shadow-2xl border border-gray-200 p-6 font-sans',
      title: 'text-gray-900 font-bold text-base sm:text-lg',
      htmlContainer: 'text-gray-600 text-xs sm:text-sm mt-2',
      confirmButton: 'px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md cursor-pointer transition',
    },
  });
};

/**
 * Alerta de Error
 */
export const showErrorAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    iconColor: '#dc2626',
    confirmButtonColor: '#1e3a8a',
    confirmButtonText: 'Entendido',
    customClass: {
      popup: 'rounded-2xl shadow-2xl border border-gray-200 p-6 font-sans',
      title: 'text-gray-900 font-bold text-base sm:text-lg',
      htmlContainer: 'text-gray-600 text-xs sm:text-sm mt-2',
      confirmButton: 'px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md cursor-pointer transition',
    },
  });
};

/**
 * Toast flotante
 */
export const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon,
    title,
  });
};
