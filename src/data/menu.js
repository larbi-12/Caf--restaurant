export const categories = [
  "Entrées",
  "Plats",
  "Desserts",
  "Café",
  "Boissons",
  "Cocktails",
  "Brunch",
];

export const dishes = [
  {
    id: "d1",
    slug: "tajine-agneau-confit",
    name: "Tajine d'agneau confit",
    category: "Plats",
    description:
      "Épaule d'agneau confite douze heures, pruneaux d'Ouarzazate, amandes torréfiées et jus corsé aux épices de Marrakech.",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
    ingredients: ["Agneau", "Pruneaux", "Amandes", "Oignons confits", "Ras el hanout"],
    allergens: ["Fruits à coque"],
    featured: true,
  },
  {
    id: "d2",
    slug: "pastilla-royale",
    name: "Pastilla royale",
    category: "Entrées",
    description:
      "Pigeon fermier, amandes, cannelle et sucre glace enveloppés dans une feuille de warqa croustillante, façon Maison Noor.",
    price: 160,
    image:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1200&q=80",
    ingredients: ["Pigeon", "Amandes", "Cannelle", "Warqa", "Oeuf"],
    allergens: ["Gluten", "Fruits à coque", "Oeuf"],
    featured: true,
  },
  {
    id: "d3",
    slug: "risotto-truffe",
    name: "Risotto aux truffes",
    category: "Plats",
    description:
      "Riz carnaroli, crème de parmesan 24 mois, truffe noire fraîche râpée minute et huile d'olive de l'Atlas.",
    price: 240,
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=1200&q=80",
    ingredients: ["Riz carnaroli", "Truffe noire", "Parmesan", "Beurre", "Huile d'olive"],
    allergens: ["Lactose"],
    featured: true,
  },
  {
    id: "d4",
    slug: "cheesecake-fleur-oranger",
    name: "Cheesecake fleur d'oranger",
    category: "Desserts",
    description:
      "Cheesecake basque à la fleur d'oranger de Marrakech, biscuit sablé aux amandes, coulis d'agrumes.",
    price: 95,
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=1200&q=80",
    ingredients: ["Fromage frais", "Fleur d'oranger", "Amandes", "Agrumes"],
    allergens: ["Lactose", "Gluten", "Fruits à coque"],
    featured: true,
  },
  {
    id: "d5",
    slug: "salade-orange-cannelle",
    name: "Salade d'orange à la cannelle",
    category: "Entrées",
    description: "Oranges de saison, cannelle de Ceylan, fleur d'oranger et pistaches concassées.",
    price: 75,
    image:
      "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=1200&q=80",
    ingredients: ["Orange", "Cannelle", "Pistache", "Fleur d'oranger"],
    allergens: ["Fruits à coque"],
    featured: false,
  },
  {
    id: "d6",
    slug: "harira-traditionnelle",
    name: "Harira traditionnelle",
    category: "Entrées",
    description: "Soupe marocaine mijotée aux lentilles, pois chiches, tomate et herbes fraîches.",
    price: 65,
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&q=80",
    ingredients: ["Lentilles", "Pois chiches", "Tomate", "Céleri", "Coriandre"],
    allergens: ["Gluten"],
    featured: false,
  },
  {
    id: "d7",
    slug: "couscous-sept-legumes",
    name: "Couscous royal sept légumes",
    category: "Plats",
    description: "Semoule roulée à la main, légumes de saison, agneau et poulet fermier braisés.",
    price: 190,
    image:
      "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=1200&q=80",
    ingredients: ["Semoule", "Agneau", "Poulet", "Légumes de saison"],
    allergens: ["Gluten"],
    featured: false,
  },
  {
    id: "d8",
    slug: "poisson-chermoula",
    name: "Poisson du jour à la chermoula",
    category: "Plats",
    description: "Pêche du jour d'Essaouira, marinade chermoula, légumes grillés à la braise.",
    price: 210,
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200&q=80",
    ingredients: ["Poisson", "Coriandre", "Ail", "Citron confit"],
    allergens: ["Poisson"],
    featured: false,
  },
  {
    id: "d9",
    slug: "baklava-noor",
    name: "Baklava Maison Noor",
    category: "Desserts",
    description: "Feuilleté croustillant, miel d'oranger, pistaches et amandes fraîchement torréfiées.",
    price: 70,
    image:
      "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=1200&q=80",
    ingredients: ["Pâte filo", "Pistache", "Amande", "Miel"],
    allergens: ["Gluten", "Fruits à coque"],
    featured: false,
  },
  {
    id: "d10",
    slug: "cafe-specialty-atlas",
    name: "Café Specialty de l'Atlas",
    category: "Café",
    description: "Grains torréfiés en micro-lot, extraction lente, notes de fruits rouges et cacao.",
    price: 45,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
    ingredients: ["Café arabica"],
    allergens: [],
    featured: false,
  },
  {
    id: "d11",
    slug: "the-menthe-signature",
    name: "Thé à la menthe signature",
    category: "Boissons",
    description: "Thé vert Gunpowder, menthe fraîche du jardin, service traditionnel à la théière.",
    price: 40,
    image:
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=1200&q=80",
    ingredients: ["Thé vert", "Menthe fraîche"],
    allergens: [],
    featured: false,
  },
  {
    id: "d12",
    slug: "cocktail-safran-gin",
    name: "Safran & Gin Fizz",
    category: "Cocktails",
    description: "Gin infusé au safran, citron frais, sirop de fleur d'oranger, tonic artisanal.",
    price: 110,
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80",
    ingredients: ["Gin", "Safran", "Citron", "Fleur d'oranger"],
    allergens: [],
    featured: false,
  },
  {
    id: "d13",
    slug: "oeufs-brouilles-truffe",
    name: "Oeufs brouillés à la truffe",
    category: "Brunch",
    description: "Oeufs fermiers brouillés minute, truffe noire, brioche maison toastée.",
    price: 95,
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1200&q=80",
    ingredients: ["Oeufs", "Truffe noire", "Brioche", "Beurre"],
    allergens: ["Gluten", "Oeuf", "Lactose"],
    featured: false,
  },
  {
    id: "d14",
    slug: "msemen-miel-amlou",
    name: "Msemen, miel et amlou",
    category: "Brunch",
    description: "Msemen doré au beurre, miel de fleurs d'oranger, amlou d'argan maison.",
    price: 60,
    image:
      "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=1200&q=80",
    ingredients: ["Farine", "Beurre", "Argan", "Amandes", "Miel"],
    allergens: ["Gluten", "Fruits à coque"],
    featured: false,
  },
];

export const getDishBySlug = (slug) => dishes.find((d) => d.slug === slug);
export const getFeaturedDishes = () => dishes.filter((d) => d.featured);
export const getRelatedDishes = (dish, count = 3) =>
  dishes.filter((d) => d.category === dish.category && d.id !== dish.id).slice(0, count);
