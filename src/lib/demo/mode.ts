// Modo demonstração: liga automaticamente quando não há projeto Supabase configurado
// em .env.local (nenhuma URL definida). Assim que o projeto real existir e as chaves
// forem preenchidas, o app volta a usar o Supabase de verdade sem precisar mudar nada.
export const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL;
