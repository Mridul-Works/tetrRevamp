import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
// import TenThings from "@/components/sections/TenThings"; // hidden for now
import TenThingsPasses from "@/components/sections/TenThingsPasses";
import Route from "@/components/sections/Route";
import Programs from "@/components/sections/Programs";
import Outcomes from "@/components/sections/Outcomes";
import Launchpad from "@/components/sections/Launchpad";
import CareerLabs from "@/components/sections/CareerLabs";
import Faculty from "@/components/sections/Faculty";
import Creators from "@/components/sections/Creators";
import Immersions from "@/components/sections/Immersions";
import Cohort from "@/components/sections/Cohort";
import Podcast from "@/components/sections/Podcast";
import Campus from "@/components/sections/Campus";
import Press from "@/components/sections/Press";
import Events from "@/components/sections/Events";
import Apply from "@/components/sections/Apply";
import Footer from "@/components/sections/Footer";
import Rise from "@/components/ui/Rise";
import Intro from "@/components/ui/Intro";

export default function Home() {
  return (
    <>
      <Intro />
      <Header />
      <main>
        <Hero />
        {/* <TenThings /> hidden for now */}
        <TenThingsPasses />
        <Route />
        <Programs />
        <Outcomes />
        <Rise from="bg-paper">
          <Launchpad />
        </Rise>
        <CareerLabs />
        <Rise from="bg-ink">
          <Faculty />
        </Rise>
        <Rise from="bg-cream">
          <Creators />
        </Rise>
        <Immersions />
        <Cohort />
        <Rise from="bg-forest">
          <Podcast />
        </Rise>
        <Rise from="bg-paper">
          <Campus />
        </Rise>
        <Press />
        <Rise from="bg-forest">
          <Events />
        </Rise>
        <Rise from="bg-paper">
          <Apply />
        </Rise>
      </main>
      <Footer />
    </>
  );
}
