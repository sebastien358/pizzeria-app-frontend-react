"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

import styles from '@/components/Header/Header.module.scss'

export default function NavLink({ href, children }) {
    const pathname = usePathname()
    return (
        <Link
            href={href}
            className={`${styles.nav__link} ${pathname === href ? styles.nav__link__active : ''}`}
        >
            {children}
        </Link>
    )
}