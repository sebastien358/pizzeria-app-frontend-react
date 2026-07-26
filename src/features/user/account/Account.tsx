'use client'

import styles from './Account.module.scss'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { z } from 'zod'
import {useEffect, useState} from "react";
import {useAccountUserStore} from "@/store/user/accountUser";

export default function Account() {

    const { accountUserDetails, accountUserEdit, clearError, user, error } = useAccountUserStore()

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
            reset(user)
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

    return (
        <div className={styles['page']}>
            <div className={styles['account-user']}>
                <div className={styles['account-user__form']}>
                    <h3>Modifier mes données</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles['form-group']}>
                            <input {...register('email')} type={"email"} placeholder="Email" />
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
            </div>
        </div>
    )
}