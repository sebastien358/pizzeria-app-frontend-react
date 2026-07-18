'use client'

import {ResetPassword} from "@/features/pizzeria/components/reset-password/ResetPassword";
import {useParams} from "next/navigation";

export default function Page() {
    const { token } = useParams<{token: string}>()

    if (token) {
        return (
            <ResetPassword token={token} />
        )
    }
}