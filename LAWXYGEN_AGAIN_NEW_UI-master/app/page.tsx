import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ServiceShowcase } from "@/components/sections/ServiceShowcase";
import { HomeExperience } from "@/components/sections/HomeExperience";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <ServiceShowcase />
        <HomeExperience />
      </main>

      <Footer />
    </>
  );
}