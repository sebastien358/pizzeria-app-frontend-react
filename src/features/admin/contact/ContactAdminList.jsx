'use client'

import styles from './ContactAdminList.module.scss'
import Link from "next/link";
import {useContactAdminStore} from "@/store/admin/contactAdmin";
import {useEffect} from "react";
import Pagination from "@/components/pagination/Pagination";
import InputSearch from "@/components/input-search/InputSearch";

export default function ContactAdminList() {
    const { contactAdminList, searchAdminContact, contacts, term, previousPage, nextPage, loading, currentPage, totalContacts, pages } = useContactAdminStore()

    useEffect(() => {
        contactAdminList()
    }, [])

    return (
        <>
            {/* Loading */}
            {loading ? (
                <section className={styles.spinner}>
                    <span className={styles.loader}></span>
                </section>
            ) : (
                <section className={styles.page}>

                    {/* Input Search */}
                    <div className={styles['input-search']}>
                        <InputSearch
                            search={searchAdminContact}
                            term={term} count={totalContacts}
                            activeSearch={'search-contact-admin'}
                            placeholder={'Rechercher un contact...'}
                        />
                    </div>

                    {/* Contact */}
                    {contacts.length > 0 ? (
                        <section className={styles.contact}>
                            <div className={styles['contact__list']}>
                                {contacts.map((contact) => (
                                    <div key={contact.id} className={styles['contact__item']}>
                                        <div className={styles['contact__header']}>
                                            <div className={styles['contact__infos']}>
                                    <span className={styles['contact__name']}>
                                        {contact.firstname} {contact.lastname}
                                    </span>
                                                <div className={styles['contact__email']}>
                                                    <span>{contact.email}</span>
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div className={styles['contact__buttons']}>
                                                <Link
                                                    href={`/admin/contacts/${contact.id}`}
                                                    className={styles['contact__details']}
                                                >
                                                    Détails
                                                </Link>
                                            </div>
                                        </div>
                                        <div className={styles['contact__message']}>
                                            {contact.message.slice(0, 20)}...
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pages > 1 && (
                                <div className={styles['contact__pagination']}>
                                    <Pagination currentPage={currentPage} pages={pages} previousPage={previousPage} nextPage={nextPage} />
                                </div>

                            )}
                        </section>
                    ) : (
                        <>
                            {/* Empty contact */}
                            <section className={styles['no-contact']}>
                                <p>Aucun message pour le moment.</p>
                            </section>
                        </>

                    )}
                </section>
            )}
        </>
    )
}