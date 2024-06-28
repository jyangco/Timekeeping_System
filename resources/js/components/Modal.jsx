const Modal = ({ handleClose, show, children }) => {
const showHideClassName = show ? "modal display-block" : "modal display-none"

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                <div className="card p-5 bg-white m-0 min-h-[90vh] max-h-[90vh] min-w-[90vw] max-w-[90vw] overflow-y-auto">
                    <div className="card-body p-0">
                        {children}
                        <button className="bg-red-500 text-white p-1 absolute top-0 right-0 z-[998]" type="button" onClick={handleClose}>
                            <i className="far fa-times"></i>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Modal