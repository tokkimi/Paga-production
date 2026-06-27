import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const secret = process.env.SEED_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    return NextResponse.json({ message: "Database already seeded", users: existingUsers });
  }

  const adminPassword = await bcrypt.hash("Admin@Paga2026!", 12);
  const brandPassword = await bcrypt.hash("Brand@Test2026!", 12);
  const userPassword = await bcrypt.hash("User@Test2026!", 12);

  await prisma.user.createMany({
    data: [
      { email: "admin@pagaproduction.fr", name: "Admin Paga", password: adminPassword, role: "ADMIN" },
      { email: "marque@test.fr", name: "Marque Test", password: brandPassword, role: "BRAND" },
      { email: "user@test.fr", name: "Fan Test", password: userPassword, role: "USER" },
    ],
  });

  const paga = await prisma.artist.create({
    data: {
      slug: "paga", name: "Paga",
      bio_fr: "Paga est un DJ originaire du Sud de la France, réputé pour ses sets électrisants mêlant tech house, melodic techno et afro house. Depuis ses débuts dans les clubs underground de Montpellier, il a rapidement conquis les scènes de France et d'Europe, notamment à Ibiza, sa destination fétiche.\n\nSa musique est une invitation au voyage : des basses profondes, des mélodies hypnotiques et une énergie communicative qui fait danser les foules jusqu'au lever du soleil.",
      bio_en: "Paga is a DJ from the South of France, renowned for his electrifying sets blending tech house, melodic techno and afro house. Since his early days in the underground clubs of Montpellier, he has quickly conquered stages across France and Europe, especially in Ibiza.\n\nHis music is an invitation to travel: deep basses, hypnotic melodies and infectious energy that keeps crowds dancing until sunrise.",
      shortBio_fr: "DJ du Sud de la France. Tech house, melodic techno & afro house. Summer Tour 2026.",
      shortBio_en: "DJ from the South of France. Tech house, melodic techno & afro house. Summer Tour 2026.",
      instagram: "https://www.instagram.com/paga_lmsa", isActive: true, order: 0,
    },
  });

  const alexis = await prisma.artist.create({
    data: {
      slug: "alexis-dante", name: "Alexis Dante",
      bio_fr: "Alexis Dante est un DJ et producteur basé dans le Sud de la France. Partenaire B2B régulier de Paga, il apporte sa sensibilité unique aux sets partagés.",
      bio_en: "Alexis Dante is a DJ and producer based in the South of France. A regular B2B partner of Paga, he brings his unique sensitivity to shared sets.",
      shortBio_fr: "DJ & producteur. B2B Paga. Afro house, melodic techno.",
      shortBio_en: "DJ & producer. B2B Paga. Afro house, melodic techno.",
      instagram: "https://www.instagram.com/alexis.dante", isActive: true, order: 1,
    },
  });

  const events = [
    { slug: "rooftop-party-ibiza-2026", title_fr: "Rooftop Party", title_en: "Rooftop Party", venue: "Rooftop", city: "Ibiza", country: "Espagne", date: new Date("2026-06-11T22:00:00"), isB2B: true, isFeatured: true, artistIds: [paga.id, alexis.id] },
    { slug: "la-villa-gruissan-2026", title_fr: "La Villa", title_en: "La Villa", venue: "La Villa", city: "Gruissan", country: "France", date: new Date("2026-06-13T23:00:00"), isB2B: false, isFeatured: false, artistIds: [paga.id] },
    { slug: "white-sand-andernos-2026", title_fr: "White Sand", title_en: "White Sand", venue: "White Sand", city: "Andernos-les-Bains", country: "France", date: new Date("2026-06-14T22:00:00"), isB2B: false, isFeatured: false, artistIds: [paga.id] },
    { slug: "delta-festival-marseille-juin-2026", title_fr: "Delta Festival (TBA)", title_en: "Delta Festival (TBA)", venue: "Delta Festival", city: "Marseille", country: "France", date: new Date("2026-06-21T18:00:00"), isB2B: false, isFeatured: true, artistIds: [paga.id] },
    { slug: "fos-en-petanque-2026", title_fr: "Fos en Pétanque", title_en: "Fos en Pétanque", venue: "Fos en Pétanque Festival", city: "Fos-sur-Mer", country: "France", date: new Date("2026-06-24T18:00:00"), isB2B: false, isFeatured: false, artistIds: [paga.id] },
    { slug: "holi-lakes-festival-2026", title_fr: "Holi Lakes Festival", title_en: "Holi Lakes Festival", venue: "Lacs de l'Eau d'Heure", city: "Cerfontaine", country: "Belgique", date: new Date("2026-07-11T16:00:00"), isB2B: false, isFeatured: true, artistIds: [paga.id] },
    { slug: "riv-music-live-2026", title_fr: "Riv' Music Live", title_en: "Riv' Music Live", venue: "Riv' Music", city: "Rive-de-Gier", country: "France", date: new Date("2026-07-13T20:00:00"), isB2B: false, isFeatured: false, artistIds: [paga.id] },
    { slug: "scandals-pool-party-lyon-2026", title_fr: "Scandals Pool Party", title_en: "Scandals Pool Party", venue: "Hôtel des Séquoias, Ruy-Montceau", city: "Lyon", country: "France", date: new Date("2026-07-14T10:00:00"), isB2B: false, isFeatured: true, artistIds: [paga.id] },
    { slug: "fetes-murataises-2026", title_fr: "Les Fêtes Murataises", title_en: "Les Fêtes Murataises", venue: "Fêtes Murataises", city: "Murat-sur-Vèbre", country: "France", date: new Date("2026-07-17T21:00:00"), isB2B: false, isFeatured: false, artistIds: [paga.id] },
    { slug: "azur-festival-la-crau-2026", title_fr: "Azur Festival", title_en: "Azur Festival", venue: "Parc du Béal", city: "La Crau", country: "France", date: new Date("2026-07-18T17:00:00"), isB2B: true, isFeatured: true, artistIds: [paga.id, alexis.id] },
    { slug: "delta-festival-marseille-juillet-2026", title_fr: "Delta Festival", title_en: "Delta Festival", venue: "Delta Festival", city: "Marseille", country: "France", date: new Date("2026-07-23T18:00:00"), isB2B: false, isFeatured: true, artistIds: [paga.id] },
    { slug: "rosa-fest-chailly-2026", title_fr: "Rosa'Fest Festival", title_en: "Rosa'Fest Festival", venue: "Rosa'Fest", city: "Chailly-en-Gâtinais", country: "France", date: new Date("2026-07-25T20:00:00"), isB2B: false, isFeatured: false, artistIds: [paga.id] },
    { slug: "le-sun-corse-2026", title_fr: "Le Sun", title_en: "Le Sun", venue: "Le Sun", city: "Corse", country: "France", date: new Date("2026-07-27T23:00:00"), isB2B: false, isFeatured: false, artistIds: [paga.id] },
    { slug: "lloret-de-mar-2026", title_fr: "Lloret de Mar", title_en: "Lloret de Mar", venue: "Club TBA", city: "Lloret de Mar", country: "Espagne", date: new Date("2026-08-03T23:00:00"), isB2B: false, isFeatured: false, artistIds: [paga.id] },
    { slug: "ya-degun-festival-bandol-2026", title_fr: "Ya Degun Festival", title_en: "Ya Degun Festival", venue: "Ya Degun Festival", city: "Bandol", country: "France", date: new Date("2026-08-15T17:00:00"), isB2B: false, isFeatured: true, artistIds: [paga.id] },
  ];

  for (const { artistIds, ...data } of events) {
    await prisma.event.create({
      data: { ...data, isActive: true, artists: { create: artistIds.map((id) => ({ artistId: id })) } },
    });
  }

  await prisma.track.createMany({
    data: [
      { title: "Summer Vibes 2026", artistName: "Paga", soundcloudEmbedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/paga_lmsa&color=%23E63946&auto_play=false", isActive: true, order: 0, artistId: paga.id },
      { title: "Ibiza Nights", artistName: "Paga × Alexis Dante", soundcloudEmbedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/paga_lmsa&color=%23E63946&auto_play=false", isActive: true, order: 1, artistId: paga.id },
      { title: "Afro House Journey", artistName: "Alexis Dante", soundcloudEmbedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/alexis.dante&color=%23E63946&auto_play=false", isActive: true, order: 3, artistId: alexis.id },
    ],
  });

  await prisma.video.createMany({
    data: [
      { title: "Paga @ Delta Festival Marseille", youtubeEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", isActive: true, order: 0 },
      { title: "Paga × Alexis Dante - Live B2B Ibiza", youtubeEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", isActive: true, order: 1 },
    ],
  });

  return NextResponse.json({
    message: "Database seeded successfully",
    created: { users: 3, artists: 2, events: events.length, tracks: 3, videos: 2 },
  });
}
