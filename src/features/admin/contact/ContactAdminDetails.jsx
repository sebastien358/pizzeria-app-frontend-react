import styles from './ContactAdminDetails.module.scss'
import {useRouter} from "next/navigation";
import {useState} from "react";
import ModalConfirm from "@/modal/modal-confirm/ModalConfirm";

export default function ContactAdminDetails({ currentContact, loading, contactAdminIsPublished, contactAdminDelete, id }) {
    const router = useRouter()

    const [ openModalConfirm, setOpenModalConfirm ] = useState(false)

    const onClickOpenModalConfirm = async () => {
        setOpenModalConfirm(true)
    }

    const onClickCloseModalConfirm = async () => {
        setOpenModalConfirm(false)
    }

    const onClickDelete = async () => {
        await contactAdminDelete(id)
        router.push('/admin/contacts')
    }

    const activeIsRead = async (id) => {
        await contactAdminIsPublished(id)
    }

    const displayDate = (date) => {
        if (!date) return
        const d = new Date(date)
        return Intl.DateTimeFormat().format(d)
    }
    return (
        <>
            {loading || !currentContact ? (
                <section className={styles.spinner}>
                    <span className={styles.loader}></span>
                </section>
            ) : (
                <section className={styles.contact}>
                    <div className={styles['contact__item']}>
                        <div className={styles['contact__header']}>
                            <div className={styles['contact__infos']}>
                                <span className={styles['contact__name']}>
                                    {currentContact.firstname} {currentContact.lastname}
                                </span>
                                <div className={styles['contact__email']}>
                                    <span>{currentContact.email}</span>
                                    -
                                    <span>{displayDate(currentContact.createdAt)}</span>
                                </div>
                            </div>
                            <div className={styles['contact__buttons']}>
                                <a
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${currentContact.email}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles['contact__response']}
                                    >
                                    Répondre
                                </a>
                                <button
                                    onClick={() => activeIsRead(currentContact.id)}
                                    className={`${styles['contact__isread']} ${currentContact.isRead ? styles.active : ''}`}
                                    type="button"
                                >
                                    {currentContact.isRead ? 'Vu' : 'Marquer comme vu'}
                                </button>
                                <button
                                    className={styles['contact__delete']}
                                    type="button"
                                    onClick={() => onClickOpenModalConfirm()}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                        <div className={styles['contact__message']}>
                            {currentContact.message}
                        </div>
                    </div>
                    <ModalConfirm
                        openModalConfirm={openModalConfirm}
                        onClickCloseModalConfirm={onClickCloseModalConfirm}
                        onClickDelete={onClickDelete}
                    />
                </section>
            )}
        </>
    )
}