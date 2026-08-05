'use client';

import styles from './Payment.module.scss'
import {useCommandUser} from "@/store/user/commandUser";
import OrderSummary from "@/features/user/payment/OrderSummary";
import {useEffect, useRef, useState, useMemo, use} from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import axios, {isAxiosError} from "axios";
import to = gsap.to;
import {isPortIsReserved} from "next/dist/lib/helpers/get-reserved-port";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;
const KEY_STRIPE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;

type CommandItems = {
    title: string;
    quantity: number;
    total: number;
};

type Command = {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    zipCode: string;
    status: string;
    CommandItems: CommandItems[];
};

export type PaymentResponse =
    | { type: 'SUCCESS_PAYMENT'; message: string }
    | { type: 'ALREADY_PROCESSED'; message: string }
    | { type: 'ERROR_PAYMENT'; message: string }
    | { type: 'REQUIRES_ACTION'; clientSecret: string; message?: string }
    | { type: 'PRICE_MISMATCH'; message: string };

export type ApiError = { error: string };

type PaymentProps = {
    profileCommandUser?: any
    routeParamsId?: string
}

export default function Payment({ profileCommandUser, routeParamsId }: PaymentProps) {
    const router = useRouter();

    const loading = useCommandUser((state) => state.loading)
    const storePendingCommand = useCommandUser((state) => state.pendingCommand)
    const resetCommandProfile = useCommandUser((state) => state.resetCommandProfile)
    const resetCommandPending = useCommandUser((state) => state. resetCommandPending)

    const [isPaymentLoading, setIsPaymentLoading] = useState(false)
    const [successMessage, setSuccessMessageState] = useState<string | null>(null)
    const [errorMessage, setErrorMessageState] = useState<string | null>(null)

    const [pendingCommand, setPendingCommand] = useState<Command | null>(null)
    const [commandProfile, setCommandProfile] = useState<Command | null>(null)

    const stripeRef = useRef<Stripe | null>(null)
    const stripeElementsRef = useRef<StripeElements | null>(null)
    const stripeCardElement = useRef<StripeCardElement | null>(null)
    const cardElementRef = useRef<HTMLDivElement | null>(null)

    const formRef = useRef<HTMLFormElement | null>(null)

    const selectedCommand = useMemo(() => {
        return routeParamsId ? commandProfile : pendingCommand
    }, [routeParamsId, commandProfile, pendingCommand])

    // Chargement de la commande en cours

    useEffect(() => {
        if (routeParamsId) {
            setCommandProfile(profileCommandUser as Command | null)
        } else {
            setPendingCommand(storePendingCommand as Command | null)
        }
    }, [profileCommandUser, pendingCommand])

    // Configuration de Stripe

    const stripePayment = async () => {
        if (!KEY_STRIPE && !cardElementRef.current) return

        stripeRef.current = await loadStripe(KEY_STRIPE)
        stripeElementsRef.current = stripeRef.current!.elements()

        stripeCardElement.current = stripeElementsRef.current.create('card', {
            style: {
                base: {
                    fontSize: '14px'
                }
            }
        })

        stripeCardElement.current.mount(cardElementRef.current!)
    }

    // Préparation du payload

    const resetCheckout = () => {
        resetCommandProfile()
        resetCommandPending()
    }

    // Messages

    const setSuccessMessage = (message: string) => {
        setErrorMessageState(null)
        setSuccessMessageState(message)
        setTimeout(() => {
            router.push('/user/payment/finish')
            resetCheckout()
            closeAlert()
        }, 4000)
    }

    const setErrorMessage = (message: string) => {
        setSuccessMessageState(null)
        setErrorMessageState(message)
        setTimeout(() => {
            closeAlert()
        }, 4000)
    }

    const closeAlert = () => {
        setSuccessMessageState(null)
        setErrorMessageState(null)
    }

    // Gestion de la réponse serveur

    const handlePaymentResponse = async (apiError: PaymentResponse) => {
        switch (apiError.type) {
            case 'SUCCESS_PAYMENT':
                setSuccessMessage(apiError.message)
                break
            case 'PRICE_MISMATCH':
            case 'ALREADY_PROCESSED':
            case 'ERROR_PAYMENT':
                setErrorMessage(apiError.message)
                break
            case 'REQUIRES_ACTION': {
                if (!stripeRef.current) {
                    setErrorMessage('Stripe pas chargé')
                    break
                }
                const { error, paymentIntent } = await stripeRef.current.confirmCardPayment(apiError.clientSecret)
                if (error) {
                    setErrorMessage(error.message ?? '3DS échouée')
                } else if (paymentIntent?.status === 'succeeded') {
                    setSuccessMessage('Paiement validé')
                    resetCheckout()
                } else {
                    setErrorMessage('Paiement en attente')
                }
                break
            }
            default:
                setErrorMessage('Réponse serveur inconnue')
                break
        }
    }

    // Préparation du payload

    const buildPayload = (token: string): Record<string, unknown> => {
        return routeParamsId ? {token, profileId: profileCommandUser?.id} : {token, pendingId: pendingCommand?.id}
    }

    // Soumission du formulaire

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (!stripeRef.current || !stripeCardElement.current) {
                setErrorMessage('Stripe n\'est pas configuré correctement.')
                return
            }

            setIsPaymentLoading(true)

            const {error, token} = await stripeRef.current.createToken(stripeCardElement.current)
            if (error || !token) {
                setErrorMessage('Erreur de la création du token')
                return
            }

            const payload = buildPayload(token.id)
            const { data } = await axios.post<PaymentResponse>(`${BASE_URL}/api/payment`, payload)
            await handlePaymentResponse(data)
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const apiError = err.response?.data
                await handlePaymentResponse(apiError)
            }
            throw e
        } finally {
            setIsPaymentLoading(false)
        }
    };

    useEffect(() => {
        stripePayment()
    }, [])

    return (
        <main>
            {/* Loading */}
            {loading && !selectedCommand ? (
                <section className={styles.spinner}>
                    <span className={styles.loader}></span>
                </section>
            ) : (
                <section className={styles.page}>
                    <div className={styles.payment}>
                        <div className={styles['payment__form']}>
                            <h2 className={styles['payment__title']}>Paiement sécurisé</h2>
                            <p className={styles['payment__subtitle']}>
                                Entrez vos informations de carte de crédit pour effectuer le paiement
                            </p>

                            {/* Order Summary */}
                            <OrderSummary command={selectedCommand as any} />

                            {/* Form */}
                            <form onSubmit={handleSubmit} ref={formRef}>
                                <div className={styles['form-group']}>
                                    <label htmlFor="card-element" className={styles['payment__label']}>
                                        Numéro de carte bancaire
                                    </label>
                                    <p className={styles['payment__hint']}>Carte Visa, Mastercard acceptées</p>
                                    <div className={styles['card-element']} ref={cardElementRef}></div>
                                </div>

                                {/* Success */}
                                {successMessage && <p className={styles['success-message']}>{successMessage}</p>}

                                {/* Error */}
                                {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}

                                <div className={styles['payment__button']}>
                                    <button type="submit" className={`${styles.btn} ${styles['btn-primary']}`} disabled={isPaymentLoading}>
                                        {isPaymentLoading ? 'Traitement...' : 'Payer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            )}
        </main>
    )
}