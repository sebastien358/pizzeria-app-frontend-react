"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {useAuthStore} from "@/store/auth";


export default function AdminLayout({ children }) {
    const router = useRouter()
    const { isAdmin, token } = useAuthStore()

    useEffect(() => {
        if (!token || !isAdmin) {
            router.push('/')
        }
    }, [token]);

    return <>{children}</>
}