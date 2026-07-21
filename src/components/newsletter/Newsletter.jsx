import styles from './Newsletter.module.scss'
import gsap from 'gsap'
import {useEffect, useRef} from "react";

export default function Newsletter() {

    const newsletterRef = useRef(null)
    const newsletterSpanRef = useRef(null)
    const newsletterTitleRef = useRef(null)
    const newsletterFormRef = useRef(null)

    const newsletterGsap = () => {
        if (!newsletterRef.current) return
        const desktop = window.innerWidth > 768
        const el = newsletterRef.current

        const tl = gsap.timeline({ paused: true })

        tl.fromTo(newsletterSpanRef.current,
            { opacity: 0, y: desktop ? 18 : 12 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
            .fromTo(newsletterTitleRef.current,
                { opacity: 0, y: desktop ? 25 : 15 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                '-=0.35')
            .fromTo(newsletterFormRef.current,
                { opacity: 0, x: desktop ? 50 : 30 },
                { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' },
                '-=0.45')

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                tl.play()
                observer.disconnect()
            }
        }, { threshold: 0.3 })
        observer.observe(el)
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