'use client'
import styles from '@/features/pizzeria/components/contact/Contact.module.scss'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { z } from "zod";
import {useEffect, useRef, useState} from "react";
import {useContactStore} from "@/store/contact";
import {usePathname} from "next/navigation";
import gsap from 'gsap'

const schema = z.object({
    firstname: z
        .string()
        .trim()
        .min(1, { message: 'Veuillez renseigner votre prénom.' })
        .max(70, { message: 'Le prénom ne peut pas dépasser 70 caractères.' }),
    lastname: z
        .string()
        .trim()
        .min(1, { message: 'Veuillez renseigner votre nom.' })
        .max(70, { message: 'Le nom ne peut pas dépasser 70 caractères.' }),
    email: z
        .string({ message: 'Veuillez renseigner votre adresse email.' })
        .trim()
        .email({ message: 'Veuillez renseigner une adresse email valide.' }),
    message: z
        .string({ message: 'Veuillez renseigner votre message.' })
        .trim()
        .min(1, { message: 'Veuillez renseigner votre message.' })
        .min(10, { message: 'Le message doit contenir au moins 10 caractères.' })
        .max(1500, { message: 'Le message ne peut pas dépasser 500 caractères.' })
})

export default function Contact() {
    const { register, handleSubmit, reset, formState: {isSubmitting, errors} } = useForm({
        resolver: zodResolver(schema)
    })

    const [ success, setSuccess ] = useState(null)

    const handleReset = () => {
        setTimeout(() => {
            setSuccess(null)
            reset()
        }, 2000)
    }

    const { addContact, error, clearError } = useContactStore()

    const displayError = () => {
        setTimeout(() => {
            clearError()
        }, 2000)
    }

    const onSubmit = async (data) => {
        try {
            setSuccess(null)
            await addContact(data)
            setSuccess('Votre message a bien été envoyé.')
            handleReset()
        } catch(err) {
            displayError()
            throw err
        }
    }

    {/* Contact Form GSAP */}

    const contactRef = useRef(null)
    const contactFormRef = useRef(null)
    const contactInfoRef = useRef(null)

    const contactGsap = () => {
        if (!contactRef.current) return

        const desktop = window.innerWidth >= 768

        gsap.from(contactFormRef.current, {opacity: 0, x: desktop ? 100 : 40, duration: 0.6, ease: 'power3.out'})
        gsap.from(contactInfoRef.current, {opacity: 0, x: desktop ? -100 : 40, duration: 0.6, ease: 'power3.out'})
    }

    const pathname = usePathname()

    useEffect(() => {
        const ctx = gsap.context(() => {
            contactGsap()
        })

        return () => ctx.revert()
    }, [pathname])

    return (
        <main className={styles.contact} ref={contactRef}>
            <div className={styles.contact__container}>
                <section className={styles.contact__form} ref={contactFormRef}>
                    <h2 className={styles.contact__title}>Contactez-nous</h2>
                    <p className={styles.contact__subtitle}>Une question ?</p>
                    {/* form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.formGroup}>
                            <input {...register('firstname')} placeholder="Prénom" />
                            {errors.firstname && <span className={styles.errorField}>{errors.firstname.message}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <input {...register('lastname')} placeholder="Nom" />
                            {errors.lastname && <span className={styles.errorField}>{errors.lastname.message}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <input {...register('email')} placeholder="Email" />
                            {errors.email && <span className={styles.errorField}>{errors.email.message}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <textarea {...register('message')} placeholder="Votre message..." />
                            {errors.message && <span className={styles.errorField}>{errors.message.message}</span>}
                        </div>
                        {/* success message */}
                        <p className={styles.successMessage}>{success}</p>
                        {/* error message */}
                        {error && <p className={styles.errorMessage}>{error}</p>}
                        <div className={styles.formSubmit}>
                            <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
                                {isSubmitting ? 'Chargement...' : 'Soumettre'}
                            </button>
                        </div>
                    </form>
                </section>
                {/* info */}
                <section className={styles.contact__info} ref={contactInfoRef}>
                    <h3>La pizzéria</h3>
                    <p className={styles.contact__address}>
                        18 rue de la Sérénité <br />
                        75003 Paris
                    </p>
                    <ul className={styles.contact__hours}>
                        <li>🕒 Lun – Ven : 9h – 20h</li>
                        <li>🕒 Samedi : 9h – 20h</li>
                    </ul>
                    <p className={styles.contact__phone}>📞 01 23 45 67 89</p>
                    <p className={styles.contact__mail}>✉️ contact@pizzeria.fr</p>
                    <div className={styles.contact__badges}>
                        <span className={styles.badgeGreen}>Réponse sous 24h</span>
                        <span className={styles.badgeYellow}>🍕 Commande en ligne 7j/7</span>
                    </div>
                    {/* iframe */}
                    <div className={styles.contact__map}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12294.319109934564!2d-0.24133006287153588!3d49.28515163344128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x480a6156d5655ba5%3A0x1eb3a9d9ae79f46a!2sPlage%20de%20Ouistreham!5e0!3m2!1sfr!2sfr!4v1765478462795!5m2!1sfr!2sfr"
                            width="400"
                            height="300"
                            style={{border: 0}}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </section>
            </div>
        </main>
    )
}