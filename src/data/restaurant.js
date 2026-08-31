export const restaurant = {
  name: "Maison Noor",
  tagline: "Une nouvelle expression de la cuisine marocaine.",
  city: "Marrakech",
  country: "Maroc",
  address: "12 Rue Ibn Aicha, Guéliz, Marrakech 40000",
  phone: "+212 5 24 12 34 56",
  phoneDisplay: "+212 524 12 34 56",
  whatsapp: "212600112233",
  email: "contact@maisonnoor.ma",
  hoursShort: "12:00 — 00:00",
  hours: [
    { day: "Lundi — Jeudi", time: "12:00 — 23:00" },
    { day: "Vendredi — Samedi", time: "12:00 — 00:30" },
    { day: "Dimanche", time: "10:00 — 22:00 (Brunch)" },
  ],
  social: {
    instagram: "https://instagram.com/maisonnoor",
    facebook: "https://facebook.com/maisonnoor",
  },
  mapsEmbed:
    "https://www.google.com/maps?q=Guéliz,Marrakech,Morocco&output=embed",
  mapsDirections: "https://www.google.com/maps/dir/?api=1&destination=Guéliz,Marrakech,Morocco",
  stats: [
    { value: 12, suffix: "", label: "Années d'expérience" },
    { value: 48, suffix: "", label: "Créations signature" },
    { value: 4.9, suffix: "/5", label: "Note moyenne" },
    { value: 15000, suffix: "+", label: "Convives reçus" },
  ],
  chef: {
    name: "Youssef El Amrani",
    role: "Chef Exécutif",
    bio: "Formé entre Marrakech, Lyon et Tokyo, le chef Youssef El Amrani façonne une cuisine qui dialogue avec la tradition marocaine sans jamais s'y enfermer. Sa cuisine, précise et sensorielle, révèle les produits du terroir marocain à travers un regard contemporain.",
    quote: "Je ne cuisine pas la nostalgie. Je cuisine ce que le Maroc devient.",
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&q=80",
  },
};
