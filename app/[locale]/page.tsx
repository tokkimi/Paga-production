import MirageExperience from "@/components/home/MirageExperience";
import type { Metadata } from "next";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const descriptions = {
    fr: "Mirage - l'experience Paga x Alexis Dante : sons, videos, dates et univers solos en trois panneaux.",
    en: "Mirage - the Paga x Alexis Dante experience: tracks, videos, dates and solo worlds in three panels.",
    ko: "Mirage - Paga x Alexis Dante 경험: 음악, 영상, 일정과 각 아티스트의 세계를 세 개의 패널로 소개합니다.",
  };

  return {
    title: "Mirage | Paga x Alexis Dante",
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  };
}

export default function HomePage() {
  return <MirageExperience />;
}
