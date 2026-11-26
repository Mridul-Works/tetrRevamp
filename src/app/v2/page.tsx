import type { Metadata } from "next";
import Nav from "@/components/v2/Nav";
import Hero from "@/components/v2/Hero";
import Belt from "@/components/v2/Belt";
import Tickets from "@/components/v2/Tickets";
import RouteBoard from "@/components/v2/RouteBoard";
import MidCta from "@/components/v2/MidCta";
import LastYear from "@/components/v2/LastYear";
import Pillars from "@/components/v2/Pillars";
import Plan from "@/components/v2/Plan";
import Info from "@/components/v2/Info";
import Faq from "@/components/v2/Faq";
import Closing from "@/components/v2/Closing";
import Footer from "@/components/v2/Footer";
import StickyBar from "@/components/v2/StickyBar";
import Analytics from "@/components/v2/Analytics";
import { v2CountryBelt } from "@/data/v2";

export const metadata: Metadata = {
  title: "Tetr College of Business — Learn business by doing business in 7 countries",
  description:
    "Global Bachelor’s and Master’s programs. A new country every term, a real company you run, graded on revenue. Get fees, scholarships and the brochure.",
};

/**
 * /v2: the lead page. Order is built for conversion: proposition + form above the fold,
 * proof, the offer (programs), the experience (route), a mid-page catch, outcomes,
 * objections (FAQ), then the form again.
 */
export default function V2() {
  return (
    <div className="v2 min-h-screen pb-20 md:pb-0">
      <Analytics />
      <Nav />
      <StickyBar />
      <main>
        <Hero />
        <Belt caption="At a glance — drag the belt" hint="Auto-slides — drag to browse" />
        <Tickets />
        <RouteBoard />
        <MidCta />
        <LastYear />
        <Pillars />
        <Belt items={v2CountryBelt} caption="The seven stops" hint="Drag to browse" tone="forest" />
        <Plan />
        <Info />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
