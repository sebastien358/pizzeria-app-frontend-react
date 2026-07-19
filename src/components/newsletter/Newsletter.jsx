import styles from './Newsletter.module.scss'
import gsap from 'gsap'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {useEffect, useRef} from "react";
gsap.registerPlugin(ScrollTrigger)

export default function Newsletter() {

    const newsletterRef = useRef(null)
    const newsletterSpanRef = useRef(null)
    const newsletterTitleRef = useRef(null)
    const newsletterFormRef = useRef(null)

    const newsletterGsap = () => {

        const desktop = window.innerWidth > 768

        if (!newsletterRef.current) return

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: newsletterRef.current,
                start: 'top 85%',
                once: true,
            },
        })

        tl.fromTo(
            newsletterSpanRef.current,
            { opacity: 0, y: desktop ? 18 : 12 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        )

        .fromTo(
            newsletterTitleRef.current,
            { opacity: 0, y: desktop ? 25 : 15 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.35',
        )

        .fromTo(
            newsletterFormRef.current,
            { opacity: 0, x: desktop ? 50  : 30},
            { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' },
            '-=0.45',
        )
    }

    useEffect(() => {
        const ctx = gsap.context(() => {
            newsletterGsap()
        })

        return () => ctx.revert()
    }, [])


    return (
        <section className={styles['newsletter']} ref={newsletterRef}>
            <div className={styles['newsletter__container']}>
                <div className={styles['newsletter__text']}>
                    <span ref={newsletterSpanRef}>NEWSLETTER</span>
                    <h2 ref={newsletterTitleRef}>Rejoignez notre newsletter</h2>
                </div>
                <form className={styles['newsletter__form']} ref={newsletterFormRef}>
                    <input type="email" placeholder="Votre adresse e-mail" />
                    <button type="button">Envoyer</button>
                </form>
            </div>
        </section>
    )
}