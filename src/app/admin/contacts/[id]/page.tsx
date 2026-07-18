'use client'

import ContactAdminDetails from "@/features/admin/contact/ContactAdminDetails";
import {useParams} from "next/navigation";
import {useContactAdminStore} from "@/store/admin/contactAdmin";
import {useEffect} from "react";

export default function Page() {
    const { id } = useParams<{id: string}>()
    const { contactAdminDetails, currentContact, contactAdminIsPublished, contactAdminDelete, loading } = useContactAdminStore()

    useEffect(() => {
        if (id) {
            contactAdminDetails(id)
        }
    }, [id]);

    return <ContactAdminDetails
        currentContact={currentContact}
        loading={loading}
        id={id}
        contactAdminIsPublished={contactAdminIsPublished}
        contactAdminDelete={contactAdminDelete}
    />
}