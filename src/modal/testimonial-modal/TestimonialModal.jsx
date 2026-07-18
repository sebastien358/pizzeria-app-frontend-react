'use client'

import {useTestimonial} from "@/store/testimonial";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import styles from './TestimonialModal.module.scss'
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import z from 'zod'

export default function TestimonialModal({ openModal, closeModal }) {

    const { addTestimonial, error, clearError } = useTestimonial()

    const [ success, setSuccess ] = useState(null)

    useEffect(() => {
        document.body.style.overflow = openModal ? 'hidden' : 'auto'
    }, [openModal])

    const MAX_FILE_TYPE = ['image/jpeg', 'image/png', 'image/webp']
    const MAX_FILE_SIZE = 5 * 1024 * 1024

    const schema = z.object({
        firstname: z
            .string().min(3, { message: 'Le prénom doit contenir au moins 3 caractères' }),
        lastname: z
            .string().min(3, { message: 'Le nom doit contenir au moins 3 caractères' }),
        rating: z.coerce
            .number({ message: 'Veuillez sélectionner une note' })
            .min(1, { message: 'Veuillez sélectionner une note' })
            .max(5, { message: 'La note maximum est 5' }),
        message: z
            .string().min(30, { message: 'Votre message doit contenir au moins 30 caractères' }),
        image: z
            .any()
            .nullable()
            .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
                message: 'L\'image ne doit pas dépasser 5 Mo'
            })
            .refine((file) => !file || MAX_FILE_TYPE.includes(file.type), {
                message: 'Format accepté : JPEG, PNG ou WEBP'
            })
    })

    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })

    const [ filename, setFilename ] = useState(null)

    const onChangeImage = (file) => {
        const selectedFile = file[0]
        setFilename(selectedFile?.name)
        setValue('image', selectedFile, { shouldValidate: true })
    }

    const onSubmit = async (data) => {
        try {
            await addTestimonial(data)
            setSuccess('Le témoignage a bien été envoyé ✨')
            handleReset()
        } catch(err) {
            handleError()
            throw err
        }
    }

    const handleReset = () => {
        setTimeout(() => {
            closeModal()
            setSuccess(null)
            setFilename(null)
            reset()
        }, 2000)
    }

    const handleError = () => {
        setTimeout(() => {
            clearError()
        }, 2000)
    }

    return (
        <>
            {openModal && (
                <section className={styles['modal-testimonial']}>
                    <div className={styles['modal-testimonial__container']}>
                        <div className={styles['modal-testimonial__close']} onClick={() => closeModal()}>
                            <FontAwesomeIcon icon={faXmark} />
                        </div>

                        <h3>Laisser votre avis</h3>

                        <form onSubmit={handleSubmit(onSubmit)} className={styles['modal-testimonial__form']}>

                            <div className={styles['form-group']}>
                                <input {...register('firstname')} type={'text'} placeholder={"Votre prénom"} />
                                {errors.firstname && <span className={styles['error-fields']}>{errors.firstname.message}</span>}
                            </div>

                            <div className={styles['form-group']}>
                                <input {...register('lastname')} type={'text'} placeholder={"Votre nom"}/>
                                {errors.lastname && <span className={styles['error-fields']}>{errors.lastname.message}</span>}
                            </div>

                            <div className={styles['form-group']}>
                                <div className={styles['input-select']}>
                                    <select {...register('rating')} defaultValue="">
                                        <option value="" disabled>Notez votre expérience</option>
                                        <option value="5">★★★★★ 5 étoiles</option>
                                        <option value="4">★★★★☆ 4 étoiles</option>
                                        <option value="3">★★★☆☆ 3 étoiles</option>
                                        <option value="2">★★☆☆☆ 2 étoiles</option>
                                        <option value="1">★☆☆☆☆ 1 étoile</option>
                                    </select>
                                </div>
                                {errors.rating && <span className={styles['error-fields']}>{errors.rating.message}</span>}
                            </div>

                            <div className={styles['form-group']}>
                                <textarea {...register('message')} placeholder={"Votre message..."}></textarea>
                                {errors.message && <span className={styles['error-fields']}>{errors.message.message}</span>}
                            </div>

                            <div className={styles['form-group']}>
                                <div className={styles['input-file']}>
                                    <label className={styles['input-file__label']}>
                                        <input type={'file'} className={styles['input-file__input']} onChange={(e) => onChangeImage(e.target.files)}/>
                                        <span>{filename || '📎 Choisir une photo'}</span>
                                    </label>
                                </div>
                            </div>

                            {success && <p className={styles['success-message']}>{success}</p>}

                            {error && <p className={styles['error-message']}>{error}</p>}

                            <div className={styles['modal-testimonial__button']}>
                                <button type="submit" className={`${styles.btn} ${styles['btn-testimonial']}`} disabled={isSubmitting}>
                                    {isSubmitting ? 'Chargement...' : 'Soumettre'}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            )}
        </>
    )
}