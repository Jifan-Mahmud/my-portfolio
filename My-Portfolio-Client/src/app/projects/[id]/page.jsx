import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ArrowLeft, ExternalLink, Calendar, Layers, ShieldCheck } from "lucide-react";
import { LogoGithub } from "@gravity-ui/icons";

async function getProject(id) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${apiUrl}/projects/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}

export default async function ProjectDetailsPage({ params }) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0d0f14] text-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-zinc-400 mb-6">The requested project could not be found or has been removed.</p>
          <Link
            href="/#projects"
            className="px-6 py-3 rounded-full bg-amber-400 text-black font-semibold text-sm hover:bg-amber-500 transition-colors"
          >
            Back to Projects
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0f14] text-white light:bg-[#f8fafc] light:text-[#0f172a] transition-colors">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full">
        {/* Back Link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all projects</span>
        </Link>

        {/* Project Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 light:border-zinc-200 pb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              {project.category || "Full-Stack Project"}
            </span>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white light:text-zinc-950 mt-2">
              {project.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 transition-all flex items-center gap-2 shadow-lg shadow-amber-400/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider glass-card text-white light:text-zinc-900 hover:border-amber-400 transition-all flex items-center gap-2"
              >
                <LogoGithub className="w-4 h-4" />
                <span>Client Repo</span>
              </a>
            )}
            {project.githubServerLink && (
              <a
                href={project.githubServerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider glass-card text-white light:text-zinc-900 hover:border-amber-400 transition-all flex items-center gap-2"
              >
                <LogoGithub className="w-4 h-4" />
                <span>Server Repo</span>
              </a>
            )}
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden glass-card mb-12">
          <Image
            src={
              project.image ||
              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop"
            }
            alt={project.title}
            fill
            priority
            unoptimized={Boolean(project.image?.startsWith("data:"))}
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Details & Tech Stack Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-2xl font-bold text-white light:text-zinc-900">Project Overview</h2>
            <p className="text-base text-zinc-300 light:text-zinc-700 leading-relaxed whitespace-pre-line">
              {project.details || project.description}
            </p>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-3xl space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-wider font-semibold text-amber-400 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(project.techStack || []).map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-white/5 light:bg-zinc-200 text-xs font-mono text-zinc-200 light:text-zinc-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 light:border-zinc-200">
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 block mb-1">
                  Architecture
                </span>
                <p className="text-sm text-zinc-200 light:text-zinc-800 font-medium">
                  Modular MERN / Full-Stack Next.js
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 light:border-zinc-200">
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 block mb-1">
                  Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Production Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
