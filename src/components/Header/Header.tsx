'use client'
import styles from '@/components/Header/Header.module.scss'
import Link from "next/link";
import {useState} from "react";
import NavLink from "@/app/nav-link/NavLink";
import {useAuthStore} from "@/store/auth";
import {useProductToCart} from "@/store/cartProduct";
import Image from "next/image";
import NotFound from "@/assets/images/not-found.webp"
import {useRouter} from "next/navigation";


import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";

type HeaderProps = { className: string }

export default function Header({ className, ...rest }: HeaderProps) {

    const { token, isAdmin, isUser, logout } = useAuthStore()
    const { cart, deleteProductToCart, totalCartPrice } = useProductToCart()

    const [ cartOpen, setCartOpen ] = useState(false)

    const [ menuAdmin, setMenuAdmin ] = useState(false)

    const [ menuUser, setMenuUser ] = useState(false)

    {/* Delete products to cart */}

    const deleteProduct = (id: number) => {
        deleteProductToCart(id)
    }

    const router = useRouter()

    {/* Redirect to cart */}

    const redirectToCart = () => {
        if (cart.length > 0) {
            router.push('/cart')
        }
    }

    {/* Redirect to payment */}

    const redirectToCheckout = () => {
        if (cart.length > 0 && token && isUser()) {
            router.push('/checkout')
            return
        }
        router.push('/login')
    }

    {/* Mobile menu */}

    const [ openMenuMobile, setOpenMenuMobile ] = useState(false)

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

                        {token && isAdmin() && (
                            <>
                                <div className={styles['header-admin']} onMouseEnter={() => setMenuAdmin(true)} onMouseLeave={() => setMenuAdmin(false)}>
                                    <a className={styles.nav__link} href="#">Espace pro</a>
                                    <div className={`${styles['header-admin__menu']} ${menuAdmin ? styles['header-admin__menu__open' ]: ''}`}>
                                        <NavLink
                                            href="/admin/commands"
                                            dropdown
                                        >
                                            Liste des commandes
                                        </NavLink>
                                        <NavLink
                                            href="/admin/contacts"
                                            dropdown
                                        >
                                            Liste des contacts
                                        </NavLink>
                                        <NavLink
                                            href="/admin/testimonials"
                                            dropdown
                                        >
                                            Liste des témoignages
                                        </NavLink>
                                        <NavLink
                                            href="/admin/products"
                                            dropdown
                                        >
                                            Liste des pizzas
                                        </NavLink>
                                        <NavLink
                                            href="/admin/products/new"
                                            dropdown
                                        >
                                            Ajouter une pizza
                                        </NavLink>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* role user */}

                        {token && isUser() && !isAdmin() && (
                            <>
                                <div className={styles['header-user']} onMouseEnter={() => setMenuUser(true)} onMouseLeave={() => setMenuUser(false)}>
                                    <a className={styles.nav__link} href="#">Espace Client</a>
                                    <div className={`${styles['header-user__menu']} ${menuUser ? styles['header-user__menu__open'] : ''}`}>
                                        <NavLink href="/user/profile/commands" dropdown>Mes commandes</NavLink>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* token connected */}

                        {token ? (
                            <>
                                <a onClick={(e) => { e.preventDefault(); logout() }} className={styles.nav__link} href="#">Déconnexion</a>
                            </>
                        ) : (
                            <>
                                <NavLink href="/login">Connexion</NavLink>
                                <NavLink href="/register">Inscription</NavLink>
                            </>
                        )}
                    </nav>

                    {/* Cart */}

                    <div className={styles.header__cart} onMouseEnter={() => setCartOpen(true)} onMouseLeave={() => setCartOpen(false)}>
                        <div className={styles.cart}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.44C7.52 17.37 8.48 19 10 19h9v-2h-9l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L23 6H6.21l-.94-2z" />
                            </svg>
                            <span className={styles.cartBadge}>{cart.length}</span>
                        </div>

                        <div className={`${styles.header__menu} ${cartOpen ? styles.header__menu__open : ''}`}>
                            {!cart.length && (
                                <div className={styles.emptyCart}>
                                    <p>Le panier est vide</p>
                                </div>
                            )}

                            {cart.map((p) => (
                                <div key={p.id} className={styles['header__menu__list']}>
                                    <div className={styles.header__menu__content}>
                                        <Image src={p.pictures?.[0]?.filename || NotFound} alt={''} height={45} width={45} />
                                        <div className={styles.header__menu__text}>
                                            <p className={styles.productPrice}>
                                                 € <span className={styles.productQuantity}>x{p.quantity}</span>
                                            </p>

                                            <p className={styles.productTitle}>{p.title}</p>
                                        </div>
                                    </div>
                                    <div className={styles.header__menu__delete}>
                                        <svg
                                            onClick={() => deleteProduct(p.id)}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                                            <path d="M10 11v6"></path>
                                            <path d="M14 11v6"></path>
                                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                                        </svg>
                                    </div>
                                </div>
                                )
                            )}

                            <div className={styles.separator}></div>

                            <div className={styles.header__menu__total}>
                                <p>Total : </p>
                                <p>
                                    <strong>{totalCartPrice()} €</strong>
                                </p>
                            </div>

                            <div className={styles.header__menu__buttons}>
                                <button onClick={() => redirectToCart()} disabled={cart.length === 0} className={styles.btnCart}>
                                    Voir le panier
                                </button>
                                <button onClick={() => redirectToCheckout()} disabled={cart.length === 0} className={styles.btnPayment}>
                                    Commander
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mobile */}

                <section className={styles['mobile']} onMouseEnter={() => setOpenMenuMobile(true)} onMouseLeave={() => setOpenMenuMobile(false)}>
                    <div className={styles['mobile__icon']}>
                        <FontAwesomeIcon icon={faBars} />
                        <div className={`${styles['mobile__menu']} ${openMenuMobile ? styles['mobile__menu__open'] : ''}`}>

                            {/* role admin */}

                            {token && isAdmin() && (
                                <>
                                    <NavLink href="/admin/commands" mobile>Liste des commandes</NavLink>
                                    <NavLink href="/admin/contacts" mobile>Liste des contacts</NavLink>
                                    <NavLink href="/admin/testimonials" mobile>Liste des témoignages</NavLink>
                                    <NavLink href="/admin/products" mobile>Liste des pizzas</NavLink>
                                    <NavLink href="/admin/products/new" mobile>Ajouter une pizza</NavLink>
                                </>
                            )}

                            {/* role user */}

                            {token && isUser() && !isAdmin() && (
                                <>
                                    <NavLink href="/user/profile/commands" mobile>Mes commandes</NavLink>
                                </>
                            )}

                            {/* token connected */}

                            {token ? (
                                <>
                                    <a onClick={(e) => { e.preventDefault(); logout() }} className={styles.nav__link} href="#">Déconnexion</a>
                                </>
                            ) : (
                                <>
                                    <NavLink href="/login" mobile>Connexion</NavLink>
                                    <NavLink href="/register" mobile>Inscription</NavLink>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </header>
    )
}

