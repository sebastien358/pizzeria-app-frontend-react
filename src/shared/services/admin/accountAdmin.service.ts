import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosAccountAdmin() {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/account/me`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des données utilisateur : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosAccountAdminEdit(id: number, data: {email: string, password: string}) {
    try {
        const response = await axios.patch(`${BASE_URL}/api/admin/account/edit/${id}`, data)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la modification des données utilisateur : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}