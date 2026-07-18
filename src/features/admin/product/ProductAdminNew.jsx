'use client'

import styles from './ProductAdminNew.module.scss'
import {useFieldArray, useForm} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import {useProductAdmin} from "@/store/admin/productAdmin"
import z from "zod"
import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

export default function ProductAdminNew({ currentProduct, productId }) {

    {/* Valeurs d'un fichier attendu */}

    const ACCEPT_FILE_SIZE = 5 * 1024 * 1024
    const ACCEPT_FILE_TYPE = ['image/jpeg', 'image/png', 'image/webp']

    {/* Schema form */}

    const schema = z.object({
        title: z
            .string().min(1, { message: 'Le titre est requis' }),
        description: z
            .string().min(1, { message: 'La description est requise' }),
        image: z
            .any()
            .nullable()
            .refine((file) => !file || file.size < ACCEPT_FILE_SIZE, {
                message: 'L\'image ne doit pas dépasser 5mo'
            })
            .refine((file) => !file || ACCEPT_FILE_TYPE.includes(file.type), {
                message: 'Format d\'image non accepté(jpeg, png, webp uniquement)'
            }),
        productOption: z.array(
            z.object({
                name: z.string().min(1, { message: 'Le nom est requis' }),
                price: z.coerce.number().min(0.01, { message: 'Le prix est requis' })
            })
        )

    })

    {/* Use form */}

    const { register, control, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            productOption: [
                { name: 'Petite', price: '' },
                { name: 'Moyenne', price: '' },
                { name: 'Grande', price: '' }
            ]
        }
    })

    {/* Fields productOption */}

    const { fields } = useFieldArray({
        control,
        name: 'productOption'
    })

    {/* Initial values */}

    useEffect(() => {
        if (currentProduct) {
            reset(currentProduct)
        }
    }, [currentProduct, reset])

    {/*  Store Product Admin */}

    const { productAdminList, productAdminNew, productAdminEdit, deleteImage, uploadImage, errorMessage, clearMessage } = useProductAdmin()

    {/* Supression de l'image d'un produit */}

    const onClickDeleteImage = async (productId, imageId) => {
        try {
            await deleteImage(productId, imageId)
        } catch(err) {
            console.error(err)
            throw err
        }
    }

    {/* Upload image */}

    const onClickUploadImage = async (e, productId, imageId = null) => {
        try {
            const file = e.target.files[0]
            if (imageId) {
                await deleteImage(productId, imageId)
            }
            await uploadImage(productId, file)
        } catch(err) {
            console.error(err)
            throw err
        }
    }

    {/* Intégrer l'image dans les données du formulaire */}

    const [filename, setFilename ] = useState(null)

    const handleChangeFile = (e) => {
        const file = e.target?.files[0]
        setFilename(file.name)
        setValue('image', file)
    }

    {/* Soumission formulaire */}

    const onSubmit = async (formValues) => {
        try {
        if (productId) {
            await productAdminEdit(productId, formValues)
            displayEditSuccessMessage()
            await productAdminList()
        } else {
            await productAdminNew(formValues)
            displaySuccessMessage()
        }
        } catch(err) {
            displayErrorMessage()
            throw err
        }
    }

    {/* Success message*/}

    const [successMessage,setSuccessMessage] = useState(null)

    const router = useRouter()

    const displaySuccessMessage = () => {
        setSuccessMessage('Le produit a été ajouté')
        setTimeout(() => {
            setSuccessMessage(null)
            router.push('/admin/products')
            reset()
        }, 2000)
    }

    {/* Message édition */}

    const [editSuccessMessage, setEditSuccessMessage] = useState(null)

    const displayEditSuccessMessage = () => {
        setEditSuccessMessage('Le produit a bien été modifié')
        setTimeout(() => {
            setEditSuccessMessage(null)
        }, 2000)
    }

    {/* Gestion message d'erreur */}

    const displayErrorMessage = () => {
        setTimeout(() => {
            clearMessage()
        }, 2000)
    }


    return (
        <main className={styles['product']}>
            <section className={styles['product__container']}>
                <h3>{productId ? 'Modifier le produit' : 'Ajouter un produit'}</h3>

                {/* Image du product */}
                {currentProduct && currentProduct.pictures.length > 0 && (
                    <div className={styles['upload-thumb-wrapper']}>
                        <Image src={currentProduct?.pictures?.[0]?.filename} className={styles['img-thumb']} alt={'dccdc'} height={50} width={50} />
                        <button
                            onClick={() => onClickDeleteImage(productId, currentProduct.pictures[0].id)}
                            className={styles['btn-thumb-delete']}>
                            ×
                        </button>

                        <div className={styles['upload-info']}>
                            <p>Image actuelle</p>

                            {/* Input caché */}
                            <div className={styles['replace-image']}>
                                <span>Changer l'image ci-dessous</span>
                                <input
                                    onChange={(e) => onClickUploadImage(e, productId, currentProduct.pictures[0].id)}
                                    type="file"
                                    accept="image/*"
                                    className={styles['input-hidden']}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className={styles['product__form']}>
                    {/* Titre */}
                    <div className={styles['form-group']}>
                        <input type="text" placeholder="Titre"{...register('title')}/>
                        {errors.title && <span className={styles['error-field']}>{errors.title.message}</span>}
                    </div>

                    {/* Description */}
                    <div className={styles['form-group']}>
                        <textarea placeholder="Description"{...register('description')}></textarea>
                        {errors.description &&
                            <span className={styles['error-field']}>{errors.description.message}</span>}
                    </div>

                    {/* Image */}
                    <div className={styles['form-group']}>
                        <div className={styles['input-file']}>
                            <label className={`${styles['input-file__label']} ${currentProduct?.pictures?.length > 0 ? styles['disabled-file'] : ''}`} >
                                <input
                                    disabled={currentProduct?.pictures?.length > 0}
                                    type="file"
                                    onChange={(e) => handleChangeFile(e)}
                                    className={styles['input-file__input']}
                                    multiple
                                />
                                <span>{filename || '📎 Choisir une image'}</span>
                            </label>
                        </div>
                        {errors.image && <span className={styles['error-field']}>{errors.image.message}</span>}
                    </div>

                    {/* Product option */}
                    <div className={styles['form-group']}>
                        {fields.map((field, index) => (
                            <div key={field.id} className={styles['product__option']}>
                                <div className={styles['product__option__fields']}>
                                    <div className={styles.field}>
                                        <input {...register(`productOption.${index}.name`)} />
                                        {errors.productOption?.[index]?.name && (
                                            <span className={styles['error-field']}>
                                        {errors.productOption[index].name.message}
                                    </span>
                                        )}
                                    </div>
                                    <div className={styles.field}>
                                        <input {...register(`productOption.${index}.price`)} />
                                        {errors.productOption?.[index]?.price && (
                                            <span className={styles['error-field']}>
                                        {errors.productOption[index].price.message}
                                    </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* form success */}
                    {successMessage && <span className={styles['success-message']}>{successMessage}</span>}

                    {/* form edit success */}
                    {editSuccessMessage && <span className={styles['success-message']}>{editSuccessMessage}</span>}

                    {/* form error */}
                    {errorMessage && <span className={styles['error-message']}>{errorMessage}</span>}

                    <button type="submit" className={styles['btn-submit']} disabled={isSubmitting}>
                        {isSubmitting ? 'Chargement...' : 'Soumettre'}
                    </button>
                </form>
            </section>
        </main>
    )
}