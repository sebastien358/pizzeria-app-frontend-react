import styles from '@/components/Footer/Footer.module.scss'
import Image from "next/image";

import Pizza from '@/assets/images/hero-pizza.png'
import LegalNotice from "@/components/legal-notice/LegalNotice";
import {useEffect, useRef, useState} from "react";
import gsap from 'gsap'
import Link from "next/link";

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

    {/* Footer GSAP */}

    const footerRef = useRef<HTMLDivElement | null>(null)
    const footerBrandRef = useRef<HTMLDivElement | null>(null)
    const footerSocialsRef = useRef<HTMLDivElement | null>(null)
    const footerInfoRef = useRef<HTMLDivElement | null>(null)
    const footerNavRef = useRef<HTMLDivElement | null>(null)
    const footerBottomRef = useRef<HTMLDivElement | null>(null)

    const footerGsap = () => {
        if (!footerRef.current) return
        const isDesktop = window.innerWidth >= 768
        const el = footerRef.current

        const socialsLinks = footerSocialsRef.current?.querySelectorAll('a')
        const infoItems = footerInfoRef.current?.querySelectorAll(`.${styles.footerInfo}`)
        const navRef = footerNavRef.current?.querySelectorAll('a')

        const tl = gsap.timeline({ paused: true })

        tl.from(footerBrandRef.current, { opacity: 0, y: isDesktop ? 20 : 10, duration: 0.6, ease: 'power3.out' })

        if (socialsLinks && socialsLinks.length) {
            tl.from(socialsLinks, {opacity: 0, y: isDesktop ? 15 : 8, stagger: isDesktop ? 0.1 : 0.07, duration: 0.5, ease: 'power3.out'}, '-=0.3')
        }

        if (infoItems && infoItems.length) {
            tl.from(infoItems, { opacity: 0, y: isDesktop ? 15 : 8, stagger: isDesktop ? 0.1 : 0.07, duration: 0.5, ease: 'power3.out' }, '-=0.3')
        }

        if (navRef && navRef.length) {
            tl.from(navRef, { opacity: 0, y: isDesktop ? 10 : 6, stagger: isDesktop ? 0.08 : 0.05, duration: 0.4, ease: 'power3.out' }, '-=0.2')
        }

        tl.from(footerBottomRef.current, { opacity: 0, y: isDesktop ? 10 : 6, duration: 0.4, ease: 'power3.out' }, '-=0.2')

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                tl.play()
                observer.disconnect()
            }
        }, { threshold: 0.5 })
        observer.observe(el)
    }

    useEffect(() => {
        const ctx = gsap.context(() => {
            footerGsap()
        })

        return () => ctx.revert()
    }, [])

    return (
        <footer className={`${styles.footer} ${className || ''}`} {...rest} ref={footerRef}>
            <section className={styles.footerMain}>
                <div className={styles.footerMain__logo}>
                    <div className={styles.footerBrand} ref={footerBrandRef}>
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

                <div className={styles.footerMain__socials} ref={footerSocialsRef}>
                    <a target="_blank" href="https://www.facebook.com">Facebook</a>
                    <a target="_blank" href="https://www.instagram.com">Instagram</a>
                    <a target="_blank" href="https://www.tiktok.com">TikTok</a>
                </div>

                <div className={styles.footerMain__infos} ref={footerInfoRef}>
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

                <nav className={styles.footerMain__nav} ref={footerNavRef}>
                    <Link href="/">Accueil</Link>
                    <Link href="/pizzas">La carte</Link>
                    <Link href="/contact">Contact</Link>
                </nav>

                <div className={styles.footerMain__bottom} ref={footerBottomRef}>
                    <p>Copyright © 2026 Pizzeria. Tous droits réservés.</p>
                    <span onClick={() => onClickOpenLegalModal()}>Mentions légales</span>
                </div>
            </section>

            {/* Legal Notice */}

            <LegalNotice
                openLegalModal={openLegalModal}
                closeLegalModal={onClickCloseLegalModal}
            />
        </footer>
    )
}