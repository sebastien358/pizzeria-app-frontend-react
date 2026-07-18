import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function productList(offset: number, limit: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/product/list`, {
            params: {
                offset, limit
            }
        })

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(`Erreur de la récupération des produits : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function productSearch(term: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/product/search`, {
            params: {
                search: term
            }
        })

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(`Erreur de la filtration des produits (input search) : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}