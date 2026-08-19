import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEMO_MODE } from "@/lib/demo/mode";
import { usuarios } from "@/lib/demo/store";

async function middlewareDemo(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isGestaoRoute = pathname.startsWith("/gestao");
  const isCampoRoute = pathname.startsWith("/campo");

  if (!isGestaoRoute && !isCampoRoute) return NextResponse.next();

  const usuarioId = request.cookies.get("demo_usuario_id")?.value;
  if (!usuarioId) {
    const loginPath = isGestaoRoute ? "/login/gestao" : "/login/campo";
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  const usuario = usuarios.find((u) => u.id === usuarioId);
  if (!usuario) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isGestaoRoute && usuario.perfil !== "gestao") {
    return NextResponse.redirect(new URL("/campo/tarefas", request.url));
  }
  if (isCampoRoute && usuario.perfil !== "campo") {
    return NextResponse.redirect(new URL("/gestao/dashboard", request.url));
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  if (DEMO_MODE) {
    return middlewareDemo(request);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isGestaoRoute = pathname.startsWith("/gestao");
  const isCampoRoute = pathname.startsWith("/campo");

  if (!isGestaoRoute && !isCampoRoute) {
    return response;
  }

  if (!user) {
    const loginPath = isGestaoRoute ? "/login/gestao" : "/login/campo";
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("perfil")
    .eq("id", user.id)
    .single();

  if (!usuario) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isGestaoRoute && usuario.perfil !== "gestao") {
    return NextResponse.redirect(new URL("/campo/tarefas", request.url));
  }

  if (isCampoRoute && usuario.perfil !== "campo") {
    return NextResponse.redirect(new URL("/gestao/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/gestao/:path*", "/campo/:path*"],
};
