"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import styles from '@/components/Header/Header.module.scss'
import { ReactNode } from "react"

type NavLinkProps = {
    href: string
    children: ReactNode
    dropdown?: boolean
    mobile?: boolean
}

export default function NavLink({ href, children, dropdown = false, mobile = false }: NavLinkProps) {
    const pathName = usePathname()
    const isActive = pathName === href

    let baseClass = styles['nav__link']
    let activeClass = styles['nav__link__active']

    if (dropdown) {
        baseClass = styles['header-admin__link']
        activeClass = styles['header-admin__link__active']
    } else if (mobile) {
        baseClass = styles['mobile__menu__link']
        activeClass = styles['mobile__menu__link--active']
    }

    return (
        <Link
            href={href}
            className={`${baseClass} ${isActive ? activeClass : ''}`}
        >
            {children}
        </Link>
    )
}