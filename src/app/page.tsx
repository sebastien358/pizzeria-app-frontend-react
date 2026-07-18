'use client'
import styles from './page.module.scss'
import Image from 'next/image'
import hero from "@/assets/images/hero-pizza.png"
import {useProductStore} from "@/store/product";
import {useEffect, useState} from "react";
import NotFound from "@/assets/images/not-found.webp"
import Link from "next/link";
import {useTestimonial} from "@/store/testimonial";
import Newsletter from "@/components/newsletter/Newsletter";
import Ingredients from '@/assets/images/ingredients.png'

export default function Home() {
    {/* Products */}
    const { productsHome, loading, productListHome } = useProductStore()

    {/* Testimonials */}
    const { testimonialListHome, testimonials, loadingTestimonial } = useTestimonial()

    useEffect(() => {
        productListHome()
        testimonialListHome()
    }, [])

    {/* Date */}
    const displayDate = (date: Date) => {
        if (!date) return
        const d = new Date(date)
        return new Intl.DateTimeFormat('fr-FR').format(d)
    }

    const [selectedOptions, setSelectedOptions] = useState<Record<string | number, any>>({})

    useEffect(() => {
        const defaults: Record<string | number, any> = {}
        productsHome.forEach((p) => {
            defaults[p.id] = p.productOption.find((po: any) => po.name === 'Grande') || p.productOption[0]
        })
        setSelectedOptions(defaults)
    }, [productsHome]);

    {/* Add cart */}
    const addProductToCart = (id: string | number) => {
        console.log(id, selectedOptions[id])
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

            {/* loading, pizzas, empty pizza  */}

            {loading ? (
                <section className={styles.spinner}>
                    <div className={styles.spinner__loader}></div>
                </section>
            ) : !loading && productsHome.length > 0 ? (
                <section className={styles.pizza}>
                    <div className={styles.pizza__grid}>
                        {productsHome.map((p) => {
                            return (
                                <div key={p.id}>
                                    <section className={styles['pizza-display']}>
                                        <div className={styles['pizza-display__card']}>
                                            <div className={styles['pizza-display__image']}>
                                                {p.pictures.length > 0 ? (
                                                    <>
                                                        <Image src={p.pictures?.[0]?.filename} alt={'Image pizza'} width={300} height={300} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Image src={NotFound} alt={'Pas de pizza'} width={300} height={300} />
                                                    </>
                                                )}
                                            </div>

                                            <div className={styles['pizza-display__content']}>
                                                <h3>{p.title}</h3>
                                                <p className={styles['pizza-display__description']}>
                                                    {p.description}
                                                </p>
                                                <div className={styles['pizza-display__sizes']}>
                                                    <p className={styles['pizza-display__sizesTitle']}>Choisissez une taille</p>
                                                    <div className={styles['pizza-display__options']}>
                                                        {p.productOption && p.productOption.length > 0 ? (
                                                            p.productOption.map((option: any) => (
                                                                <label className={styles['pizza-option']} key={option.id}>
                                                                    <input
                                                                        type="radio"
                                                                        value={option.id}
                                                                        onChange={() => setSelectedOptions(event => ({...event, [p.id]: option}) )}
                                                                        checked={selectedOptions[p.id]?.id === option.id}
                                                                    />
                                                                    <span>{option.name} - {option.price} €</span>
                                                                </label>
                                                            ))
                                                        ) : (
                                                            <p>Aucune taille disponible</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles['pizza-display__button']}>
                                                <button onClick={() => addProductToCart(p.id)} className={styles.btnCart}>
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
            ) : (
                <section className={styles.emptyPizza}>
                    <p className={styles.emptyPizza__text}>Aucun produit pour le moment.</p>
                </section>
            )}

            {/* INGREDIENTS SECTION */}
            <section className={styles['ingredients']}>
                <div className={styles['ingredients__container']}>
                    <div className={styles['ingredients__heading']}>
                        <span className={styles['ingredients__subtitle']}>NOS SAVEURS</span>
                        <h2>Nos ingrédients</h2>
                        <div className={styles['ingredients__line']}></div>
                    </div>
                    <div className={styles['ingredients__content']}>
                        <div className={styles['ingredients__visual']}>
                            <Image
                                src={Ingredients}
                                alt="Illustration d'ingrédients"
                                className={styles['ingredients-img']}
                            />
                        </div>
                        <div className={styles['ingredients__text']}>
                            <p>
                                Nous sélectionnons avec soin des ingrédients de qualité pour proposer des pizzas
                                généreuses, savoureuses et préparées avec attention à chaque commande.
                            </p>
                            <p>
                                Poivrons, tomates, olives, huile d'olive, herbes aromatiques, fromage et charcuterie
                                s'associent pour créer des recettes gourmandes et équilibrées, inspirées d'un vrai
                                savoir-faire.
                            </p>
                            <div className={styles['ingredients__button']}>
                                <Link href="/pizzas" className={styles['ingredients-button']}>Découvrir la carte</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENEFITS SECTION */}
            <section className={styles['benefits']}>
                <section className={styles['benefits__list']}>
                    <article className={styles['benefits__item']}>
                        <div className={styles['benefits__item__icon']}>
                            <svg viewBox="0 0 64 64" aria-hidden="true">
                                <path
                                    d="M12 10C27 8 41 11 54 18L35 54C30 49 24 46 18 44L12 10Z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinejoin="round"
                                />
                                <circle cx="28" cy="24" r="2.5" fill="currentColor" />
                                <circle cx="36" cy="30" r="2.5" fill="currentColor" />
                                <circle cx="24" cy="35" r="2.5" fill="currentColor" />
                            </svg>
                        </div>
                        <h3>Recettes généreuses</h3>
                        <p>Des compositions gourmandes pensées pour le plaisir et la simplicité.</p>
                    </article>

                    <article className={styles['benefits__item']}>
                        <div className={styles['benefits__item__icon']}>
                            <svg viewBox="0 0 64 64" aria-hidden="true">
                                <path
                                    d="M10 42L28 20H54V48H10V42Z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinejoin="round"
                                />
                                <circle cx="40" cy="30" r="3" fill="currentColor" />
                                <circle cx="28" cy="37" r="2.5" fill="currentColor" />
                                <circle cx="47" cy="40" r="2" fill="currentColor" />
                            </svg>
                        </div>
                        <h3>Produits sélectionnés</h3>
                        <p>Des ingrédients choisis avec soin pour garantir goût et qualité.</p>
                    </article>

                    <article className={styles['benefits__item']}>
                        <div className={styles['benefits__item__icon']}>
                            <svg viewBox="0 0 64 64" aria-hidden="true">
                                <path
                                    d="M50 14C31 14 16 26 16 42C16 50 22 54 30 54C46 54 50 39 50 14Z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M24 46C30 38 38 30 48 22"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <h3>Saveurs fraîches</h3>
                        <p>Des associations équilibrées avec une vraie attention portée aux saveurs.</p>
                    </article>

                    <article className={styles['benefits__item']}>
                        <div className={styles['benefits__item__icon']}>
                            <svg viewBox="0 0 64 64" aria-hidden="true">
                                <path
                                    d="M34 10C36 18 46 21 46 34C46 45 40 54 30 54C21 54 16 47 16 39C16 29 23 24 28 18C29 24 32 27 36 30C37 24 35 18 34 10Z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <h3>Cuisson maîtrisée</h3>
                        <p>Une cuisson soignée pour une pâte savoureuse et une texture réussie.</p>
                    </article>
                </section>
            </section>

            {/* newsletter */}
            <Newsletter />

            {/* reviews */}
            <section className={styles['reviews']}>
                <div className={styles['reviews__header']}>
                    <span className={styles['reviews__label']}>Témoignages</span>
                    <h2 className={styles['reviews__title']}>Ce que disent nos clients</h2>
                    <p className={styles['reviews__subtitle']}>Plus de 150 commandes, des clients satisfaits.</p>

                    <div className={styles['reviews__summary']}>
                        <span className={styles['reviews__score']}>5</span>
                        <div className={styles['reviews__summary-detail']}>
                            <div className={styles['reviews__stars']}>
                                {[1, 2, 3, 4, 5].map((n, index) => (
                                    <span key={index}></span>
                                ))}
                            </div>
                            <span className={styles['reviews__count']}>Basé sur { testimonials.length } avis</span>
                        </div>
                    </div>
                </div>

                {loadingTestimonial ? (
                    <div className={styles['spinner']}>
                        <div className={styles['loader']}></div>
                    </div>
                ) : testimonials.length > 0 ? (
                    <div className={styles['reviews__grid']}>
                        {testimonials.slice(0, 3).map((t) => (
                            <div key={t.id} className={styles['reviews__card']}>
                                <div className={styles['reviews__card-stars']}>
                                    {[1, 2, 3, 4, 5].map((n, index) => (
                                        <span key={index}>{n <= t.rating ? '★' : '☆'}</span>
                                    ))}
                                </div>
                                <p className={styles['reviews__card-text']}>"{t.message}"</p>
                                <div className={styles['reviews__card-author']}>
                                    <div className={styles['reviews__card-avatar']}>
                                        {t.pictures[0]?.filename ? (
                                            <Image src={t.pictures[0]?.filename} className={styles['img-avatar']} alt="" height={100} width={100} />
                                        ) : (
                                            <span>{t.firstname.slice(0, 1)} {t.lastname.slice(0, 1)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className={styles['reviews__card-name']}>
                                            {t.firstname} {t.lastname.slice(0, 1)}.
                                        </p>
                                        <p className={styles['reviews__card-date']}>{displayDate(t.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles['reviews__empty']}>
                        <p>Aucun témoignage pour le moment.</p>
                    </div>
                )}

                <div className={styles['reviews__link']}>
                    <Link href="/testimonials">Liste des commentaires</Link>
                </div>
            </section>
        </main>
    )
}