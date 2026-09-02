import Button from './Button.jsx';
import Modal from './Modal.jsx';

/** Confirmation prompt used before destructive actions (delete product, empty cart). */
export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'تأیید',
  cancelLabel = 'انصراف',
  variant = 'danger',
  loading = false,
  onConfirm,
  onClose,
}) => (
  <Modal
    open={open}
    onClose={loading ? undefined : onClose}
    title={title}
    size="sm"
    footer={
      <>
        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
      </>
    }
  >
    <p className="text-sm leading-7 text-ink-600">{message}</p>
  </Modal>
);

export default ConfirmDialog;
