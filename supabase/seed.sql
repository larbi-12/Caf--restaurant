-- ============================================================
-- Maison Noor — demo seed data
-- Run AFTER schema.sql. Safe to re-run (uses on conflict guards
-- where a natural key exists, otherwise clears first).
-- ============================================================

-- ------------------------------------------------------------
-- restaurant_settings
-- ------------------------------------------------------------
update restaurant_settings set
  restaurant_name = 'Maison Noor',
  tagline = 'Une nouvelle expression de la cuisine marocaine.',
  description = 'Restaurant & café premium à Marrakech. Cuisine marocaine contemporaine, café premium et expériences privées.',
  phone = '+212 5 24 12 34 56',
  email = 'contact@maisonnoor.ma',
  whatsapp = '212600112233',
  address = '12 Rue Ibn Aicha, Guéliz, Marrakech 40000',
  city = 'Marrakech',
  country = 'Maroc',
  google_maps_url = 'https://www.google.com/maps/dir/?api=1&destination=Guéliz,Marrakech,Morocco',
  instagram_url = 'https://instagram.com/maisonnoor',
  facebook_url = 'https://facebook.com/maisonnoor',
  opening_hours = '[
    {"day": "Lundi — Jeudi", "time": "12:00 — 23:00"},
    {"day": "Vendredi — Samedi", "time": "12:00 — 00:30"},
    {"day": "Dimanche", "time": "10:00 — 22:00 (Brunch)"}
  ]'::jsonb,
  hero_title = 'Une nouvelle expression de la cuisine marocaine.',
  hero_subtitle = 'Maison Noor — Marrakech',
  hero_description = 'Cuisine marocaine contemporaine, café premium et expériences privées, au cœur de Marrakech.',
  hero_image_url = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80',
  cta_text = 'Réserver une table',
  cta_link = '/reservation',
  primary_color = '#14110f',
  secondary_color = '#b08a4e'
where id = 1;

-- ------------------------------------------------------------
-- statistics
-- ------------------------------------------------------------
delete from statistics;
insert into statistics (label, value, suffix, display_order, is_active) values
  ('Années d''expérience', 12, '', 1, true),
  ('Créations signature', 48, '', 2, true),
  ('Note moyenne', 4.9, '/5', 3, true),
  ('Convives reçus', 15000, '+', 4, true);

