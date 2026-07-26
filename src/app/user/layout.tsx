"use client"

import React, { useEffect } from "react"
import {useAuthStore} from "@/store/auth";
import {useRouter} from "next/navigation";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { token, isUser, hasHydrated } = useAuthStore()

    useEffect(() => {
        if (!hasHydrated) return // attend que le store soit vraiment chargé

        if (!token || !isUser()) {
            router.push('/login')
        }
    }, [token, hasHydrated])

    if (!hasHydrated) {
        return null // ou un loader si tu préfères
    }

    return <>{children}</>
}