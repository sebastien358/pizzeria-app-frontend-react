import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosTestimonialAdminList(currentPage: number, limit: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/testimonials/list`, {
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

export async function axiosTestimonialAdminSearch(trimmed: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/testimonials/search`, {
            params: {
                search: trimmed
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la recherche des témoignages (search) : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosTestimonialDetails(id: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/testimonials/current/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération d'un témoignage : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosTestimonialAdminPublished(id: string) {
    try {
        const response = await axios.patch(`${BASE_URL}/api/admin/testimonials/published/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur toggle affichage du témoignage : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosTestimonialAdminDelete(id: number) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/admin/testimonials/current/${id}/delete`)
        if (response.status === 200 || response.status === 204) {
            return response.data
        }
        throw new Error(`Erreur de la suppression d'un témoignage : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

