'use client'
import styles from './page.module.scss'
import Image from 'next/image'
import hero from "@/assets/images/hero-pizza.png"
import {useProductStore} from "@/store/product";
import {useEffect} from "react";

export default function Home() {
    const { products, productList } = useProductStore()

    useEffect(() => {
        productList()
    }, [])

    const deleteProduct = (id) => {
        console.log(id)
    }

    return (
        <main className={styles.boutique}>

            <section className={styles.hero}>
                <div className={styles.hero__content}>
                    <div className={styles.hero__text}>
                        <h1>Des pizzas artisanales, livrées chez vous 🍕</h1>
                        <p>Commandez en quelques clics et savourez une vraie pizza italienne.</p>
                        <button className={styles.btnHero}>Commander maintenant</button>
                    </div>
                </div>
                <Image src={hero} alt="Pizza" className="heroPizza"/>
            </section>

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

            {products.length > 0 && products.map((p) => (
                <div key={p.id}>
                    <p>{p.title}</p>
                    <button onClick={() => deleteProduct(p.id)}>supprimer</button>
                </div>
            ))}
        </main>
    )
}