import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://avoroni.com"),
  title: {
    default: "আভরণী (AVORONI) | Haute Saree Maison & Heritage Textiles | Dhaka, Bangladesh",
    template: "%s | আভরণী (AVORONI)",
  },
  description:
    "আভরণী (Avoroni) - বাংলাদেশের ঐতিহ্যবাহী ঢাকাই জামদানি, মীরপুর বেনারসি কাতান, রাজশাহী সিল্ক ও উপমহাদেশের অনন্য তাঁতশিল্পের শীর্ষ লাক্সারি শাড়ি সম্ভার। বনানী স্টুডিও, ঢাকা। সারা দেশে ক্যাশ অন ডেলিভারি (COD)।",
  keywords: [
    "আভরণী",
    "Avoroni",
    "avoroni saree",
    "ঢাকাই জামদানি",
    "মীরপুর কাতান",
    "রাজশাহী সিল্ক",
    "বেনারসি শাড়ি",
    "কাঞ্জিভরম",
    "luxury saree bangladesh",
    "saree online bd",
    "cash on delivery saree dhaka",
    "bridal saree boutique banani",
  ],
  authors: [{ name: "Avoroni Atelier Dhaka" }],
  creator: "Avoroni Atelier",
  publisher: "Avoroni Atelier",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    url: "https://avoroni.com",
    siteName: "আভরণী (Avoroni Atelier)",
    title: "আভরণী (AVORONI) | Haute Saree Maison & Heritage Handlooms",
    description:
      "ঐতিহ্যবাহী ঢাকাই জামদানি, মীরপুর কাতান ও রাজশাহী সিল্ক শাড়ির অভিজাত সম্ভার। বনানী স্টুডিও, ঢাকা। ১-ক্লিকে ক্যাশ অন ডেলিভারি অর্ডার।",
    images: [
      {
        url: "/images/hero/hero-saree.png",
        width: 1200,
        height: 630,
        alt: "Avoroni Haute Saree Maison Dhaka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "আভরণী (AVORONI) | Haute Saree Maison",
    description:
      "ঐতিহ্যবাহী ঢাকাই জামদানি, মীরপুর কাতান ও সিল্ক শাড়ির অভিজাত সম্ভার। ১-ক্লিক ক্যাশ অন ডেলিভারি।",
    images: ["/images/hero/hero-saree.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/avoroni_crest_gold.png", type: "image/png" },
    ],
    apple: "/images/avoroni_crest_gold.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased selection:bg-burgundy selection:text-ivory`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Serif+Bengali:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://avoroni.com/#organization",
                  "name": "Avoroni Atelier (আভরণী)",
                  "alternateName": "আভরণী",
                  "url": "https://avoroni.com",
                  "logo": "https://avoroni.com/images/avoroni_logo_dark.png",
                  "sameAs": [
                    "https://www.facebook.com/avoroni",
                    "https://www.instagram.com/avoroni"
                  ],
                  "contactPoint": [
                    {
                      "@type": "ContactPoint",
                      "telephone": "+8801712345678",
                      "contactType": "customer service",
                      "areaServed": "BD",
                      "availableLanguage": ["Bengali", "English"]
                    }
                  ]
                },
                {
                  "@type": "ClothingStore",
                  "@id": "https://avoroni.com/#store",
                  "name": "আভরণী (AVORONI Atelier) - Luxury Saree Maison",
                  "image": "https://avoroni.com/images/hero/hero-saree.png",
                  "telephone": "+8801712345678",
                  "priceRange": "৳৳৳",
                  "currenciesAccepted": "BDT",
                  "paymentAccepted": "Cash on Delivery, bKash, Card",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "House 42, Road 11, Block D, Banani",
                    "addressLocality": "Dhaka",
                    "postalCode": "1213",
                    "addressCountry": "BD"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 23.7937,
                    "longitude": 90.4066
                  },
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday"
                      ],
                      "opens": "11:00",
                      "closes": "20:00"
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full bg-ivory text-dark font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
