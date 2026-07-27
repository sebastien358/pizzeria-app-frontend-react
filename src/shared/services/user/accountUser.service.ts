import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosAccountUserDetails() {
    try {
        const response = await axios.get(`${BASE_URL}/api/user/account/me`)
        if (response.status <= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération d'un utilisateur : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAccountUserEdit(id: number, data: { email: string; password: string }) {
    try {
        const response = await axios.patch(`${BASE_URL}/api/user/account/edit/${id}`, data)
        if (response.status <= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la modification des données d'un utilisateur : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAccountDeleteUser() {
    try {
        const response = await axios.delete(`${BASE_URL}/api/user/account/delete`)
        if (response.status === 200 || response.status === 204) {
            return response.data
        }
        throw new Error(`Erreur de la supression d'un compte utilisateur : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}