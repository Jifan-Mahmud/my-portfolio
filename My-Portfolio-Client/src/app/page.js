import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import SkillsSection from "@/components/home/SkillsSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ServicesSection from "@/components/home/ServicesSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import CertificatesSection from "@/components/home/CertificatesSection";
import ContactSection from "@/components/home/ContactSection";

async function getPortfolioData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  try {
    const fetchWithTimeout = (url, options = {}, timeoutMs = 3500) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(timeoutMs),
      });
    };

    const [profileRes, projectsRes, skillsRes, expRes, servicesRes, certsRes] =
      await Promise.allSettled([
        fetchWithTimeout(`${apiUrl}/profile`, { next: { revalidate: 60 } }),
        fetchWithTimeout(`${apiUrl}/projects`, { next: { revalidate: 60 } }),
        fetchWithTimeout(`${apiUrl}/skills`, { next: { revalidate: 60 } }),
        fetchWithTimeout(`${apiUrl}/experiences`, { next: { revalidate: 60 } }),
        fetchWithTimeout(`${apiUrl}/services`, { next: { revalidate: 60 } }),
        fetchWithTimeout(`${apiUrl}/certificates`, { next: { revalidate: 60 } }),
      ]);

    const profile =
      profileRes.status === "fulfilled" && profileRes.value.ok
        ? (await profileRes.value.json()).data
        : null;

    const projects =
      projectsRes.status === "fulfilled" && projectsRes.value.ok
        ? (await projectsRes.value.json()).data
        : null;

    const skills =
      skillsRes.status === "fulfilled" && skillsRes.value.ok
        ? (await skillsRes.value.json()).data
        : null;

    const experiences =
      expRes.status === "fulfilled" && expRes.value.ok
        ? (await expRes.value.json()).data
        : null;

    const services =
      servicesRes.status === "fulfilled" && servicesRes.value.ok
        ? (await servicesRes.value.json()).data
        : null;

    const certificates =
      certsRes.status === "fulfilled" && certsRes.value.ok
        ? (await certsRes.value.json()).data
        : null;

    return { profile, projects, skills, experiences, services, certificates };
  } catch (err) {
    console.error("Error fetching portfolio data on server:", err);
    return {
      profile: null,
      projects: null,
      skills: null,
      experiences: null,
      services: null,
      certificates: null,
    };
  }
}

export default async function HomePage() {
  const { profile, projects, skills, experiences, services, certificates } =
    await getPortfolioData();

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-inherit transition-colors selection:bg-amber-400/30 selection:text-amber-200">
      <Navbar />
      <main className="flex-1">
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ServicesSection services={services} />
        <ExperienceSection experiences={experiences} />
        <CertificatesSection certificates={certificates} />
        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}
