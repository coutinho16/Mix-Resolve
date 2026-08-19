import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DEMO_MODE } from "@/lib/demo/mode";
import { createMockServerClient } from "@/lib/demo/mockClient";
import type { Database } from "./types";

export async function createClient(): Promise<SupabaseClient<Database>> {
  if (DEMO_MODE) {
    return (await createMockServerClient()) as unknown as SupabaseClient<Database>;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // chamado a partir de um Server Component sem permissão de escrita;
            // o middleware já cuida de renovar a sessão nesse caso
          }
        },
      },
    }
  );
}
