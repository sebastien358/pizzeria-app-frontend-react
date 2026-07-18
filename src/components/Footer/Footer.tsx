import styles from '@/components/Footer/Footer.module.scss'

type FooterProps = { className: string }

export default function Footer({ className, ...rest }: FooterProps) {
    return (
        <footer className={`${styles.footer} ${className || ''}`} {...rest}>
            <section className={styles.footerMain}>
                <div className={styles.footerMain__logo}>
                    <div className={styles.footerBrand}>
                        <img
                            src="../../assets/images/hero-pizza.png"
                            alt="Logo Pizzeria"
                            className="footer-brand__icon"
                        />
                        <h3>Pizzeria</h3>
                        <p>COMMANDE EN LIGNE</p>
                    </div>
                </div>

                <div className={styles.footeMain__socials}>
                    <a target="_blank" href="https://www.facebook.com">Facebook</a>
                    <a target="_blank" href="https://www.instagram.com">Instagram</a>
                    <a target="_blank" href="https://www.tiktok.com">TikTok</a>
                </div>

                <div className={styles.footerMain__infos}>

                    <div className={styles.footerInfo}>
                        <h4>Adresse</h4>
                        <p>12 rue de la Pizza, 75000 Paris</p>
                    </div>

                    <div className={styles.footerInfo}>
                        <h4>Téléphone</h4>
                        <p>01 23 45 67 89</p>
                    </div>

                    <div className={styles.footerInfo}>
                        <h4>Email</h4>
                        <p>contact@pizzeria.fr</p>
                    </div>
                </div>

                <nav className={styles.footerMain__nav}>

                </nav>

                <div className={styles.footerMain__bottom}>
                    <p>Copyright © 2026 Pizzeria. Tous droits réservés.</p>
                    <span>Mentions légales</span>
                </div>
            </section>
        </footer>
    )
}