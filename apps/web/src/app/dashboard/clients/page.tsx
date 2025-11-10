export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Клиенты</h1>
        <p className="text-muted-foreground">
          Управление базой клиентов автосервиса
        </p>
      </div>
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          Здесь будет таблица клиентов с поиском и фильтрами (shadcn DataTable)
        </p>
      </div>
    </div>
  )
}
