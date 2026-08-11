import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { PrismaClient, type ProductCategory } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type SunsetImage = { file: string; alt: string };
type SunsetProduct = {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  details: string;
  category: ProductCategory;
  sourceUrl: string;
  priceCents: number;
  sizes: string[];
  colors: string[];
  order: number;
  images: SunsetImage[];
};

const assetDirectory = path.join(process.cwd(), "public", "shop-products", "sunset");
const coldCare = "Lavage à la main ou en machine à froid. Ne pas nettoyer à sec, blanchir, sécher au sèche-linge ni repasser directement sur l’imprimé.";

const products: SunsetProduct[] = [
  {
    slug: "sunset-casquette-baseball",
    name: "Sunset — Casquette baseball",
    nameEn: "Sunset — Baseball cap",
    description: "Casquette structurée à profil moyen, visière incurvée et bride à boutons-pression réglable, signée SHERRIE 96 SUMMER ORANGE.",
    descriptionEn: "Structured mid-profile baseball cap with a curved visor and adjustable snapback, featuring SHERRIE 96 SUMMER ORANGE.",
    details: "100 % polyester, 285 g/m². Cinq pans avec panneau avant doublé. Taille unique à partir de 13 ans. Nettoyage au chiffon humide.",
    category: "CAP",
    sourceUrl: "https://www.redbubble.com/fr/i/casquette/SHERRIE-96-SUMMER-ORANGE-par-alexialila/182925459/4sgw",
    priceCents: 3099,
    sizes: ["Taille unique"],
    colors: ["Noir", "Blanc", "Gris foncé", "Gris clair", "Marine", "Bleu clair"],
    order: 100,
    images: [
      { file: "cap-baseball-main.webp", alt: "Casquette baseball Sunset, vue produit non portée" },
      { file: "cap-baseball-men.webp", alt: "Casquette baseball Sunset portée par un homme" },
      { file: "cap-baseball-women.webp", alt: "Casquette baseball Sunset portée par une femme" },
      { file: "cap-baseball-hanging.webp", alt: "Casquette baseball Sunset suspendue" },
    ],
  },
  {
    slug: "sunset-t-shirt-oversize",
    name: "Sunset — T-shirt oversize",
    nameEn: "Sunset — Oversized T-shirt",
    description: "T-shirt premium oversize, col rond, épaules tombantes et manches mi-longues amples. Une silhouette mixte pensée pour tous les jours.",
    descriptionEn: "Premium oversized crew-neck T-shirt with dropped shoulders and roomy mid-length sleeves. A unisex everyday silhouette.",
    details: "Jersey épais 240 g/m², 100 % coton filé. Col côtelé à surpiqûre simple.",
    category: "TSHIRT",
    sourceUrl: "https://www.redbubble.com/fr/i/t-shirt/SHERRIE-96-SUMMER-ORANGE-par-alexialila/182925459/rh5j",
    priceCents: 3999,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["Noir", "Blanc", "Marine", "Gris fumée", "Sable", "Rouge coquelicot", "Vert treillis", "Marron kaki"],
    order: 101,
    images: [
      { file: "tee-oversize-main.webp", alt: "T-shirt oversize Sunset, vue produit non portée" },
      { file: "tee-oversize-men.webp", alt: "T-shirt oversize Sunset porté par un homme" },
      { file: "tee-oversize-women.webp", alt: "T-shirt oversize Sunset porté par une femme" },
      { file: "tee-oversize-lifestyle.webp", alt: "T-shirt oversize Sunset porté en situation" },
    ],
  },
  {
    slug: "sunset-sweatshirt-premium-oversize",
    name: "Sunset — Sweatshirt premium oversize",
    nameEn: "Sunset — Premium oversized sweatshirt",
    description: "Sweatshirt premium oversize en molleton épais, aux manches généreuses et aux finitions épurées.",
    descriptionEn: "Premium oversized heavyweight fleece sweatshirt with roomy sleeves and clean finishing.",
    details: `Molleton épais 10 oz. Coupe classique oversize ; prendre une taille au-dessus pour plus d’ampleur. ${coldCare}`,
    category: "HOODIE",
    sourceUrl: "https://www.redbubble.com/fr/i/sweat/SHERRIE-96-SUMMER-ORANGE-par-alexialila/182925459/cdux",
    priceCents: 6099,
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["Noir", "Os", "Bronze", "Olive clair", "Argile", "Shiitake", "Denim délavé", "Bleu nuit", "Noir graphite"],
    order: 102,
    images: [
      { file: "sweatshirt-oversize-main.webp", alt: "Sweatshirt premium oversize Sunset, vue produit non portée" },
      { file: "sweatshirt-oversize-men.webp", alt: "Sweatshirt premium oversize Sunset porté par un homme" },
      { file: "sweatshirt-oversize-women.webp", alt: "Sweatshirt premium oversize Sunset porté par une femme" },
      { file: "sweatshirt-oversize-men-back.webp", alt: "Sweatshirt premium oversize Sunset porté, vue de dos" },
    ],
  },
  {
    slug: "sunset-bob",
    name: "Sunset — Bob",
    nameEn: "Sunset — Bucket hat",
    description: "Bob souple, léger et respirant pour la plage, la ville ou les festivals.",
    descriptionEn: "Soft, lightweight and breathable bucket hat for the beach, city or festivals.",
    details: "100 % coton respirant avec œillets d’aération. Bord 5,5 cm, couronne non structurée de 8 cm. Nettoyage localisé et séchage à l’ombre.",
    category: "HAT",
    sourceUrl: "https://www.redbubble.com/fr/i/bob/SHERRIE-96-SUMMER-ORANGE-par-alexialila/182925459/3vy7",
    priceCents: 3299,
    sizes: ["Taille unique"],
    colors: ["Sable", "Noir", "Blanc", "Marine", "Rose clair"],
    order: 103,
    images: [
      { file: "bucket-hat-main.webp", alt: "Bob Sunset, vue produit non portée" },
      { file: "bucket-hat-men.jpg", alt: "Bob Sunset porté par un homme" },
      { file: "bucket-hat-women.jpg", alt: "Bob Sunset porté par une femme" },
      { file: "bucket-hat-inner.jpg", alt: "Bob Sunset, détail intérieur" },
    ],
  },
  {
    slug: "sunset-casquette-dad-hat",
    name: "Sunset — Casquette Dad Hat",
    nameEn: "Sunset — Dad Hat",
    description: "Casquette décontractée souple, profil moyen, visière légèrement incurvée et bride à boucle réglable.",
    descriptionEn: "Relaxed unstructured mid-profile Dad Hat with a gently curved visor and adjustable buckle strap.",
    details: "100 % coton, 240 g/m². Cinq pans avec panneau avant doublé. Taille unique à partir de 13 ans. Nettoyage au chiffon humide.",
    category: "CAP",
    sourceUrl: "https://www.redbubble.com/fr/i/casquette/SHERRIE-96-SUMMER-ORANGE-par-alexialila/182925459/fce2",
    priceCents: 3099,
    sizes: ["Taille unique"],
    colors: ["Noir", "Blanc", "Gris ardoise", "Beige", "Marine", "Vert jade", "Rose clair"],
    order: 104,
    images: [
      { file: "dad-hat-main.webp", alt: "Casquette Dad Hat Sunset, vue produit non portée" },
      { file: "dad-hat-men.webp", alt: "Casquette Dad Hat Sunset portée par un homme" },
      { file: "dad-hat-women.webp", alt: "Casquette Dad Hat Sunset portée par une femme" },
      { file: "dad-hat-hanging.webp", alt: "Casquette Dad Hat Sunset suspendue" },
    ],
  },
  {
    slug: "sunset-t-shirt-classique",
    name: "Sunset — T-shirt classique",
    nameEn: "Sunset — Classic T-shirt",
    description: "T-shirt classique confortable à coupe carrée, avec le visuel SHERRIE 96 SUMMER ORANGE.",
    descriptionEn: "Comfortable classic boxy-fit T-shirt featuring the SHERRIE 96 SUMMER ORANGE artwork.",
    details: `Tissu épais. Les couleurs unies sont 100 % coton pré-rétréci. ${coldCare}`,
    category: "TSHIRT",
    sourceUrl: "https://www.redbubble.com/fr/i/t-shirt/SHERRIE-96-SUMMER-ORANGE-par-alexialila/182925459/lrcw",
    priceCents: 2999,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
    colors: ["Noir", "Blanc", "Gris chiné", "Denim chiné", "Marine", "Bleu", "Crème", "Bleu clair", "Rouge", "Gris foncé", "Vert kiwi", "Vert", "Kaki", "Vert forêt", "Rose clair", "Violet", "Rouge foncé", "Jaune crème", "Jaune"],
    order: 105,
    images: [
      { file: "tee-classic-main.webp", alt: "T-shirt classique Sunset, vue produit non portée" },
      { file: "tee-classic-men.webp", alt: "T-shirt classique Sunset porté par un homme" },
      { file: "tee-classic-women.webp", alt: "T-shirt classique Sunset porté par une femme" },
      { file: "tee-classic-lifestyle.webp", alt: "T-shirt classique Sunset porté en situation" },
    ],
  },
  {
    slug: "sunset-veste-zippee-capuche",
    name: "Sunset — Veste zippée à capuche",
    nameEn: "Sunset — Zip hoodie",
    description: "Veste zippée à capuche en molleton épais, avec poche kangourou, cordons assortis et poignets bords-côtes.",
    descriptionEn: "Heavyweight fleece zip hoodie with a kangaroo pocket, matching drawstrings and ribbed cuffs.",
    details: `Molleton 280 g/m². Couleurs unies : 80 % coton filé, 20 % polyester. Gris chiné : 70 % coton, 30 % polyester. Gris anthracite chiné : 60 % coton, 40 % polyester. ${coldCare}`,
    category: "JACKET",
    sourceUrl: "https://www.redbubble.com/fr/i/sweat/SHERRIE-96-SUMMER-ORANGE-par-alexialila/182925459/9khb",
    priceCents: 5199,
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: ["Noir", "Gris anthracite chiné", "Avoine chiné", "Bleu foncé", "Bleu", "Gris chiné"],
    order: 106,
    images: [
      { file: "zip-hoodie-main.webp", alt: "Veste zippée à capuche Sunset, vue produit non portée" },
      { file: "zip-hoodie-men-back.webp", alt: "Veste zippée à capuche Sunset portée par un homme, vue de dos" },
      { file: "zip-hoodie-women-back.webp", alt: "Veste zippée à capuche Sunset portée par une femme, vue de dos" },
      { file: "zip-hoodie-men-front.webp", alt: "Veste zippée à capuche Sunset portée par un homme, vue de face" },
    ],
  },
  {
    slug: "sunset-tote-bag",
    name: "Sunset — Tote bag",
    nameEn: "Sunset — Tote bag",
    description: "Tote bag réutilisable et léger, pratique pour les courses, la plage et le quotidien.",
    descriptionEn: "Lightweight reusable tote bag for shopping, the beach and everyday use.",
    details: "Tissu 100 % coton, 145 g/m². Anses coton de 70 cm en Europe. Impression numérique sur un côté. Lavage à froid à la main.",
    category: "ACCESSORY",
    sourceUrl: "https://www.redbubble.com/fr/i/tote-bag/SHERRIE-96-SUMMER-ORANGE-par-alexialila/182925459/7prg",
    priceCents: 2399,
    sizes: ["Taille unique"],
    colors: ["Naturel"],
    order: 107,
    images: [
      { file: "tote-main.webp", alt: "Tote bag Sunset, vue produit non portée" },
      { file: "tote-lifestyle.jpg", alt: "Tote bag Sunset porté par une femme" },
      { file: "tote-detail.jpg", alt: "Tote bag Sunset, détail du tissu et de l’impression" },
      { file: "tote-filled.webp", alt: "Tote bag Sunset rempli, vue produit" },
    ],
  },
  {
    slug: "sunset-sac-de-sport",
    name: "Sunset — Sac de sport",
    nameEn: "Sunset — Duffle bag",
    description: "Sac de sport robuste pour la salle, le bureau et les voyages, disponible en deux formats.",
    descriptionEn: "Durable duffle bag for the gym, office and travel, available in two sizes.",
    details: "Toile 100 % polyester. Petit : 49 × 24 × 24 cm. Grand : 58 × 30 × 30 cm. Poche ordinateur, poche extérieure en filet et bandoulière rembourrée réglable. Impression par sublimation.",
    category: "ACCESSORY",
    sourceUrl: "https://www.redbubble.com/fr/i/sac-de-sport/SHERRIE-96-SUMMER-ORANGE-par-alexialila/182925459/mf4n",
    priceCents: 6899,
    sizes: ["Petit", "Grand"],
    colors: [],
    order: 108,
    images: [
      { file: "duffle-main.webp", alt: "Sac de sport Sunset, vue produit de face" },
      { file: "duffle-back.jpg", alt: "Sac de sport Sunset, vue arrière" },
      { file: "duffle-art.webp", alt: "Détail du visuel SHERRIE 96 SUMMER ORANGE du sac de sport" },
    ],
  },
  {
    slug: "sunset-mug-long",
    name: "Sunset — Mug long",
    nameEn: "Sunset — Tall mug",
    description: "Mug long en céramique, plus haut et plus large pour mettre le visuel Sunset en valeur.",
    descriptionEn: "Tall ceramic mug with extra space to showcase the Sunset artwork.",
    details: "Contenance 340 ml. Diamètre sans anse : 9,2 cm ; base : 6,4 cm. Compatible lave-vaisselle et micro-ondes. Impression sur tout le tour.",
    category: "ACCESSORY",
    sourceUrl: "https://www.redbubble.com/fr/i/mug/SHERRIE-96-SUMMER-ORANGE-par-alexialila/182925459/ctqx",
    priceCents: 2399,
    sizes: ["340 ml"],
    colors: ["Blanc"],
    order: 109,
    images: [
      { file: "tall-mug-main.webp", alt: "Mug long Sunset, vue produit non portée" },
      { file: "tall-mug-center.webp", alt: "Mug long Sunset, vue de face" },
      { file: "tall-mug-left.webp", alt: "Mug long Sunset, vue latérale" },
      { file: "tall-mug-art.webp", alt: "Détail du visuel SHERRIE 96 SUMMER ORANGE du mug long" },
    ],
  },
  {
    slug: "sunset-mug-classique",
    name: "Sunset — Mug classique",
    nameEn: "Sunset — Classic mug",
    description: "Mug classique en céramique avec impression Sunset sur tout le tour.",
    descriptionEn: "Classic ceramic mug with wraparound Sunset artwork.",
    details: "Contenance 350 ml. Diamètre sans anse : 8,2 cm. Compatible lave-vaisselle et micro-ondes. Impression sur tout le tour.",
    category: "ACCESSORY",
    sourceUrl: "https://www.redbubble.com/fr/i/mug/SHERRIE-96-SUMMER-ORANGE-par-alexialila/182925459/7yqg",
    priceCents: 2399,
    sizes: ["350 ml"],
    colors: ["Blanc"],
    order: 110,
    images: [
      { file: "classic-mug-main.webp", alt: "Mug classique Sunset, vue produit non portée" },
      { file: "classic-mug-lifestyle.webp", alt: "Mug classique Sunset en situation" },
      { file: "classic-mug-double.webp", alt: "Deux mugs classiques Sunset, vue produit" },
      { file: "classic-mug-center.webp", alt: "Mug classique Sunset, vue de face" },
    ],
  },
  {
    slug: "sunset-white-t-shirt-col-v",
    name: "Sunset White — T-shirt col V",
    nameEn: "Sunset White — V-neck T-shirt",
    description: "T-shirt léger à col V profond et coupe ajustée, avec le visuel Sunset White imprimé au dos.",
    descriptionEn: "Lightweight deep V-neck T-shirt with a slim fit and the Sunset White artwork printed on the back.",
    details: `Les couleurs unies sont 100 % coton. Coupe ajustée ; prendre une taille au-dessus pour davantage d’aisance. ${coldCare}`,
    category: "TSHIRT",
    sourceUrl: "https://www.redbubble.com/fr/i/t-shirt/Sunset-white-par-alexialila/182925822/2cn5",
    priceCents: 3399,
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: ["Noir", "Blanc", "Gris anthracite chiné", "Gris chiné", "Bleu foncé", "Bleu", "Gris foncé", "Rouge"],
    order: 111,
    images: [
      { file: "white-vneck-main.webp", alt: "T-shirt col V Sunset White, vue produit non portée côté dos" },
      { file: "white-vneck-men-back.webp", alt: "T-shirt col V Sunset White porté, vue de dos" },
      { file: "white-vneck-men-front.webp", alt: "T-shirt col V Sunset White porté, vue de face" },
      { file: "white-vneck-art.webp", alt: "Détail du visuel Sunset White du T-shirt col V" },
    ],
  },
  {
    slug: "sunset-white-veste-zippee-capuche",
    name: "Sunset White — Veste zippée à capuche",
    nameEn: "Sunset White — Zip hoodie",
    description: "Veste zippée à capuche en molleton épais, avec le visuel Sunset White imprimé au dos.",
    descriptionEn: "Heavyweight fleece zip hoodie with the Sunset White artwork printed on the back.",
    details: `Molleton 280 g/m². Couleurs unies : 80 % coton filé, 20 % polyester. Gris chiné : 70 % coton, 30 % polyester. Gris anthracite chiné : 60 % coton, 40 % polyester. Poche kangourou, cordons assortis et poignets bords-côtes. ${coldCare}`,
    category: "JACKET",
    sourceUrl: "https://www.redbubble.com/fr/i/sweat/Sunset-white-par-alexialila/182925822/9khb",
    priceCents: 5199,
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: ["Noir", "Gris anthracite chiné", "Avoine chiné", "Bleu foncé", "Bleu", "Gris chiné"],
    order: 112,
    images: [
      { file: "white-zip-main.webp", alt: "Veste zippée à capuche Sunset White, vue produit non portée côté dos" },
      { file: "white-zip-men-back.webp", alt: "Veste zippée à capuche Sunset White portée par un homme, vue de dos" },
      { file: "white-zip-women-back.webp", alt: "Veste zippée à capuche Sunset White portée par une femme, vue de dos" },
      { file: "white-zip-men-front.webp", alt: "Veste zippée à capuche Sunset White portée, vue de face" },
    ],
  },
  {
    slug: "sunset-white-t-shirt-oversize",
    name: "Sunset White — T-shirt oversize",
    nameEn: "Sunset White — Oversized T-shirt",
    description: "T-shirt premium oversize mixte, à col rond, épaules tombantes et manches mi-longues amples.",
    descriptionEn: "Unisex premium oversized crew-neck T-shirt with dropped shoulders and roomy mid-length sleeves.",
    details: "Jersey épais 240 g/m², 100 % coton filé. Col côtelé à surpiqûre simple.",
    category: "TSHIRT",
    sourceUrl: "https://www.redbubble.com/fr/i/t-shirt/Sunset-white-par-alexialila/182925822/rh5j",
    priceCents: 3999,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["Noir", "Blanc", "Marine", "Gris fumée", "Sable", "Rouge coquelicot", "Vert treillis", "Marron kaki"],
    order: 113,
    images: [
      { file: "white-oversize-main.webp", alt: "T-shirt oversize Sunset White, vue produit non portée" },
      { file: "white-oversize-men.webp", alt: "T-shirt oversize Sunset White porté par un homme" },
      { file: "white-oversize-women.webp", alt: "T-shirt oversize Sunset White porté par une femme" },
      { file: "white-oversize-lifestyle.webp", alt: "T-shirt oversize Sunset White porté en situation" },
    ],
  },
  {
    slug: "sunset-white-sweatshirt-premium-oversize",
    name: "Sunset White — Sweatshirt premium oversize",
    nameEn: "Sunset White — Premium oversized sweatshirt",
    description: "Sweatshirt premium oversize mixte en molleton épais, aux manches généreuses et aux finitions épurées.",
    descriptionEn: "Unisex premium oversized heavyweight fleece sweatshirt with roomy sleeves and clean finishing.",
    details: `Molleton épais 10 oz. Prendre une taille au-dessus pour davantage d’ampleur. ${coldCare}`,
    category: "HOODIE",
    sourceUrl: "https://www.redbubble.com/fr/i/sweat/Sunset-white-par-alexialila/182925822/cdux",
    priceCents: 6099,
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["Noir", "Os", "Bronze", "Olive clair", "Argile", "Shiitake", "Denim délavé", "Bleu nuit", "Noir graphite"],
    order: 114,
    images: [
      { file: "white-sweatshirt-main.webp", alt: "Sweatshirt premium oversize Sunset White, vue produit non portée" },
      { file: "white-sweatshirt-men.webp", alt: "Sweatshirt premium oversize Sunset White porté par un homme" },
      { file: "white-sweatshirt-women.webp", alt: "Sweatshirt premium oversize Sunset White porté par une femme" },
      { file: "white-sweatshirt-men-back.webp", alt: "Sweatshirt premium oversize Sunset White porté, vue de dos" },
    ],
  },
  {
    slug: "sunset-white-bob",
    name: "Sunset White — Bob",
    nameEn: "Sunset White — Bucket hat",
    description: "Bob mixte souple, léger et respirant avec un visuel Sunset White contrasté.",
    descriptionEn: "Soft, lightweight unisex bucket hat with high-contrast Sunset White artwork.",
    details: "100 % coton respirant avec œillets d’aération. Bord 5,5 cm, couronne non structurée de 8 cm. Nettoyage localisé et séchage à l’ombre.",
    category: "HAT",
    sourceUrl: "https://www.redbubble.com/fr/i/bob/sherrie-sunset-white-par-alexialila/182925913/3vy7",
    priceCents: 3299,
    sizes: ["Taille unique"],
    colors: ["Sable", "Noir", "Marine", "Rose clair"],
    order: 115,
    images: [
      { file: "white-bucket-main.webp", alt: "Bob Sunset White noir, vue produit non portée et contrastée" },
      { file: "white-bucket-men.webp", alt: "Bob Sunset White noir porté par un homme" },
      { file: "white-bucket-women.webp", alt: "Bob Sunset White noir porté par une femme" },
      { file: "white-bucket-inner.webp", alt: "Bob Sunset White noir, détail intérieur" },
    ],
  },
  {
    slug: "sunset-white-casquette-dad-hat",
    name: "Sunset White — Casquette Dad Hat",
    nameEn: "Sunset White — Dad Hat",
    description: "Casquette mixte souple, profil moyen, visière légèrement incurvée et bride à boucle réglable.",
    descriptionEn: "Unisex unstructured mid-profile Dad Hat with a gently curved visor and adjustable buckle strap.",
    details: "100 % coton, 240 g/m². Cinq pans avec panneau avant doublé. Taille unique à partir de 13 ans. Nettoyage au chiffon humide.",
    category: "CAP",
    sourceUrl: "https://www.redbubble.com/fr/i/casquette/sherrie-sunset-white-par-alexialila/182925913/fce2",
    priceCents: 3099,
    sizes: ["Taille unique"],
    colors: ["Noir", "Gris ardoise", "Beige", "Marine", "Vert jade", "Rose clair"],
    order: 116,
    images: [
      { file: "white-dad-main.webp", alt: "Casquette Dad Hat Sunset White noire, vue produit non portée et contrastée" },
      { file: "white-dad-hanging.webp", alt: "Casquette Dad Hat Sunset White noire suspendue" },
      { file: "white-dad-men.webp", alt: "Casquette Dad Hat Sunset White noire portée par un homme" },
      { file: "white-dad-women.webp", alt: "Casquette Dad Hat Sunset White noire portée par une femme" },
    ],
  },
  {
    slug: "sunset-white-casquette-baseball",
    name: "Sunset White — Casquette baseball",
    nameEn: "Sunset White — Baseball cap",
    description: "Casquette mixte structurée à profil moyen, visière incurvée et bride à boutons-pression réglable.",
    descriptionEn: "Unisex structured mid-profile baseball cap with a curved visor and adjustable snapback.",
    details: "100 % polyester, 285 g/m². Cinq pans avec panneau avant doublé. Taille unique à partir de 13 ans. Nettoyage au chiffon humide.",
    category: "CAP",
    sourceUrl: "https://www.redbubble.com/fr/i/casquette/sherrie-sunset-white-par-alexialila/182925913/4sgw",
    priceCents: 3099,
    sizes: ["Taille unique"],
    colors: ["Noir", "Gris foncé", "Gris clair", "Marine", "Bleu clair"],
    order: 117,
    images: [
      { file: "white-baseball-main.webp", alt: "Casquette baseball Sunset White noire, vue produit non portée et contrastée" },
      { file: "white-baseball-hanging.webp", alt: "Casquette baseball Sunset White noire suspendue" },
      { file: "white-baseball-men.webp", alt: "Casquette baseball Sunset White noire portée par un homme" },
      { file: "white-baseball-women.webp", alt: "Casquette baseball Sunset White noire portée par une femme" },
    ],
  },
  {
    slug: "sunset-orange-bob",
    name: "Sunset Orange — Bob",
    nameEn: "Sunset Orange — Bucket hat",
    description: "Bob mixte souple, léger et respirant avec le logo Sherrie Sherrie Sunset Orange.",
    descriptionEn: "Soft, lightweight and breathable unisex bucket hat with the Sherrie Sherrie Sunset Orange logo.",
    details: "100 % coton respirant avec œillets d’aération. Bord 5,5 cm, couronne non structurée de 8 cm. Nettoyage localisé et séchage à l’ombre.",
    category: "HAT",
    sourceUrl: "https://www.redbubble.com/fr/i/bob/sherrie-sunset-orange-par-alexialila/182925966/3vy7",
    priceCents: 3299,
    sizes: ["Taille unique"],
    colors: ["Sable", "Noir", "Blanc", "Marine", "Rose clair"],
    order: 118,
    images: [
      { file: "orange-bucket-main.webp", alt: "Bob Sunset Orange sable, vue produit non portée" },
      { file: "orange-bucket-men.webp", alt: "Bob Sunset Orange porté par un homme" },
      { file: "orange-bucket-women.webp", alt: "Bob Sunset Orange porté par une femme" },
      { file: "orange-bucket-inner.webp", alt: "Bob Sunset Orange, détail intérieur" },
    ],
  },
  {
    slug: "sunset-orange-casquette-dad-hat",
    name: "Sunset Orange — Casquette Dad Hat",
    nameEn: "Sunset Orange — Dad Hat",
    description: "Casquette mixte souple, profil moyen, visière légèrement incurvée et bride à boucle réglable.",
    descriptionEn: "Unisex unstructured mid-profile Dad Hat with a gently curved visor and adjustable buckle strap.",
    details: "100 % coton, 240 g/m². Cinq pans avec panneau avant doublé. Taille unique à partir de 13 ans. Nettoyage au chiffon humide.",
    category: "CAP",
    sourceUrl: "https://www.redbubble.com/fr/i/casquette/sherrie-sunset-orange-par-alexialila/182925966/fce2",
    priceCents: 3099,
    sizes: ["Taille unique"],
    colors: ["Noir", "Blanc", "Gris ardoise", "Beige", "Marine", "Vert jade", "Rose clair"],
    order: 119,
    images: [
      { file: "orange-dad-main.webp", alt: "Casquette Dad Hat Sunset Orange blanche, vue produit non portée" },
      { file: "orange-dad-hanging.webp", alt: "Casquette Dad Hat Sunset Orange suspendue" },
      { file: "orange-dad-men.webp", alt: "Casquette Dad Hat Sunset Orange portée par un homme" },
      { file: "orange-dad-women.webp", alt: "Casquette Dad Hat Sunset Orange portée par une femme" },
    ],
  },
  {
    slug: "sunset-orange-casquette-baseball",
    name: "Sunset Orange — Casquette baseball",
    nameEn: "Sunset Orange — Baseball cap",
    description: "Casquette mixte structurée à profil moyen, visière incurvée et bride à boutons-pression réglable.",
    descriptionEn: "Unisex structured mid-profile baseball cap with a curved visor and adjustable snapback.",
    details: "100 % polyester, 285 g/m². Cinq pans avec panneau avant doublé. Taille unique à partir de 13 ans. Nettoyage au chiffon humide.",
    category: "CAP",
    sourceUrl: "https://www.redbubble.com/fr/i/casquette/sherrie-sunset-orange-par-alexialila/182925966/4sgw",
    priceCents: 3099,
    sizes: ["Taille unique"],
    colors: ["Noir", "Blanc", "Gris foncé", "Gris clair", "Marine", "Bleu clair"],
    order: 120,
    images: [
      { file: "orange-baseball-main.webp", alt: "Casquette baseball Sunset Orange blanche, vue produit non portée" },
      { file: "orange-baseball-hanging.webp", alt: "Casquette baseball Sunset Orange suspendue" },
      { file: "orange-baseball-men.webp", alt: "Casquette baseball Sunset Orange portée par un homme" },
      { file: "orange-baseball-women.webp", alt: "Casquette baseball Sunset Orange portée par une femme" },
    ],
  },
  {
    slug: "sunset-orange-sac-sport",
    name: "Sunset Orange — Sac de sport",
    nameEn: "Sunset Orange — Duffle bag",
    description: "Sac de sport robuste à imprimé Sunset Orange, pensé pour la salle, le bureau et les voyages.",
    descriptionEn: "Durable Sunset Orange duffle bag made for the gym, office and travel.",
    details: "Toile robuste 100 % polyester. Petit format : 49 × 24 × 24 cm. Grand format : 58 × 30 × 30 cm. Poche intérieure pour ordinateur, poche extérieure filet et bandoulière réglable rembourrée.",
    category: "ACCESSORY",
    sourceUrl: "https://www.redbubble.com/fr/i/sac-de-sport/sherrie-sunset-orange-par-alexialila/182925966/mf4n",
    priceCents: 6899,
    sizes: ["Petit", "Grand"],
    colors: [],
    order: 121,
    images: [
      { file: "orange-duffle-main.webp", alt: "Sac de sport Sunset Orange, vue produit non portée de face" },
      { file: "orange-duffle-back.webp", alt: "Sac de sport Sunset Orange, vue produit arrière" },
      { file: "orange-duffle-art.webp", alt: "Détail du visuel Sunset Orange du sac de sport" },
    ],
  },
  {
    slug: "sunset-orange-tote-bag",
    name: "Sunset Orange — Tote bag",
    nameEn: "Sunset Orange — Tote bag",
    description: "Tote bag classique léger et réutilisable en coton, avec le logo Sherrie Sherrie Sunset Orange.",
    descriptionEn: "Lightweight reusable classic cotton tote with the Sherrie Sherrie Sunset Orange logo.",
    details: "Tissu 100 % coton, 145 g/m². Taille unique avec anses longues de 70 cm en Europe. Impression numérique sur un côté. Lavage à froid à la main.",
    category: "ACCESSORY",
    sourceUrl: "https://www.redbubble.com/fr/i/tote-bag/sherrie-sunset-orange-par-alexialila/182925966/7prg",
    priceCents: 2399,
    sizes: ["Taille unique"],
    colors: [],
    order: 122,
    images: [
      { file: "orange-tote-main.webp", alt: "Tote bag Sunset Orange, vue produit non portée à plat" },
      { file: "orange-tote-lifestyle.webp", alt: "Tote bag Sunset Orange en situation" },
      { file: "orange-tote-detail.webp", alt: "Tote bag Sunset Orange, détail du logo" },
      { file: "orange-tote-filled.webp", alt: "Tote bag Sunset Orange rempli, vue produit" },
    ],
  },
];

