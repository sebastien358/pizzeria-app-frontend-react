"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

import styles from '@/components/Header/Header.module.scss'

export default function NavLink({ href, children, dropdown = false }) {
    const pathName = usePathname()
    const isActive = pathName === href

    const baseClass = dropdown ? styles.headerAdmin__link : styles.nav__link
    const activeClass = dropdown ? styles.headerAdmin__link__active : styles.nav__link__active

    return (
        <Link
            href={href}
            className={`${baseClass} ${isActive ? activeClass : ''}`}
        >
            {children}
        </Link>
    )
}