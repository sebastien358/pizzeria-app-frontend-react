"use client"

import React, { useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useAuthStore } from "@/store/auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { token, isAdmin, hasHydrated } = useAuthStore()

    useEffect(() => {
        if (!hasHydrated) return // attend que le store soit vraiment chargé

        if (!token || !isAdmin()) {
            router.push('/')
        }
    }, [token, hasHydrated])

    if (!hasHydrated) {
        return null // ou un loader si tu préfères
    }

    return <>{children}</>
}