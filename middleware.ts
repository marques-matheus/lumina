    // src/middleware.ts
    import { NextResponse } from 'next/server'
    import type { NextRequest } from 'next/server'

    export function middleware(request: NextRequest) {
      const currentUser = false; // Simula autenticação

      if (!currentUser) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }

    export const config = {
      matcher: [ '/((?!_next/static|_next/image|favicon.ico|auth/login|auth/register).*)', ], // Aplica o middleware a todas as rotas
    }