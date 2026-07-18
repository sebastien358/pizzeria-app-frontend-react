import styles from "./ModalConfirm.module.scss"

type ModalConfirmProps = {
    openModalConfirm: boolean
    onClickCloseModalConfirm: () => void
    onClickDelete: () => void
}

export default function ModalConfirm({ openModalConfirm, onClickCloseModalConfirm, onClickDelete}: ModalConfirmProps) {

    const closeModal = () => {
        onClickCloseModalConfirm()
    }

    const deleteElement = () => {
        onClickDelete()
    }

    return (
        <>
            {openModalConfirm && (
                <section className={styles['modal-overlay']}>
                    <div className={styles.modal}>
                        <div className={styles['modal__icon']}>🗑️</div>
                        <h2 className={styles['modal__title']}>Confirmer la suppression</h2>
                        <p className={styles['modal__text']}>
                            Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?
                        </p>
                        <div className={styles['modal__actions']}>
                            <button onClick={closeModal} className={`${styles['modal__btn']} ${styles['modal__btn--cancel']}`}>
                                Annuler
                            </button>
                            <button onClick={deleteElement} className={`${styles['modal__btn']} ${styles['modal__btn--confirm']}`}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}