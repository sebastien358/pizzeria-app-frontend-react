'use client'

import styles from './ClientAdminList.module.scss'
import {useClientAdminStore} from "@/store/admin/clientAdmin";
import {useEffect, useState} from "react";
import ModalConfirm from "@/modal/modal-confirm/ModalConfirm";
import {useAuthStore} from "@/store/auth";
import InputSearch from "@/components/input-search/InputSearch";
import Pagination from "@/components/pagination/Pagination";


export default function ClientAdminList() {

    const {
        clientAdminList,
        previousPage,
        nextPage,
        searchAdminClients,
        clientAdminIsRead,
        clientIsVisible,
        clientAdminDelete,
        term,
        currentPage,
        pages,
        loading,
        clients,
        countClients
    } = useClientAdminStore()

    const { userId } = useAuthStore()

    useEffect(() => {
        clientAdminList()
    }, []);

    const displayDate = (date: Date) => {
        if (!date) return
        const d = new Date(date)
        return Intl.DateTimeFormat('fr-FR').format(d)
    }

    {/* Afficher le client comme vu */}

    const onClickClientIsRead = async (id: number) => {
        clientAdminIsRead(id)
    }

    {/* Modal Confirmation de suppression */}

    const [ openModalConfirm, setOpenModalConfirm ] = useState<boolean>(false)

    const [ clientId, setClientId ] = useState<number | null>(null)

    const onClickOpenModal = (id: number) => {
        setOpenModalConfirm(true)
        setClientId(id)
    }

    {/* Fermeture de la modal */}

    const onClickCloseModalConfirm = () => {
        setOpenModalConfirm(false)
    }

    {/* Suppression client */}

    const onClickDelete = async () => {
        if (clientId === null) return
        clientAdminDelete(clientId)
        setOpenModalConfirm(false)
    }

    const onClickClientIsVisible = async (id: number) => {
        clientIsVisible(id)
    }

    return (
        <>
            {loading ? (
                <section className={styles['spinner']}>
                    <span className={styles['spinner__loader']}></span>
                </section>
            ) : clients.length > 0 ? (
                <section className={styles['page']}>
                    {/* Input Search */}
                    <div className={styles['input-search']}>
                        <InputSearch
                            search={searchAdminClients}
                            term={term}
                            count={countClients} activeSearch={'search-clients-admin'}
                            placeholder={'Rechercher un client...'}
                        />
                    </div>

                    {/* Clients */}
                    <div className={styles['client-list']}>
                        <div className={styles['table-wrapper']}>
                            <table className={styles['table']}> {/* <-- ICI IL MANQUAIT */}
                                <thead>
                                <tr>
                                    <th className={styles['col-id']}>#</th>
                                    <th className={styles['col-email']}>Email</th>
                                    <th className={styles['col-role']}>Rôle</th>
                                    <th className={styles['col-date']}>Inscrit le</th>
                                    <th className={styles['col-visible']}>Visible</th>
                                    <th className={styles['col-visible']}>Vu</th>
                                    <th className={styles['col-action']}></th>
                                </tr>
                                </thead>
                                <tbody>
                                {!clients.length ? (
                                    <tr>
                                        <td colSpan={7} className={styles['empty']}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                            Aucun client trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    clients.map((c: any) => (
                                        <tr className={styles['client-row']} key={c.id}>
                                            <td className={`${styles['col-id']} ${styles['text-muted']}`}>{c.id}</td>
                                            <td className={styles['col-email']}>
                                                <span className={styles['label']}>Email</span>
                                                <span>{c.email}</span>
                                            </td>
                                            <td className={styles['col-role']}>
                                                <span className={styles['label']}>Rôle</span>
                                                <span>{c.roles[0]}</span>
                                            </td>
                                            <td className={`${styles['col-date']} ${styles['text-muted']}`}>
                                                <span className={styles['label']}>Inscrit le</span>
                                                <span>{displayDate(c.createdAt)}</span>
                                            </td>
                                            <td className={styles['col-visible']} onClick={(e) => e.stopPropagation()}>
                                                <span className={styles['label']}>Visible</span>
                                                <label className={styles['toggle']}>
                                                    <input
                                                        type="checkbox"
                                                        checked={c.isVisible}
                                                        disabled={c.id === userId}
                                                        onClick={() => onClickClientIsVisible(c.id)}
                                                    />
                                                    <span className={styles['slider']}></span>
                                                </label>
                                            </td>
                                            <td className={`${styles['col-date']} ${styles['text-muted']}`}>
                                                <span className={styles['label']}>Vu</span>
                                                <label className={styles['toggle']}>
                                                    <input
                                                        type="checkbox"
                                                        checked={c.isRead}
                                                        disabled={c.id === userId}
                                                        onClick={() =>onClickClientIsRead(c.id)}
                                                    />
                                                    <span className={styles['slider']}></span>
                                                </label>
                                            </td>
                                            <td className={styles['col-action']}>
                                                <button
                                                    disabled={c.id === userId}
                                                    className={`${styles['action-btn']} ${styles['delete-btn']}`}
                                                    onClick={() => onClickOpenModal(c.id)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                        <path d="M3 6h18" />
                                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {pages > 1 && (
                        <div className={styles['pagination']}>
                            <Pagination
                                currentPage={currentPage}
                                pages={pages}
                                previousPage={previousPage}
                                nextPage={nextPage}
                            />
                        </div>
                    )}

                    <ModalConfirm
                        openModalConfirm={openModalConfirm}
                        onClickCloseModalConfirm={onClickCloseModalConfirm}
                        onClickDelete={onClickDelete}
                    />
                </section>


            ) : (
                <div className={styles['no-client']}>
                    <p>Aucun client pour le moment.</p>
                </div>
            )}
        </>
    )
}