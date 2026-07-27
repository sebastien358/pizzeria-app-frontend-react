'use client'

import styles from './AccountAdmin.module.scss'
import {useAccountAdminStore} from "@/store/admin/accountAdmin";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import { z } from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";

export default function AccountAdmin() {

    const { accountAdminDetails, accountAdminEdit, clearError, loading, user, error } = useAccountAdminStore()

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

    const {register, handleSubmit, reset, formState: {isSubmitting, errors}} = useForm({
        resolver: zodResolver(schema)
    })

    useEffect(() => {
        accountAdminDetails()
    }, []);

    useEffect(() => {
        if (user?.email) {
            reset({
                email: user.email,
                password: ''
            })
        }
    }, [user, reset]);

    const [ successMessage, setSuccessMessage ] = useState<string | null>(null)

    const onSubmit = async (dataAdmin) => {
        try {
            const data = {
                email: dataAdmin.email,
                password: dataAdmin.password
            }
            await accountAdminEdit(user.id, data)
            displaySuccessMessage()
        } catch(err) {
            displayErrorMessage()
            throw err
        }
    }

    const displaySuccessMessage = () => {
        setSuccessMessage('La modification des données a réussie')
        setTimeout(() => {
            setSuccessMessage(null)
        }, 2000)
    }

    const displayErrorMessage = () => {
        setTimeout(() => {
            clearError()
        }, 2000)
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
                                    <input {...register('email')} type={"email"} disabled={true} />
                                    {errors && <p className={styles['error-field']}>{errors.email?.message}</p>}
                                </div>

                                <div className={styles['form-group']}>
                                    <input {...register('password')} type={"password"} placeholder="••••••••" />
                                    {errors && <p className={styles['error-field']}>{errors.password?.message}</p>}
                                </div>

                                <div className={styles['form-group']}>
                                    <input {...register('passwordConfirm')} type={"password"} placeholder="••••••••" />
                                    {errors && <p className={styles['error-field']}>{errors.passwordConfirm?.message}</p>}
                                </div>

                                {/* Gestion messages de validation */}

                                {error && <p className={styles['error-message']}>{error}</p>}

                                {successMessage && <p className={styles['success-message']}>{successMessage}</p>}

                                {/* Bouton de soumission */}
                                <button type={'submit'} className={`${styles['btn']} ${styles['btn-primary']}`} disabled={isSubmitting}>
                                    {isSubmitting ? 'Chargement...' : 'Soumettre'}
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            )}
        </>
    )
}
