export default function FullScreenLoading({ text = "Carregando..." }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050b1a]">
      {/* Loader */}
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-[10px] border-blue-500/20"></div>

        <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-cyan-400 animate-spin"></div>

        <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-light">
          99%
        </div>
      </div>

      <p className="mt-6 text-zinc-400 text-lg">{text}</p>
    </div>
  );
}