-- ------------------------------------------------------------
-- menu_categories
-- ------------------------------------------------------------
insert into menu_categories (name, slug, display_order, is_active) values
  ('Entrées', 'entrees', 1, true),
  ('Plats', 'plats', 2, true),
  ('Desserts', 'desserts', 3, true),
  ('Café', 'cafe', 4, true),
  ('Boissons', 'boissons', 5, true),
  ('Cocktails', 'cocktails', 6, true),
  ('Brunch', 'brunch', 7, true)
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- menu_items
-- ------------------------------------------------------------
insert into menu_items (category_id, name, slug, description, price, image_url, ingredients, allergens, is_featured, is_available, display_order)
select c.id, v.name, v.slug, v.description, v.price, v.image_url, v.ingredients, v.allergens, v.is_featured, true, v.display_order
from (values
  ('plats', 'Tajine d''agneau confit', 'tajine-agneau-confit',
   'Épaule d''agneau confite douze heures, pruneaux d''Ouarzazate, amandes torréfiées et jus corsé aux épices de Marrakech.',
   220.00, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80',
   array['Agneau','Pruneaux','Amandes','Oignons confits','Ras el hanout'], array['Fruits à coque'], true, 1),
  ('entrees', 'Pastilla royale', 'pastilla-royale',
   'Pigeon fermier, amandes, cannelle et sucre glace enveloppés dans une feuille de warqa croustillante, façon Maison Noor.',
   160.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1200&q=80',
   array['Pigeon','Amandes','Cannelle','Warqa','Oeuf'], array['Gluten','Fruits à coque','Oeuf'], true, 2),
  ('plats', 'Risotto aux truffes', 'risotto-truffe',
   'Riz carnaroli, crème de parmesan 24 mois, truffe noire fraîche râpée minute et huile d''olive de l''Atlas.',
   240.00, 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=1200&q=80',
   array['Riz carnaroli','Truffe noire','Parmesan','Beurre','Huile d''olive'], array['Lactose'], true, 3),
  ('desserts', 'Cheesecake fleur d''oranger', 'cheesecake-fleur-oranger',
   'Cheesecake basque à la fleur d''oranger de Marrakech, biscuit sablé aux amandes, coulis d''agrumes.',
   95.00, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=1200&q=80',
   array['Fromage frais','Fleur d''oranger','Amandes','Agrumes'], array['Lactose','Gluten','Fruits à coque'], true, 4),
  ('entrees', 'Salade d''orange à la cannelle', 'salade-orange-cannelle',
   'Oranges de saison, cannelle de Ceylan, fleur d''oranger et pistaches concassées.',
   75.00, 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=1200&q=80',
   array['Orange','Cannelle','Pistache','Fleur d''oranger'], array['Fruits à coque'], false, 5),
  ('entrees', 'Harira traditionnelle', 'harira-traditionnelle',
   'Soupe marocaine mijotée aux lentilles, pois chiches, tomate et herbes fraîches.',
   65.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&q=80',
   array['Lentilles','Pois chiches','Tomate','Céleri','Coriandre'], array['Gluten'], false, 6),
  ('plats', 'Couscous royal sept légumes', 'couscous-sept-legumes',
   'Semoule roulée à la main, légumes de saison, agneau et poulet fermier braisés.',
   190.00, 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=1200&q=80',
   array['Semoule','Agneau','Poulet','Légumes de saison'], array['Gluten'], false, 7),
  ('plats', 'Poisson du jour à la chermoula', 'poisson-chermoula',
   'Pêche du jour d''Essaouira, marinade chermoula, légumes grillés à la braise.',
   210.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200&q=80',
   array['Poisson','Coriandre','Ail','Citron confit'], array['Poisson'], false, 8),
  ('desserts', 'Baklava Maison Noor', 'baklava-noor',
   'Feuilleté croustillant, miel d''oranger, pistaches et amandes fraîchement torréfiées.',
   70.00, 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=1200&q=80',
   array['Pâte filo','Pistache','Amande','Miel'], array['Gluten','Fruits à coque'], false, 9),
  ('cafe', 'Café Specialty de l''Atlas', 'cafe-specialty-atlas',
   'Grains torréfiés en micro-lot, extraction lente, notes de fruits rouges et cacao.',
   45.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80',
   array['Café arabica'], array[]::text[], false, 10),
  ('boissons', 'Thé à la menthe signature', 'the-menthe-signature',
   'Thé vert Gunpowder, menthe fraîche du jardin, service traditionnel à la théière.',
   40.00, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=1200&q=80',
   array['Thé vert','Menthe fraîche'], array[]::text[], false, 11),
  ('cocktails', 'Safran & Gin Fizz', 'cocktail-safran-gin',
   'Gin infusé au safran, citron frais, sirop de fleur d''oranger, tonic artisanal.',
   110.00, 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80',
   array['Gin','Safran','Citron','Fleur d''oranger'], array[]::text[], false, 12),
  ('brunch', 'Oeufs brouillés à la truffe', 'oeufs-brouilles-truffe',
   'Oeufs fermiers brouillés minute, truffe noire, brioche maison toastée.',
   95.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1200&q=80',
   array['Oeufs','Truffe noire','Brioche','Beurre'], array['Gluten','Oeuf','Lactose'], false, 13),
  ('brunch', 'Msemen, miel et amlou', 'msemen-miel-amlou',
   'Msemen doré au beurre, miel de fleurs d''oranger, amlou d''argan maison.',
   60.00, 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=1200&q=80',
   array['Farine','Beurre','Argan','Amandes','Miel'], array['Gluten','Fruits à coque'], false, 14)
) as v(category_slug, name, slug, description, price, image_url, ingredients, allergens, is_featured, display_order)
join menu_categories c on c.slug = v.category_slug
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- experiences
-- ------------------------------------------------------------
insert into experiences (title, slug, description, image_url, gallery_urls, price, duration, capacity, included, hours, faq, display_order) values
('Dîner privé', 'diner-prive',
 'Notre salon privé accueille jusqu''à 14 convives pour un dîner sur-mesure, pensé avec le chef selon vos envies et l''occasion célébrée.',
 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
 array[
   'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
   'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80',
   'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1200&q=80'
 ],
 'Sur demande', '3 heures', '6 — 14 personnes',
 array['Menu dégustation sur-mesure','Service dédié','Sélection de vins ou accords sans alcool','Décoration florale personnalisée'],
 'À partir de 19:30, tous les jours sur réservation',
 '[
   {"q":"Combien de temps à l''avance faut-il réserver ?","a":"Nous recommandons de réserver au moins 5 jours à l''avance pour garantir la disponibilité du salon privé."},
   {"q":"Peut-on personnaliser le menu ?","a":"Oui, notre chef élabore un menu sur-mesure en fonction de vos préférences et de toute restriction alimentaire."}
 ]'::jsonb, 1),