function contentType(file: string) {
  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) return "image/jpeg";
  return "image/webp";
}

async function main() {
  const shouldApply = process.argv.includes("--apply");
  const shouldList = process.argv.includes("--list");
  if (!shouldApply && !shouldList) throw new Error("Ajoutez --apply pour publier la collection Sunset.");

  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!connectionString) throw new Error("DATABASE_URL_UNPOOLED ou DATABASE_URL est manquante.");
  if (shouldApply && !blobToken) throw new Error("BLOB_READ_WRITE_TOKEN est manquant.");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    if (shouldList) {
      const rows = await prisma.product.findMany({
        where: { collection: "Sunset" },
        select: { slug: true, name: true, priceCents: true, audience: true, colors: true, images: { select: { url: true }, orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      });
      console.log(JSON.stringify(rows, null, 2));
      return;
    }

    for (const product of products) {
      for (const image of product.images) {
        const filePath = path.join(assetDirectory, image.file);
        const fileStats = await stat(filePath);
        if (!fileStats.isFile() || fileStats.size === 0) throw new Error(`Image invalide : ${filePath}`);
      }
    }

    for (const product of products) {
      const uploadedImages = [];
      for (const [order, image] of product.images.entries()) {
        const sourcePath = path.join(assetDirectory, image.file);
        const blobPath = `shop/sunset/${product.slug}/${image.file}`;
        const blob = await put(blobPath, await readFile(sourcePath), {
          access: "public",
          addRandomSuffix: false,
          allowOverwrite: true,
          cacheControlMaxAge: 31_536_000,
          contentType: contentType(image.file),
          token: blobToken!,
        });
        uploadedImages.push({ url: blob.url, pathname: blob.pathname, alt: image.alt, order });
      }

      const data = {
        name: product.name,
        nameEn: product.nameEn,
        description: product.description,
        descriptionEn: product.descriptionEn,
        details: product.details,
        category: product.category,
        collection: "Sunset",
        audience: "MIXTE" as const,
        sourceUrl: product.sourceUrl,
        priceCents: product.priceCents,
        currency: "EUR",
        sizes: product.sizes,
        colors: product.colors,
        stock: 0,
        trackStock: false,
        isActive: true,
        isFeatured: true,
        order: product.order,
      };
      await prisma.product.upsert({
        where: { slug: product.slug },
        create: { slug: product.slug, ...data, images: { create: uploadedImages } },
        update: { ...data, images: { deleteMany: {}, create: uploadedImages } },
      });
      console.log(`✓ ${product.name} — ${(product.priceCents / 100).toFixed(2)} € — ${product.colors.length} couleur(s)`);
    }

    const published = await prisma.product.findMany({
      where: { slug: { in: products.map((product) => product.slug) } },
      select: { slug: true, collection: true, audience: true, images: { select: { order: true }, orderBy: { order: "asc" } } },
    });
    if (published.length !== products.length || published.some((product) => product.collection !== "Sunset" || product.audience !== "MIXTE" || product.images[0]?.order !== 0)) {
      throw new Error("La vérification finale de la collection Sunset a échoué.");
    }
    console.log(`Collection Sunset vérifiée : ${published.length} modèles mixtes.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
