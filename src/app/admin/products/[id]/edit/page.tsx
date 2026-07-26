'use client'

import ProductAdminForm from "@/features/admin/product/ProductAdminForm"
import {useProductAdmin} from "@/store/admin/productAdmin";
import {useParams} from "next/navigation";
import {useEffect} from "react";

export default function EditPage() {
    const { productAdminDetails, currentProduct } = useProductAdmin()

    const {id} = useParams<{id: string}>()

    useEffect(() => {
        if (id) productAdminDetails(id)
    }, [id])

    return <ProductAdminForm currentProduct={currentProduct} productId={id}  />
}