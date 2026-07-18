'use client'

import Footer from "@/components/Footer/Footer";

import {usePathname} from "next/navigation";
import styles from "@/app/layout.module.scss";
import React from "react";

export default function ConditionalFooter() {
    const pathname = usePathname()

    const isAdmin = pathname.startsWith('/admin')
    const isUser = pathname.startsWith('/user')

    if (isAdmin || isUser) return null

    return  (
        <Footer className={styles['layout__footer']} />
    )
}