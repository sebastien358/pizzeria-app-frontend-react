'use client'

import styles from './InputSearch.module.scss'

export default function InputSearch({ searchProduct, term }: { searchProduct: (term: string) => void, term: string }) {
    return (
        <section className={styles['search']}>
            <div className={styles['search__container']}>
            {/* Filtration search */}
            <div className={styles['search__input']}>
                <input type={"text"} onChange={(e) => searchProduct(e.target.value)} value={term} />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>
            {/* Counter */}
            <div className={styles['search__counter']}>
                <span className="search__total"> au total</span>
            </div>
        </div>
</section>
    )
}