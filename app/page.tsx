export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <main className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          CI Intro Project
        </h1>
        <p className="text-lg mb-8">
          Base projet Next.js + TypeScript + Tailwind 4.0
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Button Test
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-colors">
            Secondary
          </button>
        </div>
      </main>
    </div>
  );
}
