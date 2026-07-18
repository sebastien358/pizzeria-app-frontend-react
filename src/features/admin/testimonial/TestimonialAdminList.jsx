'use client'

import styles from './TestimonialAdminList.module.scss'
import Link from "next/link";
import InputSearch from "../../../components/input-search/InputSearch";
import {useTestimonialAdmin} from "@/store/admin/testimonialAdmin";
import Pagination from "@/components/pagination/Pagination";
import {useEffect} from "react";

export function TestimonialList() {
    const {
        testimonialAdminList,
        testimonialAdminSearch,
        testimonials,
        loading,
        currentPage,
        pages,
        previousPage,
        nextPage,
        term,
        countTestimonials,
    } = useTestimonialAdmin()

    useEffect(() => {
        testimonialAdminList()
    }, [])

    return (
        <>
            {loading ? (
                <section className={styles['spinner']}>
                    <span className={styles['spinner__loader']}></span>
                </section>
            ) : (
                <div className={styles['page']}>

                    {/* Input Search */}
                    <div className={styles['input-search']}>
                        <InputSearch
                            term={term}
                            search={testimonialAdminSearch}
                            activeSearch={'search-testimonial-admin'}
                            count={countTestimonials}
                            placeholder={"Rechercher un témoignage"}
                        />
                    </div>

                    {/* Contact */}
                    {testimonials.length > 0 ? (
                        <section className={styles.contact}>
                            <div className={styles['contact__list']}>
                                {testimonials.map((testimonial) => (
                                    <div key={testimonial.id} className={styles['contact__item']}>
                                        <div className={styles['contact__header']}>
                                            <div className={styles['contact__infos']}>
                                    <span className={styles['contact__name']}>
                                        {testimonial.firstname} {testimonial.lastname}
                                    </span>
                                                <span className={styles['contact__note']}>
                                        Note : {testimonial.rating}/5
                                    </span>
                                            </div>
                                            <div className={styles['contact__button']}>
                                    <span className={styles['is-read']}>
                                        {testimonial.isRead ? '✅' : '🔴'}
                                    </span>
                                                <Link
                                                    href={`/admin/testimonials/${testimonial.id}`}
                                                    className={styles['contact__details']}
                                                >
                                                    Détails
                                                </Link>
                                            </div>
                                        </div>
                                        <div className={styles['contact__message']}>
                                            {testimonial.message.slice(0, 50)}...
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pages > 1 && (
                                <div className={styles['contact__pagination']}>
                                    <Pagination currentPage={currentPage} pages={pages} previousPage={previousPage}
                                                nextPage={nextPage}/>
                                </div>
                            )}
                        </section>
                    ) : (
                        <section className={styles['no-contact']}>
                            <p>Aucun message pour le moment.</p>
                        </section>
                    )}
                </div>
            )}
        </>
    )

}