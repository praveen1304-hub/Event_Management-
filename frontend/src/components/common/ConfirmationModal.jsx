import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action? This cannot be undone.',
  confirmText = 'Confirm',
  confirmVariant = 'danger',
  loading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="460px"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={confirmVariant} size="sm" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          backgroundColor: confirmVariant === 'danger' ? 'var(--danger-bg)' : 'var(--warning-bg)',
          color: confirmVariant === 'danger' ? 'var(--danger)' : 'var(--warning)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <AlertTriangle size={20} />
        </div>
        <div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};
