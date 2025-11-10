import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 10 linh vật với 5 cấp độ mỗi linh vật
const spiritPetsData = [
  {
    code: 'BE_NA',
    baseNameVi: 'Tiểu Long Bé Na',
    maxStars: 5,
    theme: 'Toán học',
    color: 'Xanh ngọc + đỏ',
    specialEffect: 'Double points, combo',
    levels: [
      { star: 1, name_vi: 'Rồng Con Bé Na', effect: { bonus_points: 0.05 }, unlock_cost: { STAR: 50 } },
      { star: 2, name_vi: 'Rồng Bé Na Học Giả', effect: { bonus_xp: 0.1 }, unlock_cost: { STAR: 100 } },
      { star: 3, name_vi: 'Rồng Bé Na Tỏa Sáng', effect: { perfect_bonus: 0.15 }, unlock_cost: { STAR: 200 } },
      { star: 4, name_vi: 'Rồng Bé Na Long Vân', effect: { combo_bonus: 0.2 }, unlock_cost: { STAR: 400 } },
      { star: 5, name_vi: 'Thần Long Bé Na Ngọc Tỉ', effect: { double_points_chance: 0.08 }, unlock_cost: { STAR: 800 } },
    ],
  },
  {
    code: 'MIU',
    baseNameVi: 'Cô Ba Miu',
    maxStars: 5,
    theme: 'Tiếng Việt',
    color: 'Vàng nhạt + trắng',
    specialEffect: 'Hint & review bonus',
    levels: [
      { star: 1, name_vi: 'Mèo Con Miu', effect: { hint_bonus: 0.1 }, unlock_cost: { STAR: 50 } },
      { star: 2, name_vi: 'Mèo Miu Học Giả', effect: { review_bonus: 0.15 }, unlock_cost: { STAR: 100 } },
      { star: 3, name_vi: 'Mèo Miu Tỏa Sáng', effect: { hint_discount: 0.2 }, unlock_cost: { STAR: 200 } },
      { star: 4, name_vi: 'Mèo Miu Long Vân', effect: { review_xp: 0.25 }, unlock_cost: { STAR: 400 } },
      { star: 5, name_vi: 'Thần Mèo Miu Ngọc Tỉ', effect: { free_hints: 2 }, unlock_cost: { STAR: 800 } },
    ],
  },
  {
    code: 'FLARE',
    baseNameVi: 'Cáo Flare',
    maxStars: 5,
    theme: 'Khoa học',
    color: 'Cam + vàng',
    specialEffect: 'Speed & perfect bonus',
    levels: [
      { star: 1, name_vi: 'Cáo Con Flare', effect: { speed_bonus: 0.1 }, unlock_cost: { STAR: 50 } },
      { star: 2, name_vi: 'Cáo Flare Học Giả', effect: { perfect_bonus: 0.15 }, unlock_cost: { STAR: 100 } },
      { star: 3, name_vi: 'Cáo Flare Tỏa Sáng', effect: { speed_xp: 0.2 }, unlock_cost: { STAR: 200 } },
      { star: 4, name_vi: 'Cáo Flare Long Vân', effect: { perfect_reward: 0.25 }, unlock_cost: { STAR: 400 } },
      { star: 5, name_vi: 'Thần Cáo Flare Ngọc Tỉ', effect: { time_bonus: 0.3 }, unlock_cost: { STAR: 800 } },
    ],
  },
  {
    code: 'TURU',
    baseNameVi: 'Rùa Sóng',
    maxStars: 5,
    theme: 'Môi trường / Biển',
    color: 'Xanh lam',
    specialEffect: 'Shield & energy regen',
    levels: [
      { star: 1, name_vi: 'Rùa Con Turu', effect: { shield: 1 }, unlock_cost: { STAR: 50 } },
      { star: 2, name_vi: 'Rùa Turu Học Giả', effect: { energy_regen: 0.1 }, unlock_cost: { STAR: 100 } },
      { star: 3, name_vi: 'Rùa Turu Tỏa Sáng', effect: { shield_duration: 2 }, unlock_cost: { STAR: 200 } },
      { star: 4, name_vi: 'Rùa Turu Long Vân', effect: { energy_regen: 0.2 }, unlock_cost: { STAR: 400 } },
      { star: 5, name_vi: 'Thần Rùa Turu Ngọc Tỉ', effect: { permanent_shield: true }, unlock_cost: { STAR: 800 } },
    ],
  },
  {
    code: 'PHOEN',
    baseNameVi: 'Chim Phượng',
    maxStars: 5,
    theme: 'Tiếng Anh',
    color: 'Đỏ hồng',
    specialEffect: 'Revival & protect score',
    levels: [
      { star: 1, name_vi: 'Chim Con Phen', effect: { revival: 1 }, unlock_cost: { STAR: 50 } },
      { star: 2, name_vi: 'Chim Phen Học Giả', effect: { protect_score: 0.1 }, unlock_cost: { STAR: 100 } },
      { star: 3, name_vi: 'Chim Phen Tỏa Sáng', effect: { revival: 2 }, unlock_cost: { STAR: 200 } },
      { star: 4, name_vi: 'Chim Phen Long Vân', effect: { protect_score: 0.2 }, unlock_cost: { STAR: 400 } },
      { star: 5, name_vi: 'Thần Chim Phen Ngọc Tỉ', effect: { infinite_revival: true }, unlock_cost: { STAR: 800 } },
    ],
  },
  {
    code: 'DEER',
    baseNameVi: 'Nai Tri Thức',
    maxStars: 5,
    theme: 'Khoa học tự nhiên',
    color: 'Nâu + lá',
    specialEffect: 'Streak & focus bonus',
    levels: [
      { star: 1, name_vi: 'Nai Con Deer', effect: { streak_bonus: 0.1 }, unlock_cost: { STAR: 50 } },
      { star: 2, name_vi: 'Nai Deer Học Giả', effect: { focus_bonus: 0.15 }, unlock_cost: { STAR: 100 } },
      { star: 3, name_vi: 'Nai Deer Tỏa Sáng', effect: { streak_xp: 0.2 }, unlock_cost: { STAR: 200 } },
      { star: 4, name_vi: 'Nai Deer Long Vân', effect: { focus_duration: 0.25 }, unlock_cost: { STAR: 400 } },
      { star: 5, name_vi: 'Thần Nai Deer Ngọc Tỉ', effect: { streak_multiplier: 2 }, unlock_cost: { STAR: 800 } },
    ],
  },
  {
    code: 'STARFAE',
    baseNameVi: 'Tinh Linh Sao',
    maxStars: 5,
    theme: 'Sáng tạo / Nghệ thuật',
    color: 'Tím + trắng',
    specialEffect: 'Random gift & combo',
    levels: [
      { star: 1, name_vi: 'Tinh Linh Con Starfae', effect: { random_gift: 0.1 }, unlock_cost: { STAR: 50 } },
      { star: 2, name_vi: 'Tinh Linh Starfae Học Giả', effect: { combo_bonus: 0.15 }, unlock_cost: { STAR: 100 } },
      { star: 3, name_vi: 'Tinh Linh Starfae Tỏa Sáng', effect: { random_gift: 0.2 }, unlock_cost: { STAR: 200 } },
      { star: 4, name_vi: 'Tinh Linh Starfae Long Vân', effect: { combo_multiplier: 0.25 }, unlock_cost: { STAR: 400 } },
      { star: 5, name_vi: 'Thần Tinh Linh Starfae Ngọc Tỉ', effect: { daily_gift: true }, unlock_cost: { STAR: 800 } },
    ],
  },
  {
    code: 'TY',
    baseNameVi: 'Thỏ Tý',
    maxStars: 5,
    theme: 'Kỹ năng sống',
    color: 'Nâu + xanh',
    specialEffect: 'Streak bonus & time buff',
    levels: [
      { star: 1, name_vi: 'Thỏ Con Tý', effect: { streak_bonus: 0.1 }, unlock_cost: { STAR: 50 } },
      { star: 2, name_vi: 'Thỏ Tý Học Giả', effect: { time_buff: 0.15 }, unlock_cost: { STAR: 100 } },
      { star: 3, name_vi: 'Thỏ Tý Tỏa Sáng', effect: { streak_xp: 0.2 }, unlock_cost: { STAR: 200 } },
      { star: 4, name_vi: 'Thỏ Tý Long Vân', effect: { time_buff: 0.25 }, unlock_cost: { STAR: 400 } },
      { star: 5, name_vi: 'Thần Thỏ Tý Ngọc Tỉ', effect: { permanent_streak: true }, unlock_cost: { STAR: 800 } },
    ],
  },
  {
    code: 'SHADOW',
    baseNameVi: 'Long Bóng Tối',
    maxStars: 5,
    theme: 'Logic nâng cao',
    color: 'Tím đen',
    specialEffect: 'XP boost & rare drop',
    levels: [
      { star: 1, name_vi: 'Long Con Shadow', effect: { xp_boost: 0.1 }, unlock_cost: { STAR: 50 } },
      { star: 2, name_vi: 'Long Shadow Học Giả', effect: { rare_drop: 0.15 }, unlock_cost: { STAR: 100 } },
      { star: 3, name_vi: 'Long Shadow Tỏa Sáng', effect: { xp_boost: 0.2 }, unlock_cost: { STAR: 200 } },
      { star: 4, name_vi: 'Long Shadow Long Vân', effect: { rare_drop: 0.25 }, unlock_cost: { STAR: 400 } },
      { star: 5, name_vi: 'Thần Long Shadow Ngọc Tỉ', effect: { double_xp: true }, unlock_cost: { STAR: 800 } },
    ],
  },
  {
    code: 'KILAN',
    baseNameVi: 'Kỳ Lân Sao',
    maxStars: 5,
    theme: 'Tổng hợp',
    color: 'Cầu vồng',
    specialEffect: 'Unlock world bonus',
    levels: [
      { star: 1, name_vi: 'Kỳ Lân Con Kilan', effect: { unlock_bonus: 0.1 }, unlock_cost: { STAR: 50 } },
      { star: 2, name_vi: 'Kỳ Lân Kilan Học Giả', effect: { world_access: 1 }, unlock_cost: { STAR: 100 } },
      { star: 3, name_vi: 'Kỳ Lân Kilan Tỏa Sáng', effect: { unlock_bonus: 0.2 }, unlock_cost: { STAR: 200 } },
      { star: 4, name_vi: 'Kỳ Lân Kilan Long Vân', effect: { world_access: 2 }, unlock_cost: { STAR: 400 } },
      { star: 5, name_vi: 'Thần Kỳ Lân Kilan Ngọc Tỉ', effect: { all_worlds_unlocked: true }, unlock_cost: { STAR: 800 } },
    ],
  },
];

async function main() {
  console.log('🌟 Bắt đầu seed linh vật...');

  for (const petData of spiritPetsData) {
    const existing = await prisma.spiritPet.findUnique({
      where: { code: petData.code },
    });

    if (existing) {
      console.log(`⏭️  Linh vật ${petData.code} đã tồn tại, bỏ qua...`);
      continue;
    }

    const pet = await prisma.spiritPet.create({
      data: {
        code: petData.code,
        baseNameVi: petData.baseNameVi,
        maxStars: petData.maxStars,
        levels: petData.levels as any,
        theme: petData.theme,
        color: petData.color,
        specialEffect: petData.specialEffect,
        isActive: true,
      },
    });

    console.log(`✅ Đã tạo linh vật: ${pet.baseNameVi} (${pet.code})`);
  }

  console.log('🎉 Hoàn thành seed linh vật!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed linh vật:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

