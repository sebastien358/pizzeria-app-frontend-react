import styles from './PaymentFinish.module.scss'
import Link from "next/link";

export default function PaymentFinish() {
    return (
        <section className={styles['success']}>
            <div className={styles['success__card']}>
                <div className={styles['success__icon']}>✅</div>
                <h1 className={styles['success__title']}>Paiement réussi</h1>
                <p className={styles['success__text']}>
                    Votre commande est en cours de préparation. Vous serez bientôt livré 🍕
                </p>
                <Link href="/" className={styles['success__button']}> Retour à l’accueil</Link>
            </div>
        </section>
    )
}