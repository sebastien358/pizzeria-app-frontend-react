import styles from './Newsletter.module.scss'

export default function Newsletter() {
    return (
        <section className={styles['newsletter']}>
            <div className={styles['newsletter__container']}>
                <div className={styles['newsletter__text']}>
                    <span>NEWSLETTER</span>
                    <h2>Rejoignez notre newsletter</h2>
                </div>
                <form className={styles['newsletter__form']}>
                    <input type="email" placeholder="Votre adresse e-mail" />
                    <button type="button">Envoyer</button>
                </form>
            </div>
        </section>
    )
}