'use client';

import Link from 'next/link';
import { useCommandUser } from '@/store/user/commandUser';
import Pagination from '@/components/pagination/Pagination';
import notFound from '@/assets/images/not-found.webp'
import styles from './CommandUserList.module.scss';
import ModalConfirm from "@/modal/modal-confirm/ModalConfirm";
import {useEffect, useState} from "react";
import Image from "next/image";

export default function CommandUserList() {

    const { commandUserList, commands, deleteCommand, loading, currentPage, pages, previousPage, nextPage } = useCommandUser()

    const [ openModalConfirm, setOpenModalConfirm ] = useState<boolean>(false)

    const [ commandId, setCommandId ] = useState<number | null>(null)

    const onClickOpenModal = (id: number) => {
        setOpenModalConfirm(true)
        setCommandId(id)
    }

    const onClickCloseModalConfirm = () => {
        setOpenModalConfirm(false)
    }

    const onClickDelete = async () => {
        if (commandId === null) return
        await deleteCommand(commandId)
        setOpenModalConfirm(false)
    }

    useEffect(() => {
        commandUserList()
    }, []);

    const formatedDate = (date: string) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const paymentStatus = (command: any) => {
        return command.status === 'Payé' ? styles['status--success'] : styles['status--pending'];
    };

    const selectedPreparationStatus = (command: any) => {
        switch (command.preparationStatus) {
            case 'Terminé':
                return styles['status--success'];
            case 'En cours':
                return styles['status--warning'];
            default:
                return styles['status--pending'];
        }
    };

    const statusCommandPaid = (command: any) => {
        return command.status === 'Payé' ? styles['btn--disabled'] : '';
    };

    // Loading
    if (loading) {
        return (
            <section className={styles.spinner}>
                <span className={styles.loader}></span>
            </section>
        );
    }

    // Commandes client
    if (commands.length > 0) {
        return (
            <section className={styles['command-user']}>
                {commands.map((command: any) => (
                    <div key={command.id} className={styles['command-user__card']}>
                        {/* Items de la commande */}
                        {command.commandItems.map((item: any) => (
                            <div key={item.id} className={styles['command-user__item']}>
                                <div className={styles['command-user__image']}>
                                    {item.product.pictures?.length ? (
                                        <Image
                                            src={item.product.pictures[0].filename || notFound.src}
                                            className={styles['product-image']}
                                            alt="Produit"
                                            height={100}
                                            width={100}
                                        />
                                    ) : (
                                        <Image
                                            src={notFound.src}
                                            className={styles['product-image']}
                                            alt="Produit manquant"
                                            height={100}
                                            width={100}
                                        />
                                    )}
                                </div>
                                <div className={styles['item-info']}>
                                    <h3>{item.title}</h3>
                                    <p>📅 : {formatedDate(command.createdAt)}</p>
                                    <p>💰 : {item.price} €</p>
                                    <p>🚚 : {command.deliveryType}</p>
                                    <p>🔢 : {item.quantity}</p>
                                </div>
                            </div>
                        ))}

                        {/* Statut commande */}
                        <div className={styles['command-user__status']}>
                            <p>
                                Paiement :{' '}
                                <span className={paymentStatus(command)}>{command.status}</span>
                            </p>
                            <p>
                                Préparation commande :{' '}
                                <span className={selectedPreparationStatus(command)}>{command.preparationStatus}</span>
                            </p>
                        </div>

                        {/* Boutons */}
                        <div className={styles['command-user__buttons']}>
                            <Link
                                href={`/user/payment/${command.id}`}
                                className={`${styles.btn} ${styles['btn-command-paid']} ${statusCommandPaid(command)}`}
                            >
                                Payé la commande
                            </Link>
                            <button
                                onClick={() => onClickOpenModal(command.id)}
                                className={`${styles.btn} ${styles['btn-delete']} ${statusCommandPaid(command)}`}
                            >
                                Supprimer
                            </button>
                        </div>
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
            </section>
        );
    }

    // Aucune commande
    return (
        <section className={styles['no-command']}>
            <p>Aucune commande pour le moment.</p>
        </section>
    );
}