'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import styles from './ResetPassword.module.scss'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import Link from "next/link";
import { z } from "zod"
import {useAuthStore} from "@/store/auth";
import {setTimeout} from "node:timers";
import {useRouter} from "next/navigation";

const schema = z.object({
    password: z.string().min(1, { message: 'Veuillez renseigner un mot de passe' }),
    confirmPassword: z.string().min(1, { message: 'Veuillez renseigner la confirmation de mot de passe' })
}).refine((value) => value.password === value.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
})

export function ResetPassword({ token }: { token: string }) {

    const resetPassword = useAuthStore((state) => state.resetPassword)
    const error = useAuthStore((state) => state.error)
    const clearError = useAuthStore((state) => state.clearError)

    const router = useRouter()

    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm({
        resolver: zodResolver(schema)
    })

    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    {/* Validation du formulaire  */}

    type ResetPasswordFormData = z.infer<typeof schema>

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            displaySuccessMessage()
            await resetPassword(data, token)
        } catch (err) {
            displayErrorMessage()
            throw err
        }
    }

    {/* Affichage du message de validation  */}

    const displaySuccessMessage = () => {
        setSuccessMessage('Le mot de passe a été modifié.')
        setTimeout(() => {
            router.push('/login')
            setSuccessMessage(null)
            reset()
        }, 2000)
    }

    {/* Affichage de l'erreur de la validation du formulaire */}

    const displayErrorMessage = () => {
        setSuccessMessage(null)
        setTimeout(() => {
            clearError()
        }, 2000)
    }

    return (
        <div className={styles.reset}>
            <div className={styles.reset__container}>
                <div className={styles.reset__icon}>
                    <FontAwesomeIcon icon={faLock} />
                </div>
                <h2 className={styles.reset__title}>Mot de passe oublié ?</h2>
                <p className={styles.reset__subtitle}>
                    Entrez votre adresse e-mail et nous vous enverrons un lien de réinitialisation.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className={styles['reset__form']}>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Mot de passe</label>
                        <div className={styles.inputWrap}>
                            <input {...register('password')} placeholder="••••••••" />
                            {errors.password && <span className={styles.errorField}>{errors.password.message}</span>}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirmation du mot de passe</label>
                        <div className={styles.inputWrap}>
                            <input {...register('confirmPassword')} placeholder="••••••••" />
                            {errors.confirmPassword && <span className={styles.errorField}>{errors.confirmPassword.message}</span>}
                        </div>
                    </div>

                    {successMessage && <p className={styles['success-message']}>{successMessage}</p>}

                    {error && <p className={styles['error-message']}>{error}</p>}

                    <button className={styles.btnPrimary} disabled={isSubmitting}>
                        {isSubmitting ? 'Chargement...' : 'Réinitialiser le mot de passe'}
                    </button>

                    {/* Lien de redirection login */}
                    <Link href="/login" className={styles.reset__back}>Retour à la connexion</Link>
                </form>
            </div>
        </div>
    )
}