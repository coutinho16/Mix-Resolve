import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { DEMO_MODE } from "@/lib/demo/mode";
import { createMockAdminClient } from "@/lib/demo/mockClient";
import type { Database } from "./types";

/**
 * Client com a service role key. Só pode ser importado por código server-only
 * (Route Handlers), nunca por Client Components ou Server Components renderizados
 * com dados do usuário — o import "server-only" acima quebra o build se isso acontecer.
 */
export function createAdminClient() {
  if (DEMO_MODE) {
    return createMockAdminClient() as unknown as ReturnType<
      typeof createSupabaseClient<Database>
    >;
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
