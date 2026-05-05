import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@innovationhub.dev";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";
  const adminName = process.env.ADMIN_NAME || "Platform Admin";

  // Create or update admin
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: Role.ADMIN,
      bio: "Platform administrator for Student Innovation Hub.",
      university: "Innovation Hub",
      department: "Administration",
      skills: ["Platform Management", "User Experience", "Strategy"],
      interests: ["EdTech", "Innovation", "Collaboration"],
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Demo professor
  const professor = await prisma.user.upsert({
    where: { email: "prof.smith@innovationhub.dev" },
    update: {},
    create: {
      email: "prof.smith@innovationhub.dev",
      password: await bcrypt.hash("Professor@123", 12),
      name: "Dr. Sarah Smith",
      role: Role.PROFESSOR,
      bio: "Associate Professor of Computer Science specializing in AI and entrepreneurship.",
      university: "Stanford University",
      department: "Computer Science",
      skills: ["Machine Learning", "Research", "Mentoring", "Python"],
      interests: ["AI/ML", "EdTech", "Social Impact"],
    },
  });
  console.log(`✅ Professor created: ${professor.email}`);

  // Demo student
  const student = await prisma.user.upsert({
    where: { email: "student@innovationhub.dev" },
    update: {},
    create: {
      email: "student@innovationhub.dev",
      password: await bcrypt.hash("Student@123", 12),
      name: "Alex Johnson",
      role: Role.STUDENT,
      bio: "CS sophomore passionate about building products that matter.",
      university: "MIT",
      department: "Computer Science",
      year: "2",
      skills: ["React", "Node.js", "Python", "UI/UX Design"],
      interests: ["AI/ML", "FinTech", "Web3"],
    },
  });
  console.log(`✅ Student created: ${student.email}`);

  // Demo idea
  const idea = await prisma.idea.upsert({
    where: { id: "demo-idea-001" },
    update: {},
    create: {
      id: "demo-idea-001",
      title: "AI-Powered Study Group Matcher",
      description: "A platform that uses machine learning to match students with compatible study partners based on learning style, schedule, and course content. Features smart scheduling, progress tracking, and collaborative tools.",
      tags: ["AI", "EdTech", "Machine Learning", "React"],
      domain: "EdTech",
      stage: "Ideation",
      status: "OPEN",
      teamSize: 4,
      lookingFor: ["Frontend Developer", "ML Engineer", "UX Designer"],
      authorId: student.id,
    },
  });
  console.log(`✅ Demo idea created: ${idea.title}`);

  // Create team for idea
  const existingTeam = await prisma.team.findUnique({ where: { ideaId: idea.id } });
  if (!existingTeam) {
    await prisma.team.create({
      data: {
        ideaId: idea.id,
        members: {
          create: { userId: student.id, role: "Founder" },
        },
      },
    });
    console.log(`✅ Team created for demo idea`);
  }

  console.log("\n🎉 Seeding complete!\n");
  console.log("📋 Demo Credentials:");
  console.log("─────────────────────────────────────");
  console.log(`Admin:     ${adminEmail} / ${adminPassword}`);
  console.log(`Professor: prof.smith@innovationhub.dev / Professor@123`);
  console.log(`Student:   student@innovationhub.dev / Student@123`);
  console.log("─────────────────────────────────────\n");
}

main()
  .catch((e) => { console.error("Seed error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