('Brunch', 'brunch-dominical',
 'Chaque dimanche, notre terrasse accueille un brunch généreux entre saveurs marocaines et internationales, dans une ambiance musicale douce.',
 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1200&q=80',
 array[
   'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1200&q=80',
   'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1200&q=80',
   'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=1200&q=80'
 ],
 '290 MAD / personne', 'Buffet libre 10:00 — 14:00', 'Individuel ou groupe',
 array['Buffet salé et sucré','Café, thé et jus frais à volonté','Coin pâtisserie maison','Musique live acoustique'],
 'Dimanche, 10:00 — 14:00',
 '[
   {"q":"Faut-il réserver ?","a":"La réservation est fortement recommandée, en particulier en haute saison."},
   {"q":"Les enfants sont-ils bienvenus ?","a":"Oui, un espace dédié et un menu enfant sont proposés."}
 ]'::jsonb, 2),
('Tea Time', 'tea-time',
 'Entre 16h et 18h, notre salon propose un rituel de thé à la marocaine accompagné de pâtisseries fines, dans une atmosphère feutrée.',
 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=1200&q=80',
 array[
   'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=1200&q=80',
   'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=1200&q=80',
   'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80'
 ],
 '150 MAD / personne', 'Service continu', '1 — 8 personnes',
 array['Théière traditionnelle','Plateau de pâtisseries maison','Fruits secs et miel'],
 'Tous les jours, 16:00 — 18:00',
 '[{"q":"Peut-on privatiser un salon ?","a":"Oui, pour les groupes à partir de 6 personnes sur demande."}]'::jsonb, 3),
('Chef''s Table', 'chefs-table',
 'Installés au coeur des cuisines, vivez un dîner de neuf services commentés par le chef Youssef El Amrani en personne.',
 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&q=80',
 array[
   'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&q=80',
   'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&q=80',
   'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=1200&q=80'
 ],
 '1 200 MAD / personne', '3h30', '2 — 6 personnes',
 array['Menu dégustation 9 services','Accords mets et vins','Interaction directe avec le chef','Cadeau de départ signé Maison Noor'],
 'Jeudi et vendredi, 20:00',
 '[{"q":"Y a-t-il des options végétariennes ?","a":"Une version entièrement végétarienne du menu est disponible sur demande."}]'::jsonb, 4),
