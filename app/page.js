import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Skills from "@/components/Skills";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { readAll } from "@/lib/content";

// Revalidate so a new Vercel deploy (or ISR) always serves the latest committed content.
export const revalidate = 60;

export default async function Home() {
  const content = await readAll();
  const {
    about,
    site,
    services,
    projects,
    skills,
    testimonials,
  } = content;

  return (
    <>
      <Navbar />
      <main>
        <Hero about={about} site={site} />
        <About about={about} />
        <Services services={services} />
        <Work projects={projects} />
        <Skills skills={skills} />
        <Testimonials testimonials={testimonials} />
        <Contact about={about} />
      </main>
      <Footer about={about} />
    </>
  );
}
