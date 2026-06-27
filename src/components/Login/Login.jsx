'use client'
import { useAuthStore } from "@/store/auth";
import { z } from "zod";
import {useState} from "react";
import {useRouter} from "next/navigation";
import styles from '@/components/Login/Login.module.scss'
import Link from "next/link";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const schema = z.object({
    email: z.string()
        .email({ message: 'Email invalide' }),
    password: z.string()
        .min(1, { message: 'Mot de passe requis' })
        .min(6, { message: '6 caractères minimum' })
})


export default function Login() {
    const { login, loading, error } = useAuthStore()

    const [ success, setSuccess ] = useState(null)

    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm({
        resolver: zodResolver(schema)
    })

    const router = useRouter()

    const onSubmit = async (data) => {
        setSuccess(null)
        try {
            //await login(data)
            setSuccess('Connexion réussie !')
            setTimeout(() => {
                reset()
                router.push('/')
            }, 2000)
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    return (
        <section className={styles.login}>
            <div className={styles.login__container}>
                <h2 className={styles.login__title}>Connexion</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.login__form}>
                    <div className={styles.formGroup}>
                        <input {...register('email')} />
                        {errors.email && <span>{errors.email.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <input type="password" {...register('password')} />
                        {errors.email && <span>{errors.email.message}</span>}
                    </div>

                    <p className={styles.success}>{success}</p>

                    <div className={ styles.login__forgot }>
                        <Link href="/request">Mot de passe oublié ?</Link>
                    </div>

                    <button disabled={isSubmitting} className={styles.btnPrimary}>
                        {isSubmitting ? 'Chargement...' : 'Soumettre'}
                    </button>
                </form>
            </div>
        </section>
    )
}