('Événements privés', 'evenements-prives',
 'Nos espaces modulables accueillent vos événements privés, de 10 à 120 personnes, avec un accompagnement complet de A à Z.',
 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
 array[
   'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
   'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1200&q=80',
   'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80'
 ],
 'Sur devis', 'Selon événement', '10 — 120 personnes',
 array['Coordination dédiée','Menu et décoration sur-mesure','Espace privatisable','Service et logistique complets'],
 'Sur réservation, toute l''année',
 '[{"q":"Proposez-vous un devis détaillé ?","a":"Oui, contactez notre équipe événementiel pour un devis personnalisé sous 48h."}]'::jsonb, 5)
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- events
-- ------------------------------------------------------------
insert into events (title, slug, description, image_url, event_date, event_time, price, capacity, location, program, menu_special) values
('Brunch & Live Music', 'brunch-live-music',
 'Notre brunch dominical s''accompagne ce jour-là d''un trio acoustique jouant des reprises jazz et gnaoua sur la terrasse.',
 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80',
 '2026-08-30', '10:00 — 14:00', '290 MAD / personne', '40 places', 'Terrasse Maison Noor',
 array['10:00 — Ouverture du buffet','11:30 — Début du set live','14:00 — Fermeture'],
 'Buffet brunch complet + coin pâtisserie signature'),
('Chef''s Table d''exception', 'chefs-table-exception',
 'Une édition spéciale de notre Chef''s Table avec un menu 11 services inspiré des produits de fin d''été de l''Atlas.',
 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
 '2026-09-12', '20:00', '1 500 MAD / personne', '6 places', 'Cuisine ouverte',
 array['20:00 — Accueil et mise en bouche','20:30 — Début du menu dégustation','23:30 — Fin de service'],
 'Menu dégustation 11 services, accords mets et vins inclus'),
('Ftour Ramadan Signature', 'soiree-ramadan',
 'Un ftour raffiné célébrant les classiques du Ramadan revisités par le chef, servi dans notre salle principale.',
 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=1200&q=80',
 '2027-03-10', '19:00', '350 MAD / personne', '80 places', 'Salle principale',
 array['19:00 — Rupture du jeûne','19:30 — Service du menu','22:00 — Thé et pâtisseries'],
 'Menu ftour 5 services'),
