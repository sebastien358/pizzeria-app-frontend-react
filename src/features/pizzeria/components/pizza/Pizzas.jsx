'use client'

import styles from './Pizza.module.scss'
import {useProductStore} from "../../../../store/product"
import InputSearch from "../../../../components/input-search/InputSearch";
import NotFound from "@/assets/images/not-found.webp"
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {useProductToCart} from "../../../../store/cartProduct";
import gsap from 'gsap'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export default function Pizzas() {
    const { productList, products, term, searchProduct, loading, lazyLoad, countProduct, hasMore } = useProductStore()

    const { productToCart } = useProductToCart()

    const [ selectedOptions, setSelectedOptions ] = useState({})

    useEffect(() => {
        const defaults = {}
        products.forEach(pizza => {
            defaults[pizza.id] = pizza.productOption.find(o => o.name === 'Grande') || pizza.productOption[0]
        })
        setSelectedOptions(defaults)
    }, [products])

    useEffect(() => { productList()}, [])

    useEffect(() => {
        if (products.length === 0) return
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                lazyLoad()
            }
        })
        return () => observer.disconnect()
    }, [])

    {/* Add products to cart */}

    const addPizzaToCart = (id) => {
        productToCart(id, selectedOptions[id])
    }

    {/* Animation GSAP */}

    const searchRef = useRef(null)
    const pizzasRef = useRef(null)
    const cardRefs = useRef([])

    const pizzaGsapAnimation = () => {
        const search = searchRef.current
        const cards = cardRefs.current.filter(Boolean)

        if (!search || cards.length === 0) return

        const isDesktop = window.innerWidth >= 767.98

        const tl = gsap.timeline()

        tl.from(search, {
            opacity: 0,
            y: isDesktop ? 20 : 7,
            filter: isDesktop ? 'blur(8px)' : 'blur(2px)',
            duration: isDesktop ? 0.6 : 0.8,
            ease: 'power3.out',
        })

        tl.from(cards, {
            opacity: 0,
            y: isDesktop ? 15 : 5,
            filter: isDesktop ? 'blur(8px)' : 'blur(1px)',
            duration: isDesktop ? 0.6 : 0.8,
            ease: 'power3.out',
            stagger: isDesktop ? 0.2 : 0.4,
            clearProps: 'filter',
        })
    }

    useEffect(() => { productList() }, [])

    useEffect(() => {
        if (!loading && products.length > 0) {
            requestAnimationFrame(() => {
                pizzaGsapAnimation()
            })
        }
    }, [loading])

    return (
        <>
            {loading ? (
                <section className={styles['spinner']}>
                    <div className={styles['spinner__loader']}></div>
                </section>

            ) : (
                <div className={styles['page']}>
                    <div className={styles['inputSearch']} ref={searchRef}>
                        <InputSearch
                            placeholder={'Rechercher une pizza...'}
                            activeSearch={'search-products'}
                            search={searchProduct}
                            count={null}
                            term={term}
                        />
                    </div>
                    {products && products.length > 0 ? (
                        <section className={styles.pizza} ref={pizzasRef}>
                            <div className={styles.cardsGrid}>
                                {products.map((pizza, index) => (
                                    <div
                                        key={pizza.id}
                                        className={styles.gridPizzas}
                                        ref={(el) => { cardRefs.current[index] = el }}
                                    >
                                        <div className={styles.pizzaCard}>
                                            {pizza.pictures.length > 0 ? (
                                                <Image
                                                    src={pizza.pictures[0]?.filename}
                                                    alt={'Image pizza'}
                                                    width={380}
                                                    height={380}
                                                    className={styles['pizzaCard__image']}
                                                />
                                            ) : (
                                                <Image
                                                    src={NotFound}
                                                    alt={'Pas d\'image'}
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
                                                            name={`size-${pizza.id}`}
                                                            value={option.id}
                                                            checked={selectedOptions[pizza.id]?.id === option.id}
                                                            onChange={() => setSelectedOptions( prev => ({...prev, [pizza.id]: option}) )}
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

                            {hasMore && (
                                <div className={styles['pizzaLoad']}>
                                    <button
                                        onClick={(e) => lazyLoad(e)}
                                        className={styles['pizzaLoad__button']}
                                    >
                                        Plus de pizzas
                                    </button>
                                </div>
                            )}

                        </section>
                    ) : (
                        <section className={styles['emptyPizza']}>
                            <p className={styles['emptyPizza__text']}>Aucune pizza disponible.</p>
                        </section>
                    )}
                </div>
            )}
        </>
    )
}





