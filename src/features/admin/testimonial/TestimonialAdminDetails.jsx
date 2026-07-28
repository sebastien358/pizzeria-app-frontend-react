import styles from './TestimonialAdminDetails.module.scss'
import ModalConfirm from "@/modal/modal-confirm/ModalConfirm"
import {useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";


export default function TestimonialAdminDetails({ loading, currentTestimonial, testimonialDelete, publishedTestimonial, id }) {

    const [ openModalConfirm, setOpenModalConfirm ] = useState(false)

    console.log(currentTestimonial)

    const onClickOpenModalConfirm = () => {
        setOpenModalConfirm(true)
    }

    const onClickCloseModalConfirm = () => {
        setOpenModalConfirm(false)
    }

    const togglePublished = async () => {
        await publishedTestimonial(id)
    }

    const displayCreatedAt = (date) => {
        const d = new Date(date)
        return Intl.DateTimeFormat('fr-FR').format(d)
    }

    const router = useRouter()

    const onClickDelete = async () => {
        await testimonialDelete(id)
        router.push('/admin/testimonials')
    }

    return (
        <>
            {loading || !currentTestimonial ? (
                <section className={styles.spinner}>
                    <span className={styles.loader}></span>
                </section>
            ) : (
                <section className={styles.contact}>
                    <div className={styles['contact__item']}>
                        <div className={styles['contact__header']}>
                            <div className={styles['contact__infos']}>
                                <div className={styles['contact__infos__description']}>
                                    <p className={styles['contact__name']}>
                                        {currentTestimonial.firstname} {currentTestimonial.lastname}
                                    </p>
                                    <p className={styles['contact__email']}>
                                        <span>Date : {displayCreatedAt(currentTestimonial.createdAt)}</span>
                                        <span>Note : {currentTestimonial.rating}/5</span>
                                    </p>
                                </div>
                                {currentTestimonial.pictures.length > 0 && (
                                    <Image src={currentTestimonial?.pictures[0]?.url} alt={'Image du témoignage'} width={50} height={50} />
                                )}
                            </div>
                            <div className={styles['contact__buttons']}>
                                <button
                                    onClick={() => togglePublished(currentTestimonial.id)}
                                    className={`${styles['contact__isread']} ${currentTestimonial.isPublished ? styles.active : ''}`}
                                    type="button"
                                >
                                    {currentTestimonial.isPublished ? 'Ne pas afficher' : 'Afficher'}
                                </button>
                                <button
                                    onClick={() => onClickOpenModalConfirm(currentTestimonial.id)}
                                    className={styles['contact__delete']}
                                    type="button"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                        <div className={styles['contact__message']}>
                            {currentTestimonial.message}
                        </div>
                    </div>

                    {/* Modal Confirm Delete */}
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