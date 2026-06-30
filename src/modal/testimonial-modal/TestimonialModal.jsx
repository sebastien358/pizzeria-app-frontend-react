import styles from './TestimonialModal.module.scss'
import {useEffect} from "react";

export default function TestimonialModal({ openModal, closeModal }) {
    useEffect(() => {
        document.body.style.overflow = openModal ? 'hidden' : 'auto'
    }, [openModal])

    return (
        <>
            {openModal && (
                <section className={styles['modal-testimonial']}>
                    <div className={styles['modal-testimonial__container']}>
                        <div className={styles['modal-testimonial__close']} onClick={() => closeModal()}>
                            x
                        </div>

                        <h3>Laisser votre avis</h3>

                        <form>
                            <div className={styles['modal-testimonial__form']}>
                                <input type={'text'}/>
                            </div>

                            <div className={styles['modal-testimonial__button']}>
                                <button className={`${styles.btn} ${styles['btn-testimonial']}`}>
                                    Soumettre
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            )}
        </>
    )
}