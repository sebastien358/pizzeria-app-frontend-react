import styles from '@/components/Footer/Footer.module.scss'
import Image from "next/image";

import Pizza from '@/assets/images/hero-pizza.png'
import LegalNotice from "@/components/legal-notice/LegalNotice";
import {useState} from "react";

type FooterProps = { className: string }

export default function Footer({ className, ...rest }: FooterProps) {

    {/* Open Legal Modal */}

    const [ openLegalModal, setOpenLegalModal ] = useState(false)

    const onClickOpenLegalModal = () => {
        setOpenLegalModal(true)
    }

    const onClickCloseLegalModal = () => {
        setOpenLegalModal(false)
    }
    return (
        <footer className={`${styles.footer} ${className || ''}`} {...rest}>
            <section className={styles.footerMain}>
                <div className={styles.footerMain__logo}>
                    <div className={styles.footerBrand}>
                        <Image
                            src={Pizza}
                            alt="Logo Pizzeria"
                            className={styles.footerBrand__icon}
                            width={52}
                            height={52}
                        />
                        <h3>Pizzeria</h3>
                        <p>COMMANDE EN LIGNE</p>
                    </div>
                </div>

                <div className={styles.footerMain__socials}>
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
                    <span onClick={() => onClickOpenLegalModal()}>Mentions légales</span>
                </div>
            </section>

            <LegalNotice openLegalModal={openLegalModal} closeLegalModal={onClickCloseLegalModal} />
        </footer>
    )
}