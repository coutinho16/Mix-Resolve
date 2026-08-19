import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

const LOGO_PATH = path.join(process.cwd(), "public", "assets", "logo.svg");

interface LogoProps {
  className?: string;
}

/**
 * Enquanto o arquivo público public/assets/logo.svg não for anexado pela Mix Resolve,
 * renderiza o wordmark em texto ("mix." + "RESOLVE") seguindo a identidade descrita no
 * briefing, para não deixar a tela vazia nem inventar uma logo fictícia.
 */
export function Logo({ className = "" }: LogoProps) {
  const temArquivo = fs.existsSync(LOGO_PATH);

  if (temArquivo) {
    return (
      <Image
        src="/assets/logo.svg"
        alt="Mix Resolve"
        width={160}
        height={64}
        className={className}
      />
    );
  }

  return (
    <div className={`font-titulo leading-none ${className}`}>
      <span className="text-2xl font-bold lowercase text-laranja">mix.</span>
      <div className="mt-0.5 text-xs font-semibold tracking-[0.2em] text-preto">
        RESOLVE
      </div>
    </div>
  );
}
