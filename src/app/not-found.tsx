export default function NotFound() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20 text-center">
      <h1 className="text-3xl md:text-4xl font-medium mb-4">Nie znaleziono strony</h1>
      <p className="opacity-80 mb-8">
        Sprawdź adres lub wróć na stronę główną, by zobaczyć działki i mapę.
      </p>
      <a href="/" className="underline">Wróć do strony głównej</a>
    </main>
  );
}
