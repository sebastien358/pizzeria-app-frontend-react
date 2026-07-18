'use client'

import TestimonialAdminDetails from '@/features/admin/testimonial/TestimonialAdminDetails'
import {useParams} from "next/navigation";
import {useEffect} from "react";
import {useTestimonialAdmin} from "@/store/admin/testimonialAdmin";

export default function Page() {
    const {id} = useParams<{id: string}>()

    const { testimonialDetails, currentTestimonial, publishedTestimonial, testimonialDelete, loading } = useTestimonialAdmin()

    useEffect(() => {
        if (id) {
            testimonialDetails(id)
        }
    }, [id]);

    return <TestimonialAdminDetails loading={loading} currentTestimonial={currentTestimonial} publishedTestimonial={publishedTestimonial} testimonialDelete={testimonialDelete} id={id}  />
}