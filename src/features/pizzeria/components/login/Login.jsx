'use client'

import { z } from "zod";
import {useState} from "react";
import {useRouter} from "next/navigation";
import styles from './Login.module.scss'
import Link from "next/link";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuthStore} from "@/store/auth";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLock, faUser} from "@fortawesome/free-solid-svg-icons";
config.autoAddCss = false

const schema = z.object({
    email: z.string()
        .email({ message: 'Email invalide' }),
    password: z.string()
        .min(1, { message: 'Mot de passe requis' })
        .min(6, { message: '6 caractères minimum' })
        .max(50, { message: '50 caractères maximum' })
})

export default function Login() {
    const { login, emailExisting, error, clearError } = useAuthStore()

    const displayError = (email = '') => {
        emailExisting(email)
        setTimeout(() => {
            clearError()
        }, 2000)
    }

    const [ success, setSuccess ] = useState(null)

    const handleReset = () => {
        setSuccess('Connexion réussie !')
        setTimeout(() => {
            reset()
            router.push('/')
        }, 2000)
    }

    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm({
        resolver: zodResolver(schema)
    })

    const router = useRouter()

    const onSubmit = async (data) => {
        setSuccess(null)
        try {
            await login(data)
            handleReset()
        } catch (err) {
            displayError(data.email)
            throw err
        }
    }

    return (
        <section className={styles.login}>
            <div className={styles.login__container}>
                <h2 className={styles.login__title}>Connexion</h2>
                {/* form */}
                <form onSubmit={handleSubmit(onSubmit)} className={styles.login__form}>
                    <div className={styles.formGroup}>
                        <div className={styles['input-wrap']}>
                            <label htmlFor='Votre email'>Email</label>
                            <FontAwesomeIcon icon={faUser}/>
                            <input {...register('email')} placeholder='Email' />
                        </div>
                        {errors.email && <span className={styles.errorField}>{errors.email.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <div className={styles['input-wrap']}>
                            <label htmlFor="password">Mot de passe</label>
                            <FontAwesomeIcon icon={faLock} />
                            <input type="password" {...register('password')} placeholder='Mot de passe' />
                        </div>

                        {errors.password && <span className={styles.errorField}>{errors.password.message}</span>}

                        <div className={ styles.login__forgot }>
                            <Link href="/request">Mot de passe oublié ?</Link>
                        </div>
                    </div>

                    {/* success */}
                    {success && <p className={styles.successMessage}>{success}</p>}

                    {/* error */}
                    {error && <p className={styles.errorMessage}>{error}</p>}

                    {/* button */}
                    <button disabled={isSubmitting} className={styles.btnPrimary}>
                        {isSubmitting ? 'Chargement...' : 'Soumettre'}
                    </button>
                </form>
            </div>
        </section>
    )
}