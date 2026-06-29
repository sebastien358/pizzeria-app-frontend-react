'use client'

import styles from './Pizza.module.scss'
import {useProductStore} from "../../../../store/product"
import NotFound from "@/assets/images/not-found.webp"
import Image from "next/image";

export default function Pizzas() {
    const { products, loading } = useProductStore()

    return (
        <>
            {(loading) ? (
                <section className={styles.spinner}>
                    <div className={styles.spinner__loader}></div>
                </section>
            ) : products && products.length > 0 ? (
                <section className={styles.pizza}>
                    <div className={styles.cardsGrid}>
                        {products.map((pizza) => (
                            <div key={pizza.id} className={styles.gridPizzas}>
                                <div className={styles.pizzaCard}>
                                    {pizza.pictures.length > 0 ? (
                                        <Image
                                            src={pizza.pictures[0].filename}
                                            alt={pizza.title}
                                            width={380}
                                            height={380}
                                            className={styles['pizzaCard__image']}
                                        />
                                    ) : (
                                        <Image
                                            src={NotFound}
                                            alt={pizza.title}
                                            width={380}
                                            height={380}
                                            className={styles['pizzaCard__image']}
                                        />
                                    )}

                                    <h3 className={styles['pizzaCard__title']}>{pizza.title}</h3>
                                    <p className={styles['pizzaCard__description']}>{pizza.description}</p>
                                    <p className={styles['pizzaCard__sizeLabel']}>Choisir une taille</p>

                                    <div className={styles['pizzaCard__sizes']}>
                                        {pizza.productOption.map((option) => (
                                            <div key={option.id} className={styles['pizzaCard__sizeRow']}>
                                                <input
                                                    type="radio"
                                                    value={option}
                                                    onChange={() => setSelectedOptions(prev => ({...prev, [pizza.id]: option}))}
                                                />
                                                <label>
                                                    <span>{option.name}</span>
                                                    <span className={styles.price}>{option.price} €</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles['pizzaCard__button']}>
                                        <button onClick={() => addPizzaToCart(pizza.id)} className={styles.btnCommand}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                            Ajouter au panier
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <section className={styles['emptyPizza']}>
                    <p className={styles['emptyPizza__text']}>Aucune pizza disponible.</p>
                </section>
            )}
        </>
    )
}