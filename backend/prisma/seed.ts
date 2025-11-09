import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Get default admin config from env or use defaults
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  const adminFullName = process.env.DEFAULT_ADMIN_FULL_NAME || 'Admin User';
  const adminRole = process.env.DEFAULT_ADMIN_ROLE || 'super_admin';

  // Create default admin user
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminPasswordHash,
      fullName: adminFullName,
      role: adminRole,
    },
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      fullName: adminFullName,
      role: adminRole,
    },
  });

  console.log('✅ Created/Updated admin user:', admin.email);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   Full Name: ${adminFullName}`);
  console.log(`   Role: ${adminRole}`);
  console.log('   ⚠️  Please change password in production!');

  // Get default student config from env or use defaults
  const studentEmail = process.env.DEFAULT_STUDENT_EMAIL || 'student@example.com';
  const studentPassword = process.env.DEFAULT_STUDENT_PASSWORD || 'student123';
  const studentFullName = process.env.DEFAULT_STUDENT_FULL_NAME || 'Test Student';
  const studentGrade = parseInt(process.env.DEFAULT_STUDENT_GRADE || '2');
  const studentParentPin = process.env.DEFAULT_STUDENT_PARENT_PIN || '1234';

  // Create test student user
  const studentPasswordHash = await bcrypt.hash(studentPassword, 10);
  const student = await prisma.user.upsert({
    where: { email: studentEmail },
    update: {
      passwordHash: studentPasswordHash,
      fullName: studentFullName,
      grade: studentGrade,
      parentPin: studentParentPin,
    },
    create: {
      email: studentEmail,
      passwordHash: studentPasswordHash,
      fullName: studentFullName,
      grade: studentGrade,
      role: 'student',
      parentPin: studentParentPin,
    },
  });

  console.log('✅ Created/Updated test student:', student.email);
  console.log(`   Password: ${studentPassword}`);
  console.log(`   Full Name: ${studentFullName}`);
  console.log(`   Grade: ${studentGrade}`);
  console.log(`   Parent PIN: ${studentParentPin}`);

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

