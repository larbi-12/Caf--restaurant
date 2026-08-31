import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import Introduction from "../components/home/Introduction";
import SignatureExperience from "../components/home/SignatureExperience";
import FeaturedDishes from "../components/home/FeaturedDishes";
import ChefMoment from "../components/home/ChefMoment";
import TestimonialsSection from "../components/home/TestimonialsSection";
import EventTeaser from "../components/home/EventTeaser";
import InstagramPreview from "../components/home/InstagramPreview";
import ReservationCTA from "../components/home/ReservationCTA";
import LocationSection from "../components/home/LocationSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Introduction />
      <SignatureExperience />
      <FeaturedDishes />
      <ChefMoment />
      <TestimonialsSection />
      <EventTeaser />
      <InstagramPreview />
      <ReservationCTA />
      <LocationSection />
    </>
  );
}
