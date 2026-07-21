'use client'

import Link from "next/link";
import styles from './ProductAdminList.module.scss'
import InputSearch from "@/components/input-search/InputSearch";
import {useProductAdmin} from "@/store/admin/productAdmin";
import Pagination from "@/components/pagination/Pagination";
import {useEffect, useState} from "react";
import NotFound from "@/assets/images/not-found.webp"
import Image from "next/image";
import ModalConfirm from "@/modal/modal-confirm/ModalConfirm";

export default function ProductAdminList() {

    const {
        productAdminList,
        searchAdminProduct,
        nextPage,
        previousPage,
        deleteProduct,
        loading,
        products,
        term,
        currentPage,
        pages,
        totalProducts
    } = useProductAdmin()

    useEffect(() => {
        productAdminList()
    }, [])

    const [ openModalConfirm, setOpenModalConfirm ] = useState(false)
    const [ productId, setProductId ] = useState(null)

    const onClickDeleteProduct = async (id) => {
        setOpenModalConfirm(true)
        setProductId(id)
    }

    const onClickDelete = async () => {
        await deleteProduct(productId)
        await productAdminList()
        setOpenModalConfirm(false)
    }

    const onClickCloseModalConfirm = () => {
        setOpenModalConfirm(false)
    }

    return (
        <>
            {loading ? (
                <section className={styles['spinner']}>
                    <span className={styles['spinner__loader']}></span>
                </section>
            ) : (
                <section className={styles.page}>
                    <div className={styles['input-search']}>
                        <InputSearch search={searchAdminProduct} term={term} count={totalProducts} activeSearch='search-products-admin' />
                    </div>

                    {products.length > 0 ? (
                        <section className={styles.product}>
                            {products.map((product) => (

                                <div key={product.id} className={styles['product__list']}>
                                    <div className={styles['product__content']}>
                                        <Image
                                            src={product.pictures[0]?.filename || NotFound}
                                            className={styles['img-product']}
                                            alt={"image pizzas"}
                                            width={200}
                                            height={200}
                                        />
                                        <h4>{product.title}</h4>
                                    </div>
                                    <div className={styles['product__buttons']}>
                                        <Link href={`/admin/products/${product.id}/edit`} className={`${styles.btn} ${styles['btn-success']}`}>
                                            Modifier
                                        </Link>
                                        <button onClick={() => onClickDeleteProduct(product.id)} className={`${styles.btn} ${styles['btn-danger']}`}>
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {pages > 1 && (
                                <Pagination currentPage={currentPage} pages={pages} previousPage={previousPage} nextPage={nextPage} />
                            )}
                        </section>
                    ) : (
                        <section className={styles['no-product']}>
                            <p>Aucune pizza pour le moment.</p>
                        </section>
                    )}
                </section>
            )}
            <ModalConfirm
                openModalConfirm={openModalConfirm}
                onClickCloseModalConfirm={onClickCloseModalConfirm}
                onClickDelete={onClickDelete}
            />
        </>
    )
}