export const articleCategories = ["Gastronomie", "Culture", "Cuisine", "Lifestyle", "Restaurant", "Chef"];

export const articles = [
  {
    id: "a1",
    slug: "art-de-la-pastilla",
    title: "L'art de la pastilla, entre héritage et modernité",
    subtitle: "Comment un plat de fête traditionnel devient signature",
    category: "Gastronomie",
    date: "2026-06-02",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1400&q=80",
    excerpt:
      "Retour sur la réinvention de la pastilla par le chef Youssef El Amrani, entre respect du geste ancestral et précision contemporaine.",
    content: [
      "La pastilla occupe une place particulière dans la mémoire culinaire marocaine. Plat de fête par excellence, elle raconte des heures de préparation, de patience et de transmission entre générations.",
      "Chez Maison Noor, le chef Youssef El Amrani a choisi de préserver le geste traditionnel du feuilletage de la warqa tout en épurant la composition : moins de sucre, plus de structure, une cuisson qui préserve le croustillant jusqu'à la dernière bouchée.",
      "« Je ne cherche pas à réinventer la pastilla, je cherche à lui redonner sa juste intensité », explique le chef. Ce travail de précision se retrouve dans l'ensemble de la carte de Maison Noor.",
    ],
  },
  {
    id: "a2",
    slug: "produits-terroir-atlas",
    title: "Sur les routes de l'Atlas : à la rencontre des producteurs",
    subtitle: "Le sourcing, colonne vertébrale de notre cuisine",
    category: "Cuisine",
    date: "2026-05-14",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1400&q=80",
    excerpt:
      "Safran, huile d'argan, amandes : nos équipes sillonnent l'Atlas pour sélectionner les meilleurs produits du terroir marocain.",
    content: [
      "Chaque semaine, notre équipe cuisine se déplace dans les vallées de l'Atlas pour rencontrer les producteurs qui alimentent notre carte.",
      "Cette relation directe permet de garantir une traçabilité complète et de soutenir une agriculture locale respectueuse des saisons.",
      "Le safran de Taliouine, l'huile d'argan de la coopérative féminine d'Essaouira ou les amandes de la vallée du Draa sont autant d'exemples de ce sourcing exigeant.",
    ],
  },
  {
    id: "a3",
    slug: "architecture-maison-noor",
    title: "L'architecture de Maison Noor : dialogue entre pierre et lumière",
    subtitle: "Une identité contemporaine ancrée dans Marrakech",
    category: "Restaurant",
    date: "2026-04-22",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1400&q=80",
    excerpt:
      "Retour sur la conception architecturale du restaurant, pensée comme un écrin contemporain pour une cuisine marocaine réinventée.",
    content: [
      "Dès la conception du restaurant, l'objectif était clair : éviter les clichés attendus d'un restaurant marocain tout en conservant une âme profondément locale.",
      "Le résultat est un espace où la pierre, le bois brut et la lumière naturelle dialoguent avec des lignes contemporaines épurées.",
      "Chaque salle a été pensée comme une séquence différente de l'expérience Maison Noor, de l'accueil feutré à la terrasse ouverte sur les jardins.",
    ],
  },
  {
    id: "a4",
    slug: "portrait-chef-youssef",
    title: "Portrait : Youssef El Amrani, une cuisine sans nostalgie",
    subtitle: "Rencontre avec le chef exécutif de Maison Noor",
    category: "Chef",
    date: "2026-03-08",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1400&q=80",
    excerpt:
      "Formé entre Marrakech, Lyon et Tokyo, le chef Youssef El Amrani nous parle de sa vision d'une cuisine marocaine résolument actuelle.",
    content: [
      "Après des années passées dans des cuisines étoilées en France et au Japon, Youssef El Amrani revient au Maroc avec une conviction forte : la cuisine marocaine n'a pas besoin d'être figée dans le passé pour être respectée.",
      "« Je ne cuisine pas la nostalgie. Je cuisine ce que le Maroc devient », résume-t-il.",
      "Cette philosophie infuse chaque assiette servie à Maison Noor, entre technique rigoureuse et racines assumées.",
    ],
  },
  {
    id: "a5",
    slug: "brunch-dominical-rituel",
    title: "Pourquoi le brunch du dimanche est devenu un rituel à Marrakech",
    subtitle: "Un rendez-vous hebdomadaire attendu",
    category: "Lifestyle",
    date: "2026-02-18",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1400&q=80",
    excerpt:
      "Retour sur l'engouement autour de notre brunch dominical, devenu un rendez-vous incontournable de la vie marrakchie.",
    content: [
      "Lancé il y a deux ans, le brunch dominical de Maison Noor s'est rapidement imposé comme un rendez-vous hebdomadaire pour les habitués comme pour les visiteurs de passage.",
      "Entre le buffet généreux, l'ambiance musicale live et la terrasse ombragée, l'expérience dépasse le simple repas.",
      "Un succès qui confirme l'appétit de Marrakech pour des formats conviviaux et décontractés, sans compromis sur la qualité.",
    ],
  },
  {
    id: "a6",
    slug: "zellige-artisanat-contemporain",
    title: "Le zellige revisité : quand l'artisanat rencontre le contemporain",
    subtitle: "Un savoir-faire séculaire au service d'un design actuel",
    category: "Culture",
    date: "2026-01-30",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=1400&q=80",
    excerpt:
      "Comment nos artisans ont adapté le zellige traditionnel à une esthétique résolument contemporaine pour habiller nos espaces.",
    content: [
      "Le zellige, art ancestral du Maroc, orne discrètement certains espaces de Maison Noor sans jamais dominer le propos architectural.",
      "Nos artisans ont travaillé des compositions monochromes et des formats inédits pour l'inscrire dans une esthétique contemporaine.",
      "Un exemple parmi d'autres de la manière dont Maison Noor dialogue avec l'artisanat marocain sans céder au folklore.",
    ],
  },
];

export const getArticleBySlug = (slug) => articles.find((a) => a.slug === slug);
export const getFeaturedArticle = () => articles.find((a) => a.featured) || articles[0];
export const getRelatedArticles = (article, count = 3) =>
  articles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, count);
