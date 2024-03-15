function ModalReservaciones({children, closeModal, isOpen}) {
  const handleModalContainerClick = (e) => e.stopPropagation();
  return (
    <article className={`ventana-modal ${isOpen && "is-open"}`} onClick={closeModal}>
      <div className="modal-container"  onClick={handleModalContainerClick}>
        <button className="modal-close" onClick={closeModal}>X</button>
        {children}
      </div>
    </article>
  );
}

export default ModalReservaciones;
