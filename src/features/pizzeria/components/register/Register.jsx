'use client'

import styles from './Register.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {useEffect, useRef, useState} from "react"
import Link from "next/link"
import z from 'zod'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import {useAuthStore} from "@/store/auth";
import gsap from "gsap";
config.autoAddCss = false

export default function Register() {

    const { registerUser, error, clearError } = useAuthStore()

    const [ successMessage, setSuccessMessage ] = useState(null)

    const schema = z.object({
        email: z
            .string()
            .email({ message: 'Veuillez saisir une adresse e-mail valide' }),
        password: z
            .string()
            .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
        passwordConfirm: z
            .string()
            .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    }).refine((value) => value.passwordConfirm === value.password, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['passwordConfirm']
    })

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema)
    })

    const onSubmit = async (data) => {
        try {
            await registerUser(data)
            setSuccessMessage('Compte créé avec succès !')
            handleResetForm()
        } catch (err) {
            displayError()
            throw err
        }
    }

    const handleResetForm = () => {
        setTimeout(() => {
            setSuccessMessage(null)
            reset()
        }, 2000)
    }

    const displayError = () => {
        setTimeout(() => {
            clearError()
        }, 2000)
    }

    const registerRef = useRef(null)
    const registerFormRef = useRef(null)

    const registerGsap = () => {
        if (!registerRef.current) return

        gsap.from(registerFormRef.current, {opacity: 0, y: 40, duration: 0.8, ease: 'power3.out'})
    }

    useEffect(() => {
        const ctx = gsap.context(() => {
            registerGsap()
        })

        return () => ctx.revert()
    }, [])

    return (
        <div className={styles['register']} ref={registerRef}>
            <div className={styles['register__container']} ref={registerFormRef}>

                <h2 className={styles['register__title']}>Créer un compte</h2>
                <p className={styles['register__subtitle']}>Rejoignez-nous et commandez vos pizzas en ligne.</p>

                <form onSubmit={handleSubmit(onSubmit)} className={styles['register__form']}>

                    <div className={styles['form-group']}>
                        <label htmlFor="email">Email</label>
                        <div className={styles['input-wrap']}>
                            <label htmlFor='Votre email'></label>
                            <FontAwesomeIcon icon={faUser}/>
                            <input {...register('email')} type="email" id="email" placeholder="Email" />
                        </div>
                        {errors.email && <span className={styles['error-field']}>{errors.email.message}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="password">Mot de passe</label>
                        <div className={styles['input-wrap']}>
                            <FontAwesomeIcon icon={faLock} />
                            <input {...register('password')} type="password" id="password" placeholder="••••••••" />
                        </div>
                        {errors.password && <span className={styles['error-field']}>{errors.password.message}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="password">Confirmation de mot de passe</label>
                        <div className={styles['input-wrap']}>
                            <FontAwesomeIcon icon={faLock} />
                            <input {...register('passwordConfirm')} type="password" id="password" placeholder="••••••••" />
                        </div>
                        {errors.passwordConfirm && <span className={styles['error-field']}>{errors.passwordConfirm.message}</span>}
                    </div>

                    {successMessage && <span className={styles['success-message']}>{successMessage}</span>}

                    {error && <span className={styles['error-message']}>{error}</span>}

                    <button type="submit" className={styles['btn-primary']} disabled={isSubmitting}>
                        {isSubmitting ? 'Chargement...' : 'Créer mon compte'}
                    </button>

                    <p className={styles['register__login']}>
                        Déjà un compte ?{' '}
                        <Link href="/login">Se connecter</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}