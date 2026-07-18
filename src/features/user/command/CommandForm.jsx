'use client'

import styles from './CommandForm.module.scss'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from 'zod'
import {useCommandUser} from "@/store/user/commandUser";
import {useState} from "react";
import {router} from "next/client";
import {useRouter} from "next/navigation";

export default function CommandForm() {

    const { addCommand, clearErrorMessage, errorMessage } = useCommandUser()

    const [successMessage, setSuccessMessage] = useState(null)

    const router = useRouter()

    const schema = z.object({
        firstName: z
            .string()
            .min(1, { message: 'Le prénom est requis' })
            .min(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
            .max(50, { message: 'Le prénom ne doit pas dépasser 50 caractères' }),
        lastName: z
            .string()
            .min(1, { message: 'Le nom est requis' })
            .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
            .max(50, { message: 'Le nom ne doit pas dépasser 50 caractères' }),
        address: z
            .string()
            .min(1, { message: "L'adresse est requise" })
            .min(5, { message: "L'adresse doit contenir au moins 5 caractères" })
            .max(100, { message: "L'adresse ne doit pas dépasser 100 caractères" }),
        addressComplement: z
            .string()
            .max(100, { message: 'Le complément ne doit pas dépasser 100 caractères' })
            .optional(),
        city: z
            .string()
            .min(1, { message: 'La ville est requise' })
            .min(2, { message: 'La ville doit contenir au moins 2 caractères' })
            .max(50, { message: 'La ville ne doit pas dépasser 50 caractères' }),
        zipCode: z
            .string()
            .min(1, { message: 'Le code postal est requis' })
            .regex(/^\d{5}$/, { message: 'Le code postal doit contenir 5 chiffres' }),
        phoneNumber: z
            .string({ message: 'La ville est requise' })
            .min(1, { message: 'Le numéro de téléphone est requis' })
            .regex(/^(?:(?:\+33|0)[1-9])(?:\d{2}){4}$/, {
                message: 'Numéro de téléphone invalide (format français attendu)'
            }),
        deliveryType: z
            .string()
            .min(1, {message: 'Veuillez choisir un type de livraison'})
    })

    const { register, handleSubmit, reset, formState: { errors, isSubmitting }  } = useForm({
        resolver: zodResolver(schema)
    })

    const onSubmit = async (data) => {
        try {
            await addCommand(data)
            displaySuccessMessage()
        } catch(err) {
            displayErrorMessage()
            throw err
        }
    }

    const displaySuccessMessage = () => {
        setSuccessMessage('La commande est bien enregistrée.')
        setTimeout(() => {
            router.push('/user/payment')
            setSuccessMessage(null)
            reset()
        }, 2000)
    }

    const displayErrorMessage = () => {
        setSuccessMessage(null)
        setTimeout(() => {
            clearErrorMessage()
        }, 2000)
    }

    return (
        <section className={styles.address}>
            <div className={styles['address__form']}>
                <div className={styles['address__header']}>
                    <span className={styles['address__header__subtitle']}>VOTRE LIVRAISON</span>
                    <h3 className={styles['address__header__title']}>Informations de livraison</h3>
                    <div className={styles['address__header__line']}></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles['form-column']}>
                        <div className={styles['form-group']}>
                            <label htmlFor='prénom'>Prénom</label>
                            <input {...register('firstName')} type={'text'} className={styles['form-group__input']}/>
                            {errors.firstName && <span className={styles['error-field']}>{errors.firstName.message}</span>}
                        </div>

                        <div className={styles['form-group']}>
                            <label htmlFor='Nom'>Nom</label>
                            <input {...register('lastName')} type={'text'} className={styles['form-group__input']}/>
                            {errors.lastName && <span className={styles['error-field']}>{errors.lastName.message}</span>}
                        </div>

                        <div className={styles['form-group']}>
                            <label htmlFor='address'>Adresse (numéro et rue)</label>
                            <input {...register('address')} type={'text'} className={styles['form-group__input']}/>
                            {errors.address && <span className={styles['error-field']}>{errors.address.message}</span>}
                        </div>

                        <div className={styles['form-group']}>
                            <label htmlFor='complément address'>Complément d'adresse (facultatif)</label>
                            <input {...register('addressComplement')} type={'text'} className={styles['form-group__input']}/>
                            {errors.addressComplement && <span className={styles['error-field']}>{errors.addressComplement.message}</span>}
                        </div>

                        <div className={styles['form-group']}>
                            <label htmlFor='city'>Ville</label>
                            <input {...register('city')} type={'text'} className={styles['form-group__input']}/>
                            {errors.city && <span className={styles['error-field']}>{errors.city.message}</span>}
                        </div>

                        <div className={styles['form-group']}>
                            <label htmlFor='zip code'>Code postal</label>
                            <input {...register('zipCode')} type={'text'} className={styles['form-group__input']}/>
                            {errors.zipCode && <span className={styles['error-field']}>{errors.zipCode.message}</span>}
                        </div>

                        <div className={styles['form-group']}>
                            <label htmlFor='phone'>Téléphone</label>
                            <input {...register('phoneNumber')} type={'tel'} className={styles['form-group__input']}/>
                            {errors.phoneNumber && <span className={styles['error-field']}>{errors.phoneNumber.message}</span>}
                        </div>

                        <div className={styles['form-group']}>
                            <label htmlFor='deliveryType'>Mode de commande</label>
                            <select {...register('deliveryType')} className={styles['form-group__select']} defaultValue="">
                                <option value="" disabled>Sélectionner un mode</option>
                                <option value="À emporter">🛍 À emporter</option>
                                <option value="Livraison">🚚 Livraison à domicile +5 euros</option>
                            </select>
                            {errors.deliveryType && <span className={styles['error-field']}>{errors.deliveryType.message}</span>}
                        </div>
                    </div>

                    {successMessage && <p className={styles['successMessage']}>{successMessage}</p>}

                    {errorMessage && <p className={styles['errorMessage']}>{errorMessage}</p>}

                    <div className={styles['address__button']}>
                        <button type="submit" className={`${styles.btn} ${styles['btn-command']}`} disabled={isSubmitting}>
                            { isSubmitting ? 'Chargementt...' : 'Enregistrer la commande'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}