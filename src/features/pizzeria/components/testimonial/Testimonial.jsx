'use client'

import TestimonialModal from "@/modal/testimonial-modal/TestimonialModal";
import styles from './Testimonial.module.scss'
import {useTestimonial} from "@/store/testimonial";
import {useEffect, useState} from "react";
import Pagination from "@/components/pagination/Pagination";
import Image from "next/image";

export default function Testimonial() {
    const { testimonialList, testimonials, loadingTestimonial, countTestimonials, currentPage, pages, averageRating, previousPage, nextPage } = useTestimonial()

    useEffect(() => {
        testimonialList()
    }, [])

    {/* modal */}

    const [ openModal, setOpenModal ] = useState(false)

    const openModalTestimonial = () => {
        setOpenModal(true)
    }

    const closeModal = () => {
        setOpenModal(false)
    }

    const displayDate = (date) => {
        const d = new Date(date)
        return Intl.DateTimeFormat('fr-FR').format(d)
    }

    return (
        <section className={styles['testimonials-page']}>
            {loadingTestimonial ? (
                <div className={styles['spinner']}>
                    <div className={styles['spinner__loader']}></div>
                </div>
            ) : testimonials && testimonials.length > 0 ? (
                <div className={styles['testimonials']}>
                    <div className={styles['testimonials__header']}>
                        <span className={styles['testimonials__label']}>Avis clients</span>
                        <h1 className={styles['testimonials__title']}>Tous les témoignages</h1>
                        <p className={styles['testimonials__subtitle']}>
                            Découvrez ce que nos clients pensent de nos pizzas.
                        </p>
                    </div>

                    <div className={styles['testimonials__summary']}>
                        <div className={styles['testimonials__summary-item']}>
                            <span className={styles['testimonials__summary-number']}>{averageRating}</span>
                            <span className={styles['testimonials__summary-label']}>Note moyenne</span>
                        </div>
                        <div className={styles['testimonials__summary-item']}>
                            <span className={styles['testimonials__summary-number testimonials__summary-number--red']}>
                                {countTestimonials}
                            </span>
                            <span className={styles['testimonials__summary-label']}>Avis clients</span>
                        </div>
                        <div className={styles['testimonials__summary-item']}>
                            <span className={styles['testimonials__summary-number']}>94%</span>
                            <span className={styles['testimonials__summary-label']}>Recommandent</span>
                        </div>
                    </div>

                    <div className={styles['testimonials__modal']}>
                        <button onClick={() => openModalTestimonial()} className={`${styles.btn} ${styles['btn-testimonial']}`}>
                            Ajouter un témoignage
                        </button>
                    </div>

                    <div className={styles['testimonials__grid']}>
                        {testimonials.map((t) => (
                            <div key={t.id} className={styles['testimonials__list']}>
                                <div className={styles['testimonials__card']}>
                                    <div className={styles['testimonials__card-stars']}>
                                        {[1, 2, 3, 4, 5].map((n, index) => (
                                            <span key={index}>{n <= t.rating ? '★' : '☆'}</span>
                                        ))}
                                    </div>
                                    <p className={styles['testimonials__card-text']}>« {t.message} »</p>
                                    <div className={styles['testimonials__card-author']}>
                                        <div className={styles['testimonials__card-avatar']}>
                                            {t.pictures?.[0]?.filename ? (
                                                <Image src={t.pictures?.[0]?.filename} className={styles.img} alt="Image client témoignage" height={100} width={100} />
                                            ) : (
                                                <span>{t.firstname?.slice(0, 1)} {t.lastname?.slice(0, 1)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className={styles['testimonials__card-name']}>
                                                {t.firstname} {t.lastname?.slice(0, 1)}.
                                            </p>
                                            <p className={styles['testimonials__card-date']}>
                                                {displayDate(t.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles['testimonials__pagination']}>
                       <Pagination currentPage={currentPage} pages={pages} previousPage={previousPage} nextPage={nextPage} />
                    </div>
                </div>
            ) : (
                <div className={styles['testimonials__empty']}>
                    <div className={styles['testimonials__empty__text']}>
                        <p>Aucun témoignage pour le moment.</p>
                    </div>
                    <button onClick={() => openModalTestimonial()} className={`${styles.btn} ${styles['btn-testimonial']}`}>
                        Ajouter un témoignage
                    </button>
                </div>
            )}

            <TestimonialModal openModal={openModal} closeModal={closeModal} />
        </section>
    )
}