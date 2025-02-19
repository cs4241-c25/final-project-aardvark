export default function GameHeader({ category }: { category: string }) {
  return (
    <header className="text-center mt-2 mx-auto">
      <h1 className="font-funnel font-black text-6xl">Consensus</h1>
      <div className="flex justify-between">
        <p className="ml-1">Category: {category}</p>
        <p>#001</p>
      </div>
    </header>
  );
}