const BASE = "https://slok.com.pl";

export default function SeoSiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${BASE}/#organizacja`,
    name: "Osada SŁOK",
    legalName: "Słok Sp. z o.o.",
    url: BASE,
    logo: `${BASE}/logo-mobile.png`,
    image: `${BASE}/og.jpg`,
    description:
      "Działki budowlane, usługowe i rekreacyjne nad zbiornikiem Słok, 9 km od Bełchatowa. Prąd i woda, obowiązujący miejscowy plan zagospodarowania przestrzennego.",
    email: "sprzedaz@slok.com.pl",
    telephone: "+48519770923",
    address: {
      "@type": "PostalAddress",
      addressCountry: "PL",
      addressRegion: "łódzkie",
      addressLocality: "Słok",
      postalCode: "97-400",
      streetAddress: "Słok",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.349,
      longitude: 19.333,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "powiat bełchatowski",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
