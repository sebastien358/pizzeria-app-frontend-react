'use client'
import styles from '@/components/Request/Request.module.scss'
import Link from "next/link";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation"
import { z } from "zod"
import {useState} from "react";

const schema = z.object({
    email: z.string().email({message: 'Email invalide'})
})

export default function Request() {
    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm({
        resolver: zodResolver(schema)
    })

    const [success, settSuccess] = useState(null)

    const onSubmit = async (data) => {
        settSuccess('cycyccchchgcghchgcghcghc')
        console.log(data)
    }

    return (
        <div className={styles.request}>
            <div className={styles.request__container}>
                <div className={styles.request__icon}>
                    <font-awesome-icon icon="fa-solid fa-lock"/>
                </div>
                <h2 className={styles.request__title}>Mot de passe oublié ?</h2>
                <p className={styles.request__subtitle}>
                    Entrez votre adresse e-mail et nous vous enverrons un lien de réinitialisation.
                </p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.formGroup}>
                        <label for="email">Adresse e-mail</label>
                        <div className={styles.inputWrap}>
                            <input {...register('email')} placeholder="vous@exemple.com"/>
                            {errors.email && <span className={styles.errorField}>{errors.email.message}</span>}
                        </div>
                        <p className="errorField"></p>
                    </div>

                    <p className={styles.success}>{success}</p>

                    <button className={styles.btnPrimary} disabled={isSubmitting}>
                        {isSubmitting ? 'Chargement...' : 'Réinitialiser le mot de passe'}
                    </button>

                    <Link href="/login" className={styles.request__back}>Retour à la connexion</Link>
                </form>
            </div>
        </div>
    )
}