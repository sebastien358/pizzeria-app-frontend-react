import styles from './OrderSummary.module.scss'

type CommandItem = {
    id: number
    quantity: number
    [key: string]: any
}

type Command = {
    id: number
    commandItems: CommandItem[]
    [key: string]: any
}

type OrderSummaryProps = {
    command: Command | null
}

export default function OrderSummary({ command }: OrderSummaryProps) {

    if (!command || !command.commandItems) return

    return (
        <div className={styles['order-summary']}>
            <h3 className={styles['order-summary__title']}>Récapitulatif de votre commande</h3>
            <div className={styles['order-summary__content']}>
                {/* 👤 INFOS CLIENT */}
                <div className={styles['order-summary__column']}>
                    <div className={styles['order-summary__client']}>
                        <p className={styles['order-summary__item']}>
                            <span>Nom :</span>
                            <span>{command.lastName}</span>
                        </p>
                        <p className={styles['order-summary__item']}>
                            <span>Prénom :</span>
                            <span>{command.firstName}</span>
                        </p>
                        <p className={styles['order-summary__item']}>
                            <span>Adresse :</span>
                            <span>{command.address}</span>
                        </p>
                        <p className={styles['order-summary__item']}>
                            <span>Code postal :</span>
                            <span>{command.zipCode}</span>
                        </p>
                        <p className={styles['order-summary__item']}>
                            <span>Ville :</span>
                            <span>{command.city}</span>
                        </p>
                        <p className={styles['order-summary__status']}>
                            <strong>Statut : </strong>
                            <strong>{command.deliveryType}</strong>
                        </p>
                    </div>

                    {/* 🍕 ITEMS */}
                    <div className={styles['order-summary__content']}>
                        {command.commandItems.map((item) => (
                            <div key={item.id} className={styles['order-summary__items']}>
                                <p className={styles['order-summary__item']}>
                                    <span>Commande :</span>
                                    <span>{item.title}</span>
                                </p>
                                <p className={styles['order-summary__item']}>
                                    <span>Quantité :</span>
                                    <span>{item.quantity}</span>
                                </p>
                            </div>
                        ))}

                        {command.deliveryType === 'Livraison' && (
                            <p className={styles['order-summary__item']}>
                                <span>Livraison :</span>
                                <span>+ 5€</span>
                            </p>
                        )}

                        <p className={styles['order-summary__total']}>
                            <span>Total :</span>
                            <span>{command.total}€</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}