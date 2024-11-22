// frontend/src/context/Modal.jsx
import './Modal.css';
import { createContext, useContext, useRef, useState } from "react";
import ReactDOM from 'react-dom';

const ModalContext = createContext();

export function ModalProvider({children}) {
    const modalRef = useRef();
    const [modalContent, setModalContent] = useState(null);
    const [onModalClose, setOnModalClose] = useState(null);

    const closeModal = () => {
        setModalContent(null);

        if (typeof onModalClose === "function") {
            setOnModalClose(null);
            onModalClose();
        }
    }
    const contextVal = { modalRef, modalContent, setModalContent, setOnModalClose, closeModal };
    return (
        <>
            <ModalContext.Provider value={contextVal}>{children}</ModalContext.Provider>
            <div ref={modalRef} />
        </>
    );
}

export function Modal() {
    const { modalRef, modalContent, closeModal } = useContext(ModalContext);
    if (!modalContent || !modalRef || !modalRef.current) return null;

    return ReactDOM.createPortal(
        <div id="modal">
            <div id="modal-background" onClick={closeModal}></div>
            <div id="modal-content">{modalContent}</div>
        </div>,
        modalRef.current
    );
}

export const useModal = () => useContext(ModalContext);