import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductSlider } from "@/components/ProductSlider";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";
import { StructuredData } from "@/components/StructuredData";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main id="main-content">
      <StructuredData locale={locale} dict={dict} />
      <HeroCarousel locale={locale} dict={dict} />
      <ProductSlider locale={locale} dict={dict} />
      <TestimonialsSection dict={dict} />
      <ContactSection dict={dict} />
    </main>
  );
}
