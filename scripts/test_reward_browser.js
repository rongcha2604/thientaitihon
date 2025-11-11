/**
 * Browser Test Script - Test hệ thống thưởng, sao, mở khóa trong browser
 * 
 * Cách dùng:
 * 1. Mở browser console (F12)
 * 2. Copy và paste script này vào console
 * 3. Chạy: testRewardSystem()
 * 
 * Hoặc dùng từng function riêng:
 * - addTestStars(amount, grade) - Thêm sao để test
 * - addTestCoins(amount, grade) - Thêm coins để test
 * - testUnlockPet(petId) - Test unlock linh vật
 * - testPurchaseItem(itemId) - Test mua vật phẩm
 * - checkSystemState() - Kiểm tra trạng thái hệ thống
 */

// Helper: Thêm sao để test
function addTestStars(amount, grade = 2) {
    const key = `user_stars_grade_${grade}`;
    const current = parseInt(localStorage.getItem(key) || '0', 10);
    const newAmount = current + amount;
    localStorage.setItem(key, newAmount.toString());
    console.log(`✅ Đã thêm ${amount} ⭐ (từ ${current} → ${newAmount})`);
    return newAmount;
}

// Helper: Thêm coins để test
function addTestCoins(amount, grade = 2) {
    const key = `user_coins_grade_${grade}`;
    const current = parseInt(localStorage.getItem(key) || '100', 10);
    const newAmount = current + amount;
    localStorage.setItem(key, newAmount.toString());
    console.log(`✅ Đã thêm ${amount} 🪙 (từ ${current} → ${newAmount})`);
    return newAmount;
}

// Helper: Kiểm tra trạng thái hệ thống
function checkSystemState(grade = 2, userId = 'guest') {
    const starsKey = `user_stars_grade_${grade}`;
    const coinsKey = `user_coins_grade_${grade}`;
    const petsKey = `user_spirit_pets_${userId}_grade_${grade}`;
    const itemsKey = `album_owned_items_${userId}`;
    
    const stars = parseInt(localStorage.getItem(starsKey) || '0', 10);
    const coins = parseInt(localStorage.getItem(coinsKey) || '100', 10);
    const pets = JSON.parse(localStorage.getItem(petsKey) || '[]');
    const items = JSON.parse(localStorage.getItem(itemsKey) || '[]');
    
    console.log('\n📊 Trạng thái hệ thống:');
    console.log(`   ⭐ Stars lớp ${grade}: ${stars}`);
    console.log(`   🪙 Coins lớp ${grade}: ${coins}`);
    console.log(`   🐉 Linh vật đã unlock: ${pets.length}`);
    pets.forEach(pet => {
        console.log(`      - ${pet.spiritPet?.baseNameVi || pet.spiritPetId} (Level ${pet.currentLevel})`);
    });
    console.log(`   📦 Vật phẩm đã mua: ${items.length}`);
    items.forEach(itemId => {
        console.log(`      - ${itemId}`);
    });
    
    return { stars, coins, pets, items };
}

// Helper: Test unlock linh vật
function testUnlockPet(petCode, grade = 2, userId = 'guest') {
    console.log(`\n🔓 Test unlock linh vật: ${petCode}`);
    
    // Get current state
    const starsKey = `user_stars_grade_${grade}`;
    const petsKey = `user_spirit_pets_${userId}_grade_${grade}`;
    
    const stars = parseInt(localStorage.getItem(starsKey) || '0', 10);
    const pets = JSON.parse(localStorage.getItem(petsKey) || '[]');
    
    // Find pet from spirit-pets.json
    fetch('/data/spirit-pets.json')
        .then(res => res.json())
        .then(data => {
            const pet = data.pets.find(p => p.code === petCode);
            if (!pet) {
                console.error(`❌ Không tìm thấy linh vật với code: ${petCode}`);
                return;
            }
            
            const unlockCost = pet.levels[0]?.unlock_cost?.STAR || 50;
            
            // Check if already unlocked
            const existing = pets.find(p => p.spiritPetId === pet.id);
            if (existing) {
                console.log(`⚠️  ${pet.baseNameVi} đã được mở khóa rồi!`);
                return;
            }
            
            // Check if enough stars
            if (stars < unlockCost) {
                console.log(`❌ Không đủ sao! Cần ${unlockCost}, có ${stars}`);
                console.log(`💡 Gợi ý: Chạy addTestStars(${unlockCost - stars}, ${grade}) để thêm sao`);
                return;
            }
            
            // Unlock pet
            const newStars = stars - unlockCost;
            localStorage.setItem(starsKey, newStars.toString());
            
            const newUserPet = {
                id: `user-pet-${pet.id}-${Date.now()}`,
                userId: userId,
                spiritPetId: pet.id,
                currentLevel: 1,
                isActive: false,
                unlockedAt: new Date().toISOString(),
                spiritPet: pet,
            };
            
            const updatedPets = [...pets, newUserPet];
            localStorage.setItem(petsKey, JSON.stringify(updatedPets));
            
            console.log(`✅ Đã unlock ${pet.baseNameVi}!`);
            console.log(`   - Stars: ${stars} → ${newStars} (trừ ${unlockCost})`);
            console.log(`   - Pets: ${pets.length} → ${updatedPets.length}`);
            
            // Reload page to see changes
            console.log(`\n💡 Reload trang Album để xem thay đổi!`);
        })
        .catch(err => {
            console.error('❌ Lỗi khi load spirit-pets.json:', err);
        });
}

