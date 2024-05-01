export default function room() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-4 p-4 overflow-auto">
      <section className="flex-grow bg-gray-300 rounded-3xl xl:w-1/4 md:w-1/3 md:block hidden"></section>
      <main className="flex-grow bg-gray-600 rounded-3xl xl:w-1/2 md:w-2/3"></main>
      <section className="flex-grow bg-gray-900 rounded-3xl xl:w-1/4 md:block hidden"></section>
    </div>
  );
}
