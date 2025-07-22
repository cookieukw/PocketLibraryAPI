// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Define os cabeçalhos CORS que serão aplicados a todas as respostas da API.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Permite qualquer origem. Para produção, considere restringir a `https://bpocket.vercel.app`.
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
};

export function middleware(request: NextRequest) {
  // 1. Trata as requisições de "pre-flight" (OPTIONS).
  // O navegador envia isso antes de requisições complexas (como GET com headers customizados) para verificar as permissões de CORS.
  if (request.method === 'OPTIONS') {
    // Responde imediatamente com os cabeçalhos CORS e um status 204 (No Content).
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // 2. Deixa a requisição prosseguir para a rota de API correspondente.
  const response = NextResponse.next();

  // 3. Adiciona os cabeçalhos CORS à resposta final que será enviada ao cliente.
  // Isso garante que TODAS as respostas (sucesso ou erro) tenham os cabeçalhos corretos.
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.append(key, value);
  });

  return response;
}

// O "matcher" especifica em quais rotas este middleware deve ser executado.
// Isso evita que ele rode em páginas normais, focando apenas na sua API.
export const config = {
  matcher: '/api/:path*',
};
