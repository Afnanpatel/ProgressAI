import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import './ConfirmationModal.css';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger" // 'danger' for red, 'primary' for blue
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay fade-in">
            <div className="modal-content confirmation-modal card glass scale-in">
                <div className="confirmation-header">
                    <div className={`icon-box ${type}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="confirmation-body">
                    <h3>{title}</h3>
                    <p>{message}</p>
                </div>

                <div className="confirmation-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        {cancelText}
                    </button>
                    <button className={`btn-${type}`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
