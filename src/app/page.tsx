'use client'
import styles from './page.module.scss'
import Image from 'next/image'
import hero from "@/assets/images/hero-pizza.png"
import {useProductStore} from "@/store/product";
import {useEffect} from "react";
import NotFound from "@/assets/images/not-found.webp"

export default function Home() {
    const { products, loading, productList } = useProductStore()

    useEffect(() => {
        productList()
    }, [])

    const deleteProduct = (id) => {
        console.log(id)
    }

    return (
        <main className={styles.boutique}>

            {/* hero */}

            <section className={styles.hero}>
                <div className={styles.hero__content}>
                    <div className={styles.hero__text}>
                        <h1>Des pizzas artisanales, livrées chez vous 🍕</h1>
                        <p>Commandez en quelques clics et savourez une vraie pizza italienne.</p>
                        <button className={styles.btnHero}>Commander maintenant</button>
                    </div>
                </div>
                <Image src={hero} alt="Pizza" width={680} height={680} className={styles.heroPizza}/>
            </section>

            {/* about */}

            <section className={styles.aboutSection}>
                <div className={styles.aboutContainer}>
                    <div className={styles.aboutIntro}>
                        <span className={styles.aboutSubtitle}>PIZZERIA ARTISANALE</span>
                        <h2>Le goût de l’Italie,<br/>à deux pas de chez vous</h2>
                        <p>
                            Nous préparons des pizzas généreuses avec des ingrédients soigneusement sélectionnés,
                            une pâte travaillée avec attention et une cuisson maîtrisée pour un résultat savoureux à
                            chaque commande.
                        </p>
                    </div>

                    <div className={styles.aboutSignature}>
                        <span className={styles.signatureText}>Fait avec passion</span>
                    </div>

                    <div className={styles.aboutStats}>

                        <div className={styles.statItem}>
                            <h3>100%</h3>
                            <p>Ingrédients sélectionnés</p>
                        </div>

                        <div className={styles.statItem}>
                            <h3>30 min</h3>
                            <p>Livraison rapide</p>
                        </div>

                        <div className={styles.statItem}>
                            <h3>7j/7</h3>
                            <p>Commande en ligne</p>
                        </div>

                        <div className={styles.statItem}>
                            <h3>0/5</h3>
                            <p>Avis clients</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* loading */}

            {loading && (
                <section className={styles.spinner}>
                    <div className={styles.spinner__loader}></div>
                </section>
            )}

            {/* products */}

            {!loading && products.length > 0 && (
                <section className={styles.pizza}>
                    <div className={styles.pizza__grid}>
                        {products.map((p) => {
                            return (
                                <div key={p.id}>
                                    <section className={styles.pizzaDisplay}>
                                        <div className={styles['pizzaDisplay__card']}>
                                            <div className={styles['pizzaDisplay__image']}>
                                                {p.pictures.length > 0 ? (
                                                    <>
                                                        <Image src={p.pictures?.[0]?.filename} width={300} height={300} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Image src={NotFound} width={300} height={300} />
                                                    </>
                                                )}
                                            </div>

                                            <div className={styles['pizzaDisplay__content']}>
                                                <h3>{p.name}</h3>
                                                <p className={styles['pizzaDisplay__description']}></p>
                                                <div className={styles['pizzaDisplay__sizes']}>
                                                    <p className={styles['pizzaDisplay__sizesTitle']}>Choisissez une taille</p>
                                                    <div className={styles['pizzaDisplay__options']}>
                                                        <label>
                                                            <input type="radio" />
                                                            <span>option name price</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles['pizzaDisplay__button']}>
                                                <button className={styles.btnCart}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <circle cx="9" cy="21" r="1"></circle>
                                                        <circle cx="20" cy="21" r="1"></circle>
                                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                                    </svg>
                                                    <span>Ajouter au panier</span>
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* empty product */}

            {!loading && products.length === 0 && (
                <section className={styles.emptyPizza}>
                    <p className={styles.emptyPizza__text}>Aucun produit pour le moment.</p>
                </section>
            )}
        </main>
    )
}