export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-dark-700 border-t-gold-500 rounded-full animate-spin" />
        <p className="text-dark-400 font-medium">Carregando...</p>
      </div>
    </div>
  );
}
