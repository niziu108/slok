export default function SeoSiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Osada SŁOK",
    url: "https://slok.pl",
    logo: "https://slok.pl/logo-mobile.png",
    address: {
      "@type": "PostalAddress",
      addressCountry: "PL",
      addressLocality: "Bełchatów",
      streetAddress: "okolice zbiornika Słok",
    },
    department: {
      "@type": "Place",
      name: "Osada SŁOK – działki",
      geo: { "@type": "GeoCoordinates", latitude: 51.349, longitude: 19.333 }, // podmień na dokładne
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
