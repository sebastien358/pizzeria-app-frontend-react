import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function testimonialListHome() {
    try {
        const response = await axios.get(`${BASE_URL}/api/testimonial/home`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des témoignages (home) : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function testimonialList(currentPage: number, limit: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/testimonial/list`, {
            params: {
                currentPage,
                limit
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des témoignages : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function newTestimonial(formData: FormData) {
    try {
        const response = await axios.post(`${BASE_URL}/api/testimonial/add`, formData)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de l'ajout d'un témoignage : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}