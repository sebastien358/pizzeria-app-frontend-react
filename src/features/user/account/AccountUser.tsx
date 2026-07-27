'use client'

import styles from './AccountUser.module.scss'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { z } from 'zod'
import {useEffect, useState} from "react";
import {useAccountUserStore} from "@/store/user/accountUser";
import ModalConfirm from "@/modal/modal-confirm/ModalConfirm";
import {useRouter} from "next/navigation";

export default function AccountUser() {

    const { accountUserDetails, accountUserEdit, accountDeleteUser, clearError, loading, user, error } = useAccountUserStore()

    const schema = z.object({
        email: z.string().email({ message: 'Email invalide' }),
        password: z.string()
            .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
            .max(50, { message: '50 caractères maximum' }),
        passwordConfirm: z.string()
            .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
            .max(50, { message: '50 caractères maximum' })

    }).refine((value) => value.password === value.passwordConfirm, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['passwordConfirm']
    })

    const { register, reset, handleSubmit, formState: { isSubmitting, errors } } = useForm({
        resolver: zodResolver(schema)
    })

    {/* Chargement des données utilisateur au montage */}

    useEffect(() => {
        accountUserDetails()
    }, [])

    {/* Récupération des données utilisateur */}

    useEffect(() => {
        if (user?.email) {
            reset({
                email: user.email,
                password: ''
            })
        }
    }, [user, reset]);

    const [ successMessage, setSuccessMessage ] = useState<string | null>(null)

    {/* Données de soumission du formulaire */}

    const onSubmit = async (dataUser: {email: string, password: string, passwordConfirm: string }) => {
        try {
            const data = {
                email: dataUser.email,
                password: dataUser.password,
            }
            await accountUserEdit(user.id, data)
            displaySuccessMessage()
        } catch(err) {
            displayErrorMessage()
            throw err
        }
    }

    {/* Message de confirmation */}

    function displaySuccessMessage() {
        setSuccessMessage('Les données ont été modifiées')
        setTimeout(() => {
            setSuccessMessage(null)
        }, 2000)
    }

    function displayErrorMessage() {
        setTimeout(() => {
            clearError()
        }, 2000)
    }

    {/* Gestion modal */}

    const [ openModalConfirm, setOpenModalConfirm ] = useState(false)

    const onClickOpenModalConfirm = () => {
        setOpenModalConfirm(true)
    }

    const onClickCloseModalConfirm = () => {
        setOpenModalConfirm(false)
    }

    {/* Suppression du compte utilisateur */}

    const router = useRouter()

    const onClickDelete = async () => {
        if (!user) return
        accountDeleteUser()
        router.push('/')
    }

    return (
        <>
            {loading ? (
                <section className={styles['spinner']}>
                    <div className={styles['spinner__loader']}></div>
                </section>
            ) : (
                <div className={styles['page']}>
                    <section className={styles['account-user']}>
                        <div className={styles['account-user__form']}>
                            <h3>Modifier mon mot de passe</h3>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={styles['form-group']}>
                                    <input {...register('email')} type={"email"} placeholder="Email" disabled={true} />
                                    {errors.email && <span className={styles['error-field']}>{errors.email?.message}</span>}
                                </div>

                                <div className={styles['form-group']}>
                                    <input {...register('password')} type={"password"} placeholder="••••••••" />
                                    {errors.password && <span className={styles['error-field']}>{errors.password?.message}</span>}
                                </div>

                                <div className={styles['form-group']}>
                                    <input {...register('passwordConfirm')} type={"password"} placeholder="••••••••" />
                                    {errors.passwordConfirm && <span className={styles['error-field']}>{errors.passwordConfirm?.message}</span>}
                                </div>

                                {/* Gestion messages de validation */}

                                {error && <p className={styles['error-field']}>{error}</p>}

                                {successMessage && <p className={styles['success-message']}>{successMessage}</p>}

                                {/* Bouton de soumission */}
                                <button type={'submit'} className={`${styles['btn']} ${styles['btn-primary']}`} disabled={isSubmitting}>
                                    {isSubmitting ? 'Chargement...' : 'Soumettre'}
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* Suppression du compte utilisateur  */}

                    <section className={styles['account-delete']}>
                        <p className={styles['account-delete__title']}>Zone de danger</p>
                        <p className={styles['account-delete__text']}>La suppression de votre compte est irréversible.</p>
                        <button
                            type="button"
                            onClick={() => onClickOpenModalConfirm()}
                            className={styles['btn-remove-account']}
                        >
                            Supprimer mon compte
                        </button>
                    </section>

                    <ModalConfirm
                        openModalConfirm={openModalConfirm}
                        onClickCloseModalConfirm={onClickCloseModalConfirm}
                        onClickDelete={onClickDelete}
                    />
                </div>
            )}
        </>
    )
}