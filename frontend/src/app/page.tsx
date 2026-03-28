import { HeroSection } from "@/components/home/HeroSection";
import { MainEventTeaser } from "@/components/home/MainEventTeaser";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden">
      <HeroSection />
      <MainEventTeaser />
      <FeaturesGrid />
    </div>
  );
}
