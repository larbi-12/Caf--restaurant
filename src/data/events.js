export const events = [
  {
    id: "ev1",
    slug: "brunch-live-music",
    title: "Brunch & Live Music",
    date: "2026-08-30",
    time: "10:00 — 14:00",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80",
    description:
      "Notre brunch dominical s'accompagne ce jour-là d'un trio acoustique jouant des reprises jazz et gnaoua sur la terrasse.",
    program: ["10:00 — Ouverture du buffet", "11:30 — Début du set live", "14:00 — Fermeture"],
    menuSpecial: "Buffet brunch complet + coin pâtisserie signature",
    price: "290 MAD / personne",
    seats: "40 places",
    location: "Terrasse Maison Noor",
  },
  {
    id: "ev2",
    slug: "chefs-table-exception",
    title: "Chef's Table d'exception",
    date: "2026-09-12",
    time: "20:00",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
    description:
      "Une édition spéciale de notre Chef's Table avec un menu 11 services inspiré des produits de fin d'été de l'Atlas.",
    program: ["20:00 — Accueil et mise en bouche", "20:30 — Début du menu dégustation", "23:30 — Fin de service"],
    menuSpecial: "Menu dégustation 11 services, accords mets et vins inclus",
    price: "1 500 MAD / personne",
    seats: "6 places",
    location: "Cuisine ouverte",
  },
  {
    id: "ev3",
    slug: "soiree-ramadan",
    title: "Ftour Ramadan Signature",
    date: "2027-03-10",
    time: "19:00",
    image:
      "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=1200&q=80",
    description:
      "Un ftour raffiné célébrant les classiques du Ramadan revisités par le chef, servi dans notre salle principale.",
    program: ["19:00 — Rupture du jeûne", "19:30 — Service du menu", "22:00 — Thé et pâtisseries"],
    menuSpecial: "Menu ftour 5 services",
    price: "350 MAD / personne",
    seats: "80 places",
    location: "Salle principale",
  },
  {
    id: "ev4",
    slug: "reveillon-nouvel-an",
    title: "Réveillon du Nouvel An",
    date: "2026-12-31",
    time: "20:30",
    image:
      "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1200&q=80",
    description:
      "Maison Noor célèbre le passage à la nouvelle année avec un dîner de gala, DJ set et compte à rebours sur la terrasse.",
    program: ["20:30 — Cocktail de bienvenue", "21:30 — Dîner de gala", "00:00 — Compte à rebours & feu d'artifice", "00:30 — DJ set"],
    menuSpecial: "Menu de gala 7 services + coupe de champagne",
    price: "2 200 MAD / personne",
    seats: "100 places",
    location: "Salle principale & terrasse",
  },
];

export const getEventBySlug = (slug) => events.find((e) => e.slug === slug);
export const getUpcomingEvents = (count = 3) =>
  [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, count);
