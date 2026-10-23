require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "portfolio_db";
const adminEmail = (process.env.ADMIN_EMAIL || "admin@jifanmahmud.com").toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;

async function seed() {
  if (!adminPassword) {
    console.error("❌ ADMIN_PASSWORD is required in .env for database seeding.");
    process.exit(1);
  }
  if (!uri) {
    console.error("❌ MONGODB_URI is missing from .env");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(`Connected to MongoDB. Seeding database "${dbName}"...`);
    const db = client.db(dbName);

    // 1. Seed Admin User
    const usersCollection = db.collection("users");
    const existingAdmin = await usersCollection.findOne({ email: adminEmail });

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (existingAdmin) {
      await usersCollection.updateOne(
        { email: adminEmail },
        {
          $set: {
            password: hashedPassword,
            name: "B.M. Jifan Mahmud",
            role: "admin",
            updatedAt: new Date(),
          },
        }
      );
      console.log(`✅ Admin user updated: ${adminEmail}`);
    } else {
      await usersCollection.insertOne({
        name: "B.M. Jifan Mahmud",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
      });
      console.log(`✅ Admin user created: ${adminEmail}`);
    }

    // 2. Seed Profile
    const profileCollection = db.collection("profile");
    await profileCollection.deleteMany({});
    await profileCollection.insertOne({
      name: "B.M. Jifan Mahmud",
      role: "Full-Stack Web Developer",
      bio: "Crafting intuitive, high-performance web experiences with React.js, Next.js, Node.js, and MongoDB. Transforming ideas into pixel-perfect digital realities.",
      aboutJourney: "Graduated with a Diploma in Engineering in Computer Science and Technology (CST) from Barisal Polytechnic Institute. Solidified expertise through hands-on full-stack development training at Programming Hero and People N Tech. Committed to continuous learning and building scalable, user-centric web applications.",
      education: "Diploma in Engineering, Computer Science and Technology (CST), Barisal Polytechnic Institute",
      photoUrl: "/assets/jifan1.png",
      resumeUrl: "https://drive.google.com/file/d/1exampleResumeID/view?usp=sharing",
      email: "jifanmahmud@gmail.com",
      phone: "+880 1700-000000",
      location: "Barisal, Bangladesh",
      availability: "Available for new opportunities",
      socialLinks: {
        github: "https://github.com/jifanmahmud",
        linkedin: "https://linkedin.com/in/jifanmahmud",
        facebook: "https://facebook.com/jifanmahmud",
        twitter: "https://twitter.com/jifanmahmud",
      },
      stats: {
        projectsCompleted: "15+",
        satisfiedClients: "10+",
        yearsExperience: "2+",
        contributions: "400+",
      },
      createdAt: new Date(),
    });
    console.log("✅ Profile seeded.");

    // 3. Seed Skills
    const skillsCollection = db.collection("skills");
    await skillsCollection.deleteMany({});
    const initialSkills = [
      // Frontend
      { name: "React.js", category: "Frontend", level: 90, icon: "React", order: 1 },
      { name: "Next.js", category: "Frontend", level: 85, icon: "Nextjs", order: 2 },
      { name: "JavaScript (ES6+)", category: "Frontend", level: 92, icon: "Javascript", order: 3 },
      { name: "Tailwind CSS", category: "Frontend", level: 95, icon: "Tailwind", order: 4 },
      { name: "HTML5 & CSS3", category: "Frontend", level: 98, icon: "Html", order: 5 },
      // Backend
      { name: "Node.js", category: "Backend", level: 85, icon: "Nodejs", order: 6 },
      { name: "Express.js", category: "Backend", level: 88, icon: "Express", order: 7 },
      { name: "REST APIs & JWT", category: "Backend", level: 90, icon: "Lock", order: 8 },
      // Database
      { name: "MongoDB", category: "Database", level: 88, icon: "Database", order: 9 },
      // Tools & Others
      { name: "Better Auth", category: "Tools", level: 85, icon: "Shield", order: 10 },
      { name: "Git & GitHub", category: "Tools", level: 90, icon: "Git", order: 11 },
      { name: "Vercel & Render", category: "Tools", level: 85, icon: "Cloud", order: 12 },
    ];
    await skillsCollection.insertMany(initialSkills.map((s) => ({ ...s, createdAt: new Date() })));
    console.log(`✅ ${initialSkills.length} skills seeded.`);

    // 4. Seed Services
    const servicesCollection = db.collection("services");
    await servicesCollection.deleteMany({});
    const initialServices = [
      {
        number: "01",
        title: "Full-Stack Web Development",
        description: "Building scalable, end-to-end web applications using Next.js, Express.js, and MongoDB with clean architecture and modern performance.",
        order: 1,
      },
      {
        number: "02",
        title: "Frontend & UI/UX Engineering",
        description: "Transforming design mockups into pixel-perfect, lightning-fast interfaces with Tailwind CSS, HeroUI, and responsive layouts.",
        order: 2,
      },
      {
        number: "03",
        title: "Secure REST APIs & Authentication",
        description: "Developing robust API endpoints with JWT, Better Auth, rate limiting, and role-based access control for bulletproof security.",
        order: 3,
      },
      {
        number: "04",
        title: "Database Modeling & Performance",
        description: "Architecting efficient MongoDB schemas, optimizing queries, and handling secure cloud database connections.",
        order: 4,
      },
    ];
    await servicesCollection.insertMany(initialServices.map((s) => ({ ...s, createdAt: new Date() })));
    console.log(`✅ ${initialServices.length} services seeded.`);

    // 5. Seed Experience & Education
    const experiencesCollection = db.collection("experiences");
    await experiencesCollection.deleteMany({});
    const initialExperiences = [
      {
        title: "Diploma in Engineering (Computer Science & Technology)",
        organization: "Barisal Polytechnic Institute",
        type: "Education",
        period: "2020 - 2024",
        description: "Core computer science fundamentals, data structures, algorithms, operating systems, networking, and software engineering practices.",
        order: 1,
      },
      {
        title: "Complete Web Development Course",
        organization: "Programming Hero",
        type: "Training",
        period: "2024 - 2025",
        description: "Intensive training in modern MERN stack development: React.js, Node.js, Express.js, MongoDB, JWT authentication, and full-stack project building.",
        order: 2,
      },
      {
        title: "Full-Stack Web Development Program",
        organization: "People N Tech",
        type: "Training",
        period: "2024 - 2025",
        description: "Advanced JavaScript, professional project lifecycles, teamwork, clean code principles, and production deployments.",
        order: 3,
      },
      {
        title: "Freelance Full-Stack Developer",
        organization: "Self-Employed",
        type: "Work",
        period: "2024 - Present",
        description: "Delivering custom websites and full-stack web applications for clients, focusing on responsiveness, speed, and sleek modern UI.",
        order: 4,
      },
    ];
    await experiencesCollection.insertMany(initialExperiences.map((e) => ({ ...e, createdAt: new Date() })));
    console.log(`✅ ${initialExperiences.length} experiences/education seeded.`);

    // 6. Seed Projects
    const projectsCollection = db.collection("projects");
    await projectsCollection.deleteMany({});
    const initialProjects = [
      {
        title: "SkillBridge - E-Learning Platform",
        description: "A comprehensive learning management platform featuring video courses, quiz modules, instructor dashboards, and student enrollment.",
        details: "SkillBridge provides full course management with student progress tracking, interactive quizzes, video streaming, and secure payments. Built with Next.js, Express, and MongoDB.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
        liveLink: "https://skillbridge-demo.vercel.app",
        githubLink: "https://github.com/jifanmahmud/skillbridge-client",
        githubServerLink: "https://github.com/jifanmahmud/skillbridge-server",
        techStack: ["Next.js", "Express.js", "MongoDB", "Tailwind CSS", "Better Auth"],
        featured: true,
        category: "Full-Stack",
        createdAt: new Date(),
      },
      {
        title: "DevPulse - Tech Community & Blog",
        description: "Modern developer community hub for sharing technical articles, bookmarking tutorials, and engaging in discussions.",
        details: "Featuring markdown editing, real-time reactions, tag filtering, dark mode, and an admin content moderation dashboard.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
        liveLink: "https://devpulse-demo.vercel.app",
        githubLink: "https://github.com/jifanmahmud/devpulse-app",
        githubServerLink: "https://github.com/jifanmahmud/devpulse-server",
        techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"],
        featured: true,
        category: "Full-Stack",
        createdAt: new Date(),
      },
      {
        title: "ElectroZone - Modern Gadget Marketplace",
        description: "A high-conversion e-commerce platform with smart search, product filtering, cart drawer, and order management.",
        details: "Responsive e-commerce solution with dynamic product catalogs, category filtering, customer reviews, and order tracking.",
        image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1200&auto=format&fit=crop",
        liveLink: "https://electrozone-demo.vercel.app",
        githubLink: "https://github.com/jifanmahmud/electrozone-client",
        githubServerLink: "https://github.com/jifanmahmud/electrozone-server",
        techStack: ["Next.js", "Tailwind CSS", "HeroUI", "MongoDB"],
        featured: true,
        category: "Full-Stack",
        createdAt: new Date(),
      },
    ];
    await projectsCollection.insertMany(initialProjects);
    console.log(`✅ ${initialProjects.length} sample projects seeded.`);

    // 7. Seed Testimonials
    const testimonialsCollection = db.collection("testimonials");
    await testimonialsCollection.deleteMany({});
    const initialTestimonials = [
      {
        name: "Tanvir Ahmed",
        role: "Senior Instructor",
        company: "Programming Hero",
        feedback: "Jifan is an exceptionally hardworking and dedicated developer. His quick grasp of full-stack concepts and problem-solving mindset make him stand out.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        order: 1,
        createdAt: new Date(),
      },
      {
        name: "David Miller",
        role: "Product Manager",
        company: "Nexus Labs",
        feedback: "Working with Jifan was seamless! He transformed our ideas into a beautiful, functional web app with great speed and attention to detail.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        order: 2,
        createdAt: new Date(),
      },
    ];
    await testimonialsCollection.insertMany(initialTestimonials);
    console.log(`✅ ${initialTestimonials.length} testimonials seeded.`);

    console.log("\n🎉 Database seeded successfully with initial data and admin user!");
  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seed();
