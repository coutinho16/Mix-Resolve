export function ProgressoChecklist({
  confirmados,
  total,
}: {
  confirmados: number;
  total: number;
}) {
  const percentual = total === 0 ? 0 : Math.round((confirmados / total) * 100);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs text-neutro-1">
        <span>
          {confirmados} de {total} itens
        </span>
        <span>{percentual}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutro-2">
        <div
          className="h-full bg-laranja transition-all"
          style={{ width: `${percentual}%` }}
        />
      </div>
    </div>
  );
}
