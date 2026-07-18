'use client'

import styles from './CommandAdminList.module.scss'
import ModalConfirm from "@/modal/modal-confirm/ModalConfirm";
import InputSearch from "@/components/input-search/InputSearch";
import {useCommandAdminStore} from "@/store/admin/commandAdmin";
import notFound from '@/assets/images/not-found.webp'
import {useEffect, useState} from "react";
import Image from "next/image";
import Pagination from "@/components/pagination/Pagination";

export default function CommandAdminList() {
    const {
        commandAdminList,
        nextPage,
        previousPage,
        commandAdminSearch,
        commandAdminIsRead,
        commandAdminPreparationStatus,
        commandAdminDelete,
        commands,
        loading,
        term,
        currentPage,
        pages,
        countCommandsUnread,
    } = useCommandAdminStore()

    useEffect(() => {
        commandAdminList()
    }, [])

    const paymentStatus = (command) => {
        switch (command.status) {
            case 'En attente':
                return 'status-pending'
            case 'Payé':
                return 'status-paid'
            case 'Échouée':
                return 'status-failed'
            case 'Annulée':
                return 'status-cancelled'
            default:
                return ''
        }
    }

    const selectedPreparationStatus = () => {}

    const onClickSelectedPreparation = async (id, event) => {
        await commandAdminPreparationStatus(id, event.target.value)
    }

    {/* Statut de la commande : (vu, non vu) */}

    const activeIsRead = async (id) => {
        await commandAdminIsRead(id)
    }

    {/* Statut Modal */}

    const [ openModalConfirm, setOpenModalConfirm ] = useState(false)

    {/* Récupération de l'ID de la commande */}

    const [ commandId, setCommandId ] = useState(null)

    {/* Open Modal */}

    const onClickOpenModal = async (id) => {
        setOpenModalConfirm(true)
        setCommandId(id)
    }

    {/* Suppression de la commande */}

    const onClickDelete = async () => {
        await commandAdminDelete(commandId)
        setOpenModalConfirm(false)
    }

    {/* Close Modal */}

    const onClickCloseModalConfirm = () => {
        setOpenModalConfirm(false)
    }

    {/* Date */}

    const formatedAt = (date) => {
        if (!date) return
        const d = new Date(date)
        return Intl.DateTimeFormat().format(d)
    }

    return (
        <>
            {loading ? (
                <section className={styles.spinner}>
                    <span className={styles.loader}></span>
                </section>
            ) : (
                <section className={styles.page}>

                    {/* Input Search */}
                    <div className={styles['input-search']}>
                        <InputSearch
                            search={commandAdminSearch}
                            term={term}
                            count={countCommandsUnread}
                            activeSearch={'search-command-admin'}
                            placeholder={'Rechercher une commande...'}
                        />
                    </div>

                    {/* Command client */}
                    {commands.length > 0 ? (
                        <div className={styles['command-admin']}>
                            {commands.map((command) => (
                                <div key={command.id} className={styles['command-admin__card']}>
                                    {/* Items de la commande */}
                                    {command.commandItems.map((item) => (
                                        <div key={item.id} className={styles['command-admin__item']}>
                                            <div className={styles['item-image']}>
                                                {item.product.pictures?.length ? (
                                                    <Image
                                                        src={item?.product?.pictures[0]?.filename}
                                                        className={styles['img-product']}
                                                        alt="Produit"
                                                        width={100}
                                                        height={100}
                                                    />
                                                ) : (
                                                    <Image
                                                        src={notFound}
                                                        className={styles['img-product']}
                                                        alt="Produit manquant"
                                                        width={100}
                                                        height={100}
                                                    />
                                                )}
                                            </div>
                                            <div className={styles['item-info']}>
                                                <h3>{item.title}</h3>
                                                <p>🚚 : {command.deliveryType}</p>
                                                <p>💰 : {command.total} €</p>
                                                <p>🔢 : {item.quantity}</p>
                                                <p>📅 {formatedAt(command.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Statut commande */}
                                    <div className={styles['command-admin__status']}>
                                        <p>
                                            Paiement :
                                            <span className={styles[paymentStatus(command)]}>
                                                {command.status}
                                            </span>
                                        </p>
                                        <p>
                                            Préparation de la commande :
                                            <span className={selectedPreparationStatus(command)}>
                                                {command.preparationStatus}
                                            </span>
                                        </p>
                                        <p><strong>Client : </strong>{command.firstName} {command.lastName}</p>
                                        <p><strong>Rue : </strong>{command.address}</p>
                                        <p><strong>Ville : </strong>{command.zipCode} {command.city}</p>
                                    </div>

                                    {/* Bouton préparation de la commande */}
                                    <div className={styles['command-admin__preparation__status']}>
                                        <select
                                            value={command.preparationStatus || ''}
                                            onChange={(event) => onClickSelectedPreparation(command.id, event)}
                                            name="preparation-status"
                                            className={styles['select-status']}
                                        >
                                            <option value="">- Status de la commande -</option>
                                            <option value="Annulée">Annulée</option>
                                            <option value="En cours">En cours</option>
                                            <option value="Expédié">Expédié</option>
                                            <option value="Livré">Livré</option>
                                        </select>
                                        <button
                                            type="button"
                                            className={`${styles.btn} ${styles['btn-is-read']} ${command.isRead ? styles['active-is-read'] : ''}`}
                                            onClick={() => activeIsRead(command.id)}
                                        >
                                            {command.isRead ? 'Vu ' : 'Marquer comme lu'}
                                        </button>
                                    </div>

                                    {/* Bouton supprimer commande */}
                                    {command.preparationStatus === 'Livré' && (
                                        <button
                                            onClick={() => onClickOpenModal(command.id)}
                                            className={styles['btn-delete']}
                                        >
                                            Supprimer
                                        </button>
                                    )}
                                </div>
                            ))}

                            {pages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    pages={pages}
                                    previousPage={previousPage}
                                    nextPage={nextPage}
                                />
                            )}

                            <ModalConfirm
                                openModalConfirm={openModalConfirm}
                                onClickCloseModalConfirm={onClickCloseModalConfirm}
                                onClickDelete={onClickDelete}
                            />
                        </div>
                    ) : (
                        <div className={styles['no-command']}>
                            <p>Aucune commande pour le moment.</p>
                        </div>
                    )}
                </section>
            )}
        </>
    )
}