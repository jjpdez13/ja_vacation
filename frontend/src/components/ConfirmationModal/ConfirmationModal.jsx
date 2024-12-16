// frontend/src/components/ConfirmationModal/ConfirmationModal.jsx
import { useModal } from "../../context/Modal";
import "./ConfirmationModal.css";

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  const { closeModal } = useModal();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button
            className="red-button"
            onClick={() => onConfirm(closeModal())}
          >
            Yes (Confirm delete)
          </button>
          <button
            className="dark-grey-button"
            onClick={() => onCancel(closeModal())}
          >
            No (do not delete)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;