import '../src/config.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create default skills
  const skills = await Promise.all([
    prisma.skill.upsert({
      where: { name: 'JavaScript' },
      update: {},
      create: {
        name: 'JavaScript',
        category: 'FRONTEND',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Python' },
      update: {},
      create: {
        name: 'Python',
        category: 'BACKEND',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Go' },
      update: {},
      create: {
        name: 'Go',
        category: 'BACKEND',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'React' },
      update: {},
      create: {
        name: 'React',
        category: 'FRONTEND',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Node.js' },
      update: {},
      create: {
        name: 'Node.js',
        category: 'BACKEND',
      },
    }),
  ]);

  console.log('✅ Created skills:', skills.map(s => s.name).join(', '));

  // Create HR user
  const hrPassword = await bcrypt.hash('hr123456', 10);
  const hrUser = await prisma.user.upsert({
    where: { email: 'hr@example.com' },
    update: {},
    create: {
      email: 'hr@example.com',
      password: hrPassword,
      role: 'HR',
    },
  });

  console.log('✅ Created HR user:', hrUser.email);

  // Create Candidate user with profile
  const candidatePassword = await bcrypt.hash('candidate123456', 10);
  const candidateUser = await prisma.user.upsert({
    where: { email: 'candidate@example.com' },
    update: {},
    create: {
      email: 'candidate@example.com',
      password: candidatePassword,
      role: 'CANDIDATE',
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          headline: 'Senior Full Stack Developer',
          summary: 'Experienced developer with 5+ years in web development',
          isOpenToWork: true,
          skills: {
            create: [
              { 
                skillId: skills[0].id, // JavaScript
                proficiencyLevel: 'ADVANCED',
                yearsOfExperience: 5,
              },
              { 
                skillId: skills[1].id, // Python
                proficiencyLevel: 'INTERMEDIATE',
                yearsOfExperience: 3,
              },
              { 
                skillId: skills[3].id, // React
                proficiencyLevel: 'ADVANCED',
                yearsOfExperience: 4,
              },
            ],
          },
          isPublicProfile: true, // Allow public viewing
          workExperiences: {
            create: [
              {
                companyName: 'Tech Corp',
                position: 'Senior Developer',
                startDate: new Date('2020-01-01'),
                endDate: new Date('2023-12-31'),
                description: 'Led development of multiple web applications',
              },
            ],
          },
        },
      },
    },
    include: {
      profile: {
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
        },
      },
    },
  });

  console.log('✅ Created Candidate user:', candidateUser.email);
  console.log('   Profile:', candidateUser.profile?.firstName, candidateUser.profile?.lastName);
  console.log('   Skills:', candidateUser.profile?.skills.map(s => s.skill.name).join(', '));

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📝 Test credentials:');
  console.log('   HR: hr@example.com / hr123456');
  console.log('   Candidate: candidate@example.com / candidate123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

