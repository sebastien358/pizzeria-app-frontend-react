'use client'

import TestimonialModal from "@/modal/testimonial-modal/TestimonialModal";
import styles from './Testimonial.module.scss'
import {useTestimonial} from "@/store/testimonial";
import {useEffect, useRef, useState} from "react";
import Pagination from "@/components/pagination/Pagination";
import Image from "next/image";
import gsap from 'gsap'
import { usePathname } from "next/navigation"

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

    {/* Reviews GSAP */}

    const pathname = usePathname()

    const reviewsRef = useRef(null)
    const reviewsLabelRef = useRef(null)
    const reviewsTitleRef = useRef(null)
    const reviewsSubtitleRef = useRef(null)
    const reviewsSummaryRef = useRef (null)
    const reviewsCardRef = useRef(null)
    const reviewsLinkRef = useRef(null)
    const reviewsPaginationRef = useRef(null)

    const reviewsGsap = () => {
        if (!reviewsRef.current) return

        const desktop = window.innerWidth >= 768

        const tl = gsap.timeline({})

        const reviews = reviewsCardRef.current
        const cards = reviews?.children

        if (!cards || !cards.length) return;

        tl.from(reviewsLabelRef.current, { opacity: 0, y: desktop ? 30 : 20, duration: 0.6, ease: 'power3.out' })
        .from(reviewsTitleRef.current, { opacity: 0, y: 0, x: desktop ? -60 : -30, duration: 0.6, ease: 'power3.out' }, '-=0.25')
        .from(reviewsSubtitleRef.current, { opacity: 0, y: 0, x: desktop ? 60 : 30, duration: 0.6, ease: 'power3.out' }, '-=0.25')
        .from(reviewsSummaryRef.current, { opacity: 0, y: desktop ? 30 : 20, x: 0, duration: 0.6, ease: 'power3.out' }, '-=0.35')
        .from(reviewsLinkRef.current, {opacity: 0, y: 20, stagger: 0.1, duration: 0.4, ease: 'power3.out'}, '-=0.35')
        .from(cards, {opacity: 0, y: desktop ? 40 : 20, stagger: 0.15, duration: 0.6, ease: 'power3.out'}, '-=0.25')
        .from(reviewsPaginationRef.current, {opacity: 0, y: desktop ? 20 : 10, duration: 1.2, ease: 'power3.out'}, '-=0.15')
    }

    const hasAnimated = useRef(false)

    useEffect(() => {
        hasAnimated.current = false
    }, [pathname])

    useEffect(() => {
        if (testimonials.length > 0 && !hasAnimated.current) {
            hasAnimated.current = true
            const ctx = gsap.context(() => {
                reviewsGsap()
            })
            return () => ctx.revert()
        }
    }, [testimonials])

    return (
        <section key={pathname} className={styles['testimonials-page']}>
            {loadingTestimonial ? (
                <div className={styles['spinner']}>
                    <div className={styles['spinner__loader']}></div>
                </div>
            ) : testimonials && testimonials.length > 0 ? (
                <div className={styles['testimonials']} ref={reviewsRef}>
                    <div className={styles['testimonials__header']}>
                        <span className={styles['testimonials__label']} ref={reviewsLabelRef}>Avis clients</span>
                        <h1 className={styles['testimonials__title']} ref={reviewsTitleRef}>Tous les témoignages</h1>
                        <p className={styles['testimonials__subtitle']} ref={reviewsSubtitleRef}>
                            Découvrez ce que nos clients pensent de nos pizzas.
                        </p>
                    </div>

                    <div className={styles['testimonials__summary']} ref={reviewsSummaryRef}>
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

                    <div className={styles['testimonials__modal']} ref={reviewsLinkRef}>
                        <button onClick={() => openModalTestimonial()} className={`${styles.btn} ${styles['btn-testimonial']}`}>
                            Ajouter un témoignage
                        </button>
                    </div>

                    <div className={styles['testimonials__grid']} ref={reviewsCardRef}>
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

                    <div className={styles['testimonials__pagination']} ref={reviewsPaginationRef}>
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