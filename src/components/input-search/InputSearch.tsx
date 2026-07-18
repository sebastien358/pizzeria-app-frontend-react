'use client'

import styles from './InputSearch.module.scss'
import {usePathname} from "next/navigation";

type InputSearchProps = {
    search: (term: string) => void
    term: string
    count: number
    activeSearch: string
    placeholder: string
}

export default function InputSearch({ search, term, count, activeSearch, placeholder }: InputSearchProps) {

    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')

    const searchInput = (e: any) => {
        switch (activeSearch) {
            case "search-products":
                search(e.target.value)
                break
            case "search-products-admin":
                search(e.target.value)
                break
            case "search-testimonial-admin":
                search(e.target.value)
                break
            case "search-contact-admin":
                search(e.target.value)
                break
            case 'search-command-admin':
                search(e.target.value)
                break
            default:
                return ""
        }
    }

    return (
        <section className={styles['search']}>
            <div className={styles['search__container']}>
            {/* Filtration search */}
            <div className={styles['search__input']}>
                <input
                    type={"text"}
                    onChange={(e) => searchInput(e)}
                    value={term}
                    placeholder={placeholder}
                />
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

            {isAdmin && (
                <div className={styles['search__counter']}>
                    <span className="search__total">{count} au total</span>
                </div>
            )}
        </div>
    </section>
    )
}