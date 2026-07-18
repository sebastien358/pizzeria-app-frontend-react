'use client'

import Payment from "@/features/user/payment/Payment";
import {useParams} from "next/navigation";
import {useEffect} from "react";
import {useCommandUser} from "@/store/user/commandUser";

export default function Page() {
    const { id } = useParams<{id: string}>()

    const { commandUserDetails, profileCommand  } = useCommandUser()

    useEffect(() => {
        if (id) {
            commandUserDetails(id)
        }
    }, [id]);

    return <Payment profileCommandUser={profileCommand} routeParamsId={id} />
}