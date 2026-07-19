import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, importSPKI } from 'jose'

function getPublicKeyPem(): string {
    const raw = process.env.JWT_PUBLIC_KEY!
    const base64 = raw
        .replace('-----BEGIN PUBLIC KEY-----', '')
        .replace('-----END PUBLIC KEY-----', '')
        .replace(/\s+/g, '')
    const lines = base64.match(/.{1,64}/g) || []
    return `-----BEGIN PUBLIC KEY-----\n${lines.join('\n')}\n-----END PUBLIC KEY-----`
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        const publicKey = await importSPKI(getPublicKeyPem(), 'RS256')
        const { payload } = await jwtVerify(token, publicKey)

        const roles = payload.roles as string[]

        if (!roles.includes('ROLE_ADMIN')) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    } catch (err) {
        console.error('JWT verify failed:', err)
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*']
}