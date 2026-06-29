'use client'
import styles from '@/components/Header/Header.module.scss'
import Link from "next/link";
import {useState} from "react";
import NavLink from "@/app/nav-link/NavLink";
import {useAuthStore} from "@/store/auth";

type HeaderProps = { className: string }

export default function Header({ className, ...rest }: HeaderProps) {
    const { token, isAdmin, isUser, logout } = useAuthStore()

    const [ cartOpen, setCartOpen ] = useState(false)

    const [ menuAdmin, setMenuAdmin ] = useState(false)

    return (
        <header className={`${styles.header} ${className || ''}`} {...rest}>
            <div className={styles.header__container}>

                <Link href="/" className={styles.header__logo}>
                    <div className={styles.header__icon}>
                        <span className={styles.iconPizza}>🍕</span>
                    </div>

                    <div className={styles.header__text}>
                        <h1 className={styles.logoTitle}>Pizzeria</h1>
                        <p className={styles.logoSubtitle}>Commande en ligne</p>
                    </div>
                </Link>

                <section className={styles.header__right}>
                    <nav className={styles.header__nav}>
                        <NavLink href="/">Accueil</NavLink>
                        <NavLink href="/pizzas">La carte</NavLink>
                        <NavLink href="/contact">Contact</NavLink>

                        {/* role admin */}

                        {token && isAdmin() ? (
                            <>
                                <div className={styles.headerAdmin} onMouseEnter={() => setMenuAdmin(true)} onMouseLeave={() => setMenuAdmin(false)}>
                                    <a className={styles.nav__link} href="#">Espace pro</a>
                                    <div className={`${styles.headerAdmin__menu} ${menuAdmin ? styles.headerAdmin__menu__open : ''}`}>
                                        <NavLink
                                            href="/admin/add-product"
                                            dropdown
                                        >
                                            Ajouter une pizza
                                        </NavLink>
                                    </div>
                                </div>

                            </>
                        ) : null}

                        {/* role user */}

                        {token && isUser() && !isAdmin ? (
                            <>
                                <NavLink href="/">Espace Client</NavLink>
                            </>
                        ) : null}

                        {/* token connected */}

                        {token ? (
                            <>
                                <a onClick={(e) => { e.preventDefault(); logout() }} className={styles.nav__link} href="#">Déconnexion</a>
                            </>
                        ) : (
                            <>
                                <NavLink href="/login">Connexion</NavLink>
                                <NavLink href="/inscription">Inscription</NavLink>
                            </>
                        )}
                    </nav>

                    <div className={styles.header__cart} onMouseEnter={() => setCartOpen(true)} onMouseLeave={() => setCartOpen(false)}>
                        <div className={styles.cart}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.44C7.52 17.37 8.48 19 10 19h9v-2h-9l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L23 6H6.21l-.94-2z"
                                />
                            </svg>
                            <span className={styles.cartBadge}>6</span>
                        </div>

                        <div className={`${styles.header__menu} ${cartOpen ? styles.header__menu__open : ''}`}>
                            <div className={styles.emptyCart}>
                                <p>Le panier est vide</p>
                            </div>

                            <div v-for="cart in cartStore.cart">
                                <div className={styles.header__menu__content}>
                                    <p>xsxs</p>

                                    <div className={styles.header__menu__text}>
                                        <p className={styles.productPrice}>
                                            8€ <span className={styles.productQuantity}>x4</span>
                                        </p>
                                        <p className={styles.productTitle}>tttt</p>
                                    </div>
                                </div>
                                <div className={styles.header__menu__delete}>

                                </div>
                            </div>

                            <div className={styles.separator}></div>

                            <div className={styles.header__menu__total}>
                                <p>Total : 10€</p>
                                <p>
                                    <strong> 6 €</strong>
                                </p>
                            </div>

                            <div className={styles.header__menu__buttons}>
                                <button  className={styles.btnCart}>Voir le panier</button>
                                <button className={styles.btnPayment}>Commander</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </header>
    )
}