// Helper: Test mua vật phẩm
function testPurchaseItem(itemId, grade = 2, userId = 'guest') {
    console.log(`\n🛒 Test mua vật phẩm: ${itemId}`);
    
    // Get current state
    const coinsKey = `user_coins_grade_${grade}`;
    const itemsKey = `album_owned_items_${userId}`;
    
    const coins = parseInt(localStorage.getItem(coinsKey) || '100', 10);
    const items = JSON.parse(localStorage.getItem(itemsKey) || '[]');
    
    // Find item from album-items.json
    fetch('/data/album-items.json')
        .then(res => res.json())
        .then(data => {
            const item = data.items.find(i => i.id === itemId);
            if (!item) {
                console.error(`❌ Không tìm thấy vật phẩm với id: ${itemId}`);
                return;
            }
            
            // Check if already owned
            if (items.includes(itemId)) {
                console.log(`⚠️  ${item.name} đã được sở hữu rồi!`);
                return;
            }
            
            // Check if enough coins
            if (coins < item.price) {
                console.log(`❌ Không đủ coins! Cần ${item.price}, có ${coins}`);
                console.log(`💡 Gợi ý: Chạy addTestCoins(${item.price - coins}, ${grade}) để thêm coins`);
                return;
            }
            
            // Purchase item
            const newCoins = coins - item.price;
            localStorage.setItem(coinsKey, newCoins.toString());
            
            const updatedItems = [...items, itemId];
            localStorage.setItem(itemsKey, JSON.stringify(updatedItems));
            
            console.log(`✅ Đã mua ${item.name}!`);
            console.log(`   - Coins: ${coins} → ${newCoins} (trừ ${item.price})`);
            console.log(`   - Items: ${items.length} → ${updatedItems.length}`);
            
            // Reload page to see changes
            console.log(`\n💡 Reload trang Album để xem thay đổi!`);
        })
        .catch(err => {
            console.error('❌ Lỗi khi load album-items.json:', err);
        });
}

// Helper: Reset test data
function resetTestData(grade = 2, userId = 'guest') {
    if (!confirm('Bạn có chắc muốn reset tất cả dữ liệu test?')) {
        return;
    }
    
    const starsKey = `user_stars_grade_${grade}`;
    const coinsKey = `user_coins_grade_${grade}`;
    const petsKey = `user_spirit_pets_${userId}_grade_${grade}`;
    const itemsKey = `album_owned_items_${userId}`;
    
    localStorage.removeItem(starsKey);
    localStorage.removeItem(coinsKey);
    localStorage.removeItem(petsKey);
    localStorage.removeItem(itemsKey);
    
    console.log('✅ Đã reset dữ liệu test!');
    console.log('💡 Reload trang để xem thay đổi!');
}

// Main test function
function testRewardSystem() {
    console.log('\n🧪 BẮT ĐẦU TEST HỆ THỐNG THƯỞNG, SAO, MỞ KHÓA');
    console.log('='.repeat(60));
    
    // Check initial state
    console.log('\n📊 1. Kiểm tra trạng thái ban đầu:');
    const initialState = checkSystemState();
    
    // Add test stars
    console.log('\n⭐ 2. Thêm sao để test:');
    addTestStars(200, 2);
    
    // Add test coins
    console.log('\n🪙 3. Thêm coins để test:');
    addTestCoins(500, 2);
    
    // Check state after adding
    console.log('\n📊 4. Trạng thái sau khi thêm:');
    checkSystemState();
    
    // Test unlock pet
    console.log('\n🐉 5. Test unlock linh vật:');
    testUnlockPet('FLARE', 2, 'guest');
    
    // Wait a bit then check
    setTimeout(() => {
        console.log('\n📊 6. Trạng thái sau khi unlock:');
        checkSystemState();
        
        console.log('\n✅ TEST HOÀN TẤT!');
        console.log('\n💡 Các lệnh hữu ích:');
        console.log('   - addTestStars(amount, grade) - Thêm sao');
        console.log('   - addTestCoins(amount, grade) - Thêm coins');
        console.log('   - testUnlockPet(petCode, grade, userId) - Test unlock linh vật');
        console.log('   - testPurchaseItem(itemId, grade, userId) - Test mua vật phẩm');
        console.log('   - checkSystemState(grade, userId) - Kiểm tra trạng thái');
        console.log('   - resetTestData(grade, userId) - Reset dữ liệu test');
    }, 1000);
}

// Export functions to window
if (typeof window !== 'undefined') {
    window.addTestStars = addTestStars;
    window.addTestCoins = addTestCoins;
    window.testUnlockPet = testUnlockPet;
    window.testPurchaseItem = testPurchaseItem;
    window.checkSystemState = checkSystemState;
    window.resetTestData = resetTestData;
    window.testRewardSystem = testRewardSystem;
    
    console.log('✅ Test functions đã được load!');
    console.log('💡 Chạy testRewardSystem() để bắt đầu test');
}