('Réveillon du Nouvel An', 'reveillon-nouvel-an',
 'Maison Noor célèbre le passage à la nouvelle année avec un dîner de gala, DJ set et compte à rebours sur la terrasse.',
 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1200&q=80',
 '2026-12-31', '20:30', '2 200 MAD / personne', '100 places', 'Salle principale & terrasse',
 array['20:30 — Cocktail de bienvenue','21:30 — Dîner de gala','00:00 — Compte à rebours & feu d''artifice','00:30 — DJ set'],
 'Menu de gala 7 services + coupe de champagne')
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- gallery
-- ------------------------------------------------------------
insert into gallery (title, image_url, category, display_order) values
('Salle principale de Maison Noor', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80', 'Restaurant', 1),
('Terrasse ombragée', 'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1200&q=80', 'Terrasse', 2),
('Tajine d''agneau confit', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80', 'Plats', 3),
('Cuisine ouverte', 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=1200&q=80', 'Cuisine', 4),
('Pastilla royale', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1200&q=80', 'Plats', 5),
('Dîner privé', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80', 'Événements', 6),
('Détail de la salle', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80', 'Restaurant', 7),
('Brunch en terrasse', 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1200&q=80', 'Terrasse', 8),
('Risotto aux truffes', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=1200&q=80', 'Plats', 9),
('Le chef en cuisine', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&q=80', 'Cuisine', 10),
('Événement privé', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80', 'Événements', 11),
('Cheesecake fleur d''oranger', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=1200&q=80', 'Plats', 12),
('Détail zellige', 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=1200&q=80', 'Restaurant', 13),
('Soirée sur la terrasse', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80', 'Terrasse', 14),
('Préparation en cuisine', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80', 'Cuisine', 15),
('Réveillon du Nouvel An', 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1200&q=80', 'Événements', 16);

-- ------------------------------------------------------------
-- articles
-- ------------------------------------------------------------
insert into articles (title, slug, subtitle, excerpt, content, cover_image_url, category, author, published_at, is_published) values
('L''art de la pastilla, entre héritage et modernité', 'art-de-la-pastilla',
 'Comment un plat de fête traditionnel devient signature', 'Retour sur la réinvention de la pastilla par le chef Youssef El Amrani, entre respect du geste ancestral et précision contemporaine.',
 E'La pastilla occupe une place particulière dans la mémoire culinaire marocaine. Plat de fête par excellence, elle raconte des heures de préparation, de patience et de transmission entre générations.\n\nChez Maison Noor, le chef Youssef El Amrani a choisi de préserver le geste traditionnel du feuilletage de la warqa tout en épurant la composition : moins de sucre, plus de structure, une cuisson qui préserve le croustillant jusqu''à la dernière bouchée.\n\n« Je ne cherche pas à réinventer la pastilla, je cherche à lui redonner sa juste intensité », explique le chef. Ce travail de précision se retrouve dans l''ensemble de la carte de Maison Noor.',
 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1400&q=80', 'Gastronomie', 'Maison Noor', '2026-06-02', true),
('Sur les routes de l''Atlas : à la rencontre des producteurs', 'produits-terroir-atlas',
 'Le sourcing, colonne vertébrale de notre cuisine', 'Safran, huile d''argan, amandes : nos équipes sillonnent l''Atlas pour sélectionner les meilleurs produits du terroir marocain.',
 E'Chaque semaine, notre équipe cuisine se déplace dans les vallées de l''Atlas pour rencontrer les producteurs qui alimentent notre carte.\n\nCette relation directe permet de garantir une traçabilité complète et de soutenir une agriculture locale respectueuse des saisons.\n\nLe safran de Taliouine, l''huile d''argan de la coopérative féminine d''Essaouira ou les amandes de la vallée du Draa sont autant d''exemples de ce sourcing exigeant.',
 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1400&q=80', 'Cuisine', 'Maison Noor', '2026-05-14', true),
('L''architecture de Maison Noor : dialogue entre pierre et lumière', 'architecture-maison-noor',
 'Une identité contemporaine ancrée dans Marrakech', 'Retour sur la conception architecturale du restaurant, pensée comme un écrin contemporain pour une cuisine marocaine réinventée.',
 E'Dès la conception du restaurant, l''objectif était clair : éviter les clichés attendus d''un restaurant marocain tout en conservant une âme profondément locale.\n\nLe résultat est un espace où la pierre, le bois brut et la lumière naturelle dialoguent avec des lignes contemporaines épurées.\n\nChaque salle a été pensée comme une séquence différente de l''expérience Maison Noor, de l''accueil feutré à la terrasse ouverte sur les jardins.',
 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1400&q=80', 'Restaurant', 'Maison Noor', '2026-04-22', true),
('Portrait : Youssef El Amrani, une cuisine sans nostalgie', 'portrait-chef-youssef',
 'Rencontre avec le chef exécutif de Maison Noor', 'Formé entre Marrakech, Lyon et Tokyo, le chef Youssef El Amrani nous parle de sa vision d''une cuisine marocaine résolument actuelle.',
 E'Après des années passées dans des cuisines étoilées en France et au Japon, Youssef El Amrani revient au Maroc avec une conviction forte : la cuisine marocaine n''a pas besoin d''être figée dans le passé pour être respectée.\n\n« Je ne cuisine pas la nostalgie. Je cuisine ce que le Maroc devient », résume-t-il.\n\nCette philosophie infuse chaque assiette servie à Maison Noor, entre technique rigoureuse et racines assumées.',
 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1400&q=80', 'Chef', 'Maison Noor', '2026-03-08', true),
('Pourquoi le brunch du dimanche est devenu un rituel à Marrakech', 'brunch-dominical-rituel',
 'Un rendez-vous hebdomadaire attendu', 'Retour sur l''engouement autour de notre brunch dominical, devenu un rendez-vous incontournable de la vie marrakchie.',
 E'Lancé il y a deux ans, le brunch dominical de Maison Noor s''est rapidement imposé comme un rendez-vous hebdomadaire pour les habitués comme pour les visiteurs de passage.\n\nEntre le buffet généreux, l''ambiance musicale live et la terrasse ombragée, l''expérience dépasse le simple repas.\n\nUn succès qui confirme l''appétit de Marrakech pour des formats conviviaux et décontractés, sans compromis sur la qualité.',
 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1400&q=80', 'Lifestyle', 'Maison Noor', '2026-02-18', true),
('Le zellige revisité : quand l''artisanat rencontre le contemporain', 'zellige-artisanat-contemporain',
 'Un savoir-faire séculaire au service d''un design actuel', 'Comment nos artisans ont adapté le zellige traditionnel à une esthétique résolument contemporaine pour habiller nos espaces.',
 E'Le zellige, art ancestral du Maroc, orne discrètement certains espaces de Maison Noor sans jamais dominer le propos architectural.\n\nNos artisans ont travaillé des compositions monochromes et des formats inédits pour l''inscrire dans une esthétique contemporaine.\n\nUn exemple parmi d''autres de la manière dont Maison Noor dialogue avec l''artisanat marocain sans céder au folklore.',
 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=1400&q=80', 'Culture', 'Maison Noor', '2026-01-30', true)
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- testimonials
-- ------------------------------------------------------------
insert into testimonials (name, role, avatar_url, rating, content, display_order) values
('Sophia Laurent', 'Cliente régulière', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80', 5,
 'Un service irréprochable et une cuisine d''une précision rare. La pastilla royale restera l''un de mes meilleurs souvenirs culinaires à Marrakech.', 1),
('Karim Benjelloun', 'Voyageur d''affaires', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', 5,
 'J''ai organisé un dîner privé pour mes clients internationaux : l''équipe a été à la hauteur de toutes les attentes. Une adresse à recommander sans réserve.', 2),
('Emma Dubois', 'Blogueuse gastronomique', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', 4,
 'Une ambiance élégante sans être guindée, et une carte qui ose sortir des sentiers battus tout en respectant l''âme marocaine.', 3),
('Hamid Tazi', 'Résident de Marrakech', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', 5,
 'Le brunch du dimanche est devenu un rituel familial. Toujours frais, toujours généreux, et la terrasse est magnifique.', 4),
('Julia Meyer', 'Cliente internationale', 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80', 5,
 'La Chef''s Table est une expérience à part entière. Neuf services, un chef passionné, et des saveurs qu''on n''oublie pas.', 5);

-- ------------------------------------------------------------
-- faqs
-- ------------------------------------------------------------
insert into faqs (question, answer, display_order) values
('Faut-il réserver ?', 'La réservation est fortement recommandée, en particulier le week-end et pour les groupes de plus de 6 personnes.', 1),
('Quel est le dress code ?', 'Nous recommandons une tenue élégante décontractée (smart casual).', 2),
('Le restaurant accepte-t-il les groupes ?', 'Oui, nous accueillons les groupes jusqu''à 20 personnes en salle, et jusqu''à 14 personnes dans notre salon privé.', 3),
('Proposez-vous des options végétariennes ?', 'Oui, plusieurs plats végétariens figurent à la carte et le chef peut adapter certaines recettes sur demande.', 4),
('Peut-on organiser un événement privé ?', 'Oui, contactez notre équipe événementiel pour discuter de votre projet et recevoir un devis personnalisé.', 5),
('Acceptez-vous les enfants ?', 'Bien sûr, un menu enfant et des chaises hautes sont disponibles sur demande.', 6);

-- ------------------------------------------------------------
-- After first Google login, run this (replace the email) so the
-- owner account is recognized as an admin:
-- insert into admin_users (email, full_name) values ('owner@gmail.com', 'Restaurant Owner');
-- ------------------------------------------------------------
