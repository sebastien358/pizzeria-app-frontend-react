'use client'

import styles from '@/features/pizzeria/components/reset-password/RequestPassword.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import {useAuthStore} from "@/store/auth";
import {setTimeout} from "node:timers";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import { z } from "zod"
import gsap from "gsap";

const schema = z.object({
    email: z.string().email({message: 'Email invalide'})
})

export default function RequestPassword() {

    const requestPassword = useAuthStore((state) => state.requestPassword)
    const error = useAuthStore((state) => state.error)
    const clearError = useAuthStore((state) => state.clearError)

    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm({
        resolver: zodResolver(schema)
    })

    const [successMessage, setSuccessMessage] = useState(null)

    const onSubmit = async (data) => {
        try {
            displaySuccessMessage()
            await requestPassword(data)
        } catch(err) {
            displayErrorMessage()
            throw err
        }
    }

    const displaySuccessMessage = () => {
        setSuccessMessage('Un email vous a été envoyé')
        setTimeout(() => {
            setSuccessMessage(null)
            reset()
        }, 2000)
    }

    const displayErrorMessage = () => {
        setSuccessMessage(null)
        setTimeout(() => {
            clearError()
        }, 2000)
    }

    const resetPasswordRef = useRef(null)
    const resetPasswordFormRef = useRef(null)

    const registerGsap = () => {
        if (!resetPasswordRef.current) return

        gsap.from(resetPasswordFormRef.current, {opacity: 0, y: 40, duration: 0.8, ease: 'power3.out'})
    }

    useEffect(() => {
        const ctx = gsap.context(() => {
            registerGsap()
        })

        return () => ctx.revert()
    }, [])

    return (
        <div className={styles.request} ref={resetPasswordRef}>
            <div className={styles.request__container} ref={resetPasswordFormRef}>
                <div className={styles.request__icon}>
                    <FontAwesomeIcon icon={faLock} />
                </div>
                <h2 className={styles.request__title}>Mot de passe oublié ?</h2>
                <p className={styles.request__subtitle}>
                    Entrez votre adresse e-mail et nous vous enverrons un lien de réinitialisation.
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className={styles['request__form']}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Adresse e-mail</label>
                        <div className={styles.inputWrap}>
                            <input {...register('email')} placeholder="vous@exemple.com"/>
                            {errors.email && <span className={styles.errorField}>{errors.email.message}</span>}
                        </div>
                    </div>

                    {successMessage && <p className={styles['success-message']}>{successMessage}</p>}

                    {error && <p className={styles['error-message']}>{error}</p>}

                    <button className={styles.btnPrimary} disabled={isSubmitting}>
                        {isSubmitting ? 'Chargement...' : 'Réinitialiser le mot de passe'}
                    </button>

                    <Link href="/login" className={styles.request__back}>Retour à la connexion</Link>
                </form>
            </div>
        </div>
    )
}