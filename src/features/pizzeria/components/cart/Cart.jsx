'use client'

import styles from './Cart.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import notFound from '@/assets/images/not-found.webp'
import { useRouter } from 'next/navigation';
import {useProductToCart} from "@/store/cartProduct"

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";
import {useAuthStore} from "@/store/auth";
library.add(faPlus, faMinus);

export default function Cart() {

    const { cart, productToCart, deleteProductToCart, totalCartPrice } = useProductToCart()

    const { token, isUser } = useAuthStore()

    const router = useRouter()

    {/* Ajouter au panier */}

    const addItem = (id, option) => {
        productToCart(id, option)
    }

    {/* Retirer du panier */}

    const deleteItem = (id) => {
        deleteProductToCart(id)
    }

    {/* Redirection commande */}

    const redirectCommand = () => {
      if (cart.length && token && isUser()) {
          router.push('/user/command-form')
          return
      }
      router.push('/login')
    }

    return (
        <section className={styles['cart-page']}>
            <div className={styles['cart-page__container']}>
                <div className={styles['cart-page__heading']}>
                    <span className={styles['cart-page__subtitle']}>VOTRE COMMANDE</span>
                    <h1 className={styles['cart-page__title']}>Panier</h1>
                    <div className={styles['cart-page__line']}></div>
                </div>

                {cart.length > 0 ? (
                    <div className={styles['cart-layout']}>
                        <div className={styles['cart-list']}>
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.name}`} className={styles['cart-product']}>
                                    <div className={styles['cart-product__left']}>
                                        <div className={styles['cart-product__image']}>
                                            <Image
                                                src={item.pictures[0]?.filename || notFound}
                                                className={styles['img-cart']}
                                                alt=""
                                                width={100}
                                                height={100}
                                            />
                                        </div>
                                        <div className={styles['cart-product__infos']}>
                                            <h4>{item.title}</h4>
                                            <p className={styles['option-name']}>({item.productOption.name})</p>
                                            <p className={styles['unit-price']}>{item.productOption.price} €</p>
                                        </div>
                                    </div>

                                    <div className={styles['cart-product__right']}>
                                        <div className={styles['cart-product__quantity']}>
                                            <FontAwesomeIcon
                                                icon={faMinus}
                                                className={styles['qty-btn']}
                                                onClick={() => deleteItem(item.id)}
                                            />
                                            <p className={styles['quantity']}>{item.quantity}</p>
                                            <FontAwesomeIcon
                                                icon={faPlus}
                                                className={styles['qty-btn']}
                                                onClick={() => addItem(item.id, item.productOption)}
                                            />
                                        </div>
                                        <div className={styles['cart-product__total']}>
                                            {item.productOption.price * item.quantity} €
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <aside className={styles['cart-summary']}>
                            <h2>Total du panier</h2>
                            <div className={styles['cart-summary__row']}>
                                <span>Sous-total</span>
                                <strong>{totalCartPrice()} €</strong>
                            </div>
                            <div className={`${styles['cart-summary__row']} ${styles['cart-summary__row--total']}`}>
                                <span>Total</span>
                                <strong>{totalCartPrice()} €</strong>
                            </div>
                            <button className={styles['cart-summary__checkout']} onClick={redirectCommand}>
                                Commander
                            </button>
                        </aside>
                    </div>
                ) : (
                    <div className={styles['cart-empty']}>
                        <p>🛒 Votre panier est vide</p>
                    </div>
                )}
            </div>
        </section>
    );
}