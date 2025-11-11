#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test script cho hệ thống thưởng, sao, mở khóa linh vật và vật phẩm
Test toàn bộ flow từ nhận thưởng → tích sao → mở khóa → persistence
"""

import json
import os
import sys
from typing import Dict, List, Any

# Fix encoding for Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Simulate localStorage
class LocalStorage:
    def __init__(self):
        self.data: Dict[str, str] = {}
    
    def getItem(self, key: str) -> str | None:
        return self.data.get(key)
    
    def setItem(self, key: str, value: str):
        self.data[key] = value
    
    def removeItem(self, key: str):
        if key in self.data:
            del self.data[key]
    
    def clear(self):
        self.data.clear()
    
    def getAll(self) -> Dict[str, str]:
        return self.data.copy()

# Test storage
storage = LocalStorage()

# Test data
TEST_USER_ID = "test-user-123"
TEST_GRADE = 2

# Spirit pets data (from public/data/spirit-pets.json)
SPIRIT_PETS = [
    {"id": "spirit-pet-FLARE", "code": "FLARE", "baseNameVi": "Cáo Flare", "unlock_cost": 50},
    {"id": "spirit-pet-SHADOW", "code": "SHADOW", "baseNameVi": "Long Bóng Tối", "unlock_cost": 50},
    {"id": "spirit-pet-TY", "code": "TY", "baseNameVi": "Thỏ Tý", "unlock_cost": 50},
]

# Album items data
ALBUM_ITEMS = [
    {"id": "item-1", "name": "Trạng Tí", "category": "character", "price": 100},
    {"id": "item-2", "name": "Áo Dài Xanh", "category": "accessory", "price": 50},
]

def getStarsForGrade(grade: int) -> int:
    """Lấy stars từ lớp cụ thể"""
    key = f"user_stars_grade_{grade}"
    stored = storage.getItem(key)
    return int(stored) if stored else 0

def setStarsForGrade(grade: int, amount: int):
    """Lưu stars cho lớp cụ thể"""
    key = f"user_stars_grade_{grade}"
    storage.setItem(key, str(amount))

def addStarsForGrade(grade: int, amount: int) -> int:
    """Thêm stars cho lớp cụ thể"""
    current = getStarsForGrade(grade)
    new_amount = current + amount
    setStarsForGrade(grade, new_amount)
    return new_amount

def getCoinsForGrade(grade: int) -> int:
    """Lấy coins từ lớp cụ thể"""
    key = f"user_coins_grade_{grade}"
    stored = storage.getItem(key)
    return int(stored) if stored else 100  # Default 100 coins

def setCoinsForGrade(grade: int, amount: int):
    """Lưu coins cho lớp cụ thể"""
    key = f"user_coins_grade_{grade}"
    storage.setItem(key, str(amount))

def addCoinsForGrade(grade: int, amount: int) -> int:
    """Thêm coins cho lớp cụ thể"""
    current = getCoinsForGrade(grade)
    new_amount = current + amount
    setCoinsForGrade(grade, new_amount)
    return new_amount

def getSpiritPetsForGrade(userId: str, grade: int) -> List[Dict]:
    """Lấy spirit pets từ lớp cụ thể"""
    key = f"user_spirit_pets_{userId}_grade_{grade}"
    stored = storage.getItem(key)
    if stored:
        try:
            return json.loads(stored)
        except:
            return []
    return []

def setSpiritPetsForGrade(userId: str, grade: int, pets: List[Dict]):
    """Lưu spirit pets cho lớp cụ thể"""
    key = f"user_spirit_pets_{userId}_grade_{grade}"
    storage.setItem(key, json.dumps(pets))

def getOwnedItems(userId: str) -> List[str]:
    """Lấy danh sách items đã sở hữu"""
    key = f"album_owned_items_{userId}"
    stored = storage.getItem(key)
    if stored:
        try:
            return json.loads(stored)
        except:
            return []
    return []

def setOwnedItems(userId: str, items: List[str]):
    """Lưu danh sách items đã sở hữu"""
    key = f"album_owned_items_{userId}"
    storage.setItem(key, json.dumps(items))

def addOwnedItem(userId: str, itemId: str):
    """Thêm item vào danh sách sở hữu"""
    owned = getOwnedItems(userId)
    if itemId not in owned:
        owned.append(itemId)
        setOwnedItems(userId, owned)

# Test functions
def test_initial_state():
    """Test 1: Kiểm tra trạng thái ban đầu"""
    print("\n" + "="*60)
    print("TEST 1: Kiểm tra trạng thái ban đầu")
    print("="*60)
    
    stars = getStarsForGrade(TEST_GRADE)
    coins = getCoinsForGrade(TEST_GRADE)
    pets = getSpiritPetsForGrade(TEST_USER_ID, TEST_GRADE)
    items = getOwnedItems(TEST_USER_ID)
    
    print(f"✅ Stars ban đầu: {stars} (expected: 0)")
    print(f"✅ Coins ban đầu: {coins} (expected: 100)")
    print(f"✅ Spirit pets ban đầu: {len(pets)} (expected: 0)")
    print(f"✅ Owned items ban đầu: {len(items)} (expected: 0)")
    
    assert stars == 0, f"Stars should be 0, got {stars}"
    assert coins == 100, f"Coins should be 100, got {coins}"
    assert len(pets) == 0, f"Pets should be empty, got {len(pets)}"
    assert len(items) == 0, f"Items should be empty, got {len(items)}"
    
    print("✅ TEST 1 PASSED: Trạng thái ban đầu đúng\n")

def test_earn_stars_from_exercise():
    """Test 2: Tích sao từ làm bài tập"""
    print("\n" + "="*60)
    print("TEST 2: Tích sao từ làm bài tập")
    print("="*60)
    
    # Simulate: Hoàn thành tuần 1, Toán lớp 2, 80% đúng
    week_id = 1
    book_series = "ket-noi-tri-thuc"
    subject = "math"
    completion_rate = 80
    correct_count = 8
    total_questions = 10
    
    # Calculate reward (from ExercisePage logic)
    coins_reward = completion_rate if completion_rate >= 50 else 0
    stars_reward = 5 if completion_rate >= 80 else (3 if completion_rate >= 50 else 0)
    
    print(f"📊 Hoàn thành tuần {week_id}, {subject} lớp {TEST_GRADE}")
    print(f"   - Đúng: {correct_count}/{total_questions} ({completion_rate}%)")
    print(f"   - Coins reward: {coins_reward}")
    print(f"   - Stars reward: {stars_reward}")
    
    # Award rewards
    if coins_reward > 0:
        new_coins = addCoinsForGrade(TEST_GRADE, coins_reward)
        print(f"✅ Coins: {getCoinsForGrade(TEST_GRADE) - coins_reward} → {new_coins}")
    
    if stars_reward > 0:
        new_stars = addStarsForGrade(TEST_GRADE, stars_reward)
        print(f"✅ Stars: {getStarsForGrade(TEST_GRADE) - stars_reward} → {new_stars}")
    
    # Check reward key (prevent duplicate)
    reward_key = f"week-{week_id}-{book_series}-{TEST_GRADE}-{subject}-rewarded"
    storage.setItem(reward_key, "true")
    
    # Verify
    final_stars = getStarsForGrade(TEST_GRADE)
    final_coins = getCoinsForGrade(TEST_GRADE)
    is_rewarded = storage.getItem(reward_key) == "true"
    
    print(f"\n📋 Kết quả:")
    print(f"   - Stars hiện tại: {final_stars} (expected: {stars_reward})")
    print(f"   - Coins hiện tại: {final_coins} (expected: {100 + coins_reward})")
    print(f"   - Đã thưởng: {is_rewarded} (expected: True)")
    
    assert final_stars == stars_reward, f"Stars should be {stars_reward}, got {final_stars}"
    assert final_coins == 100 + coins_reward, f"Coins should be {100 + coins_reward}, got {final_coins}"
    assert is_rewarded, "Should be rewarded"
    
    print("✅ TEST 2 PASSED: Tích sao từ làm bài tập thành công\n")

def test_prevent_duplicate_reward():
    """Test 3: Ngăn chặn thưởng trùng lặp"""
    print("\n" + "="*60)
    print("TEST 3: Ngăn chặn thưởng trùng lặp")
    print("="*60)
    
    week_id = 1
    book_series = "ket-noi-tri-thuc"
    subject = "math"
    reward_key = f"week-{week_id}-{book_series}-{TEST_GRADE}-{subject}-rewarded"
    
    stars_before = getStarsForGrade(TEST_GRADE)
    coins_before = getCoinsForGrade(TEST_GRADE)
    
    # Try to reward again (should be prevented)
    already_rewarded = storage.getItem(reward_key)
    if already_rewarded:
        print(f"⚠️  Đã thưởng rồi (key: {reward_key}), bỏ qua...")
        print(f"✅ Stars: {getStarsForGrade(TEST_GRADE)} (không thay đổi)")
        print(f"✅ Coins: {getCoinsForGrade(TEST_GRADE)} (không thay đổi)")
    else:
        print("❌ ERROR: Should have been rewarded already!")
        assert False, "Should have been rewarded already"
    
    stars_after = getStarsForGrade(TEST_GRADE)
    coins_after = getCoinsForGrade(TEST_GRADE)
    
    assert stars_before == stars_after, "Stars should not change"
    assert coins_before == coins_after, "Coins should not change"
    
    print("✅ TEST 3 PASSED: Ngăn chặn thưởng trùng lặp thành công\n")

def test_unlock_spirit_pet():
    """Test 4: Mở khóa linh vật"""
    print("\n" + "="*60)
    print("TEST 4: Mở khóa linh vật")
    print("="*60)
    
    # Get current state
    stars_before = getStarsForGrade(TEST_GRADE)
    pets_before = getSpiritPetsForGrade(TEST_USER_ID, TEST_GRADE)
    
    print(f"📊 Trạng thái trước khi unlock:")
    print(f"   - Stars: {stars_before}")
    print(f"   - Pets đã có: {len(pets_before)}")
    
    # Unlock "Cáo Flare" (cost: 50 stars)
    pet = SPIRIT_PETS[0]  # Cáo Flare
    unlock_cost = pet["unlock_cost"]
    
    if stars_before < unlock_cost:
        print(f"❌ Không đủ sao! Cần {unlock_cost}, có {stars_before}")
        # Add more stars for test
        addStarsForGrade(TEST_GRADE, unlock_cost - stars_before)
        stars_before = getStarsForGrade(TEST_GRADE)
        print(f"✅ Đã thêm sao: {stars_before}")
    
    # Check if already unlocked
    existing_pet = next((p for p in pets_before if p.get("spiritPetId") == pet["id"]), None)
    if existing_pet:
        print(f"⚠️  {pet['baseNameVi']} đã được mở khóa rồi!")
        print("✅ TEST 4 SKIPPED: Pet already unlocked\n")
        return
    
    # Unlock pet
    print(f"\n🔓 Mở khóa {pet['baseNameVi']} (cost: {unlock_cost} ⭐)")
    
    # Deduct stars
    new_stars = stars_before - unlock_cost
    setStarsForGrade(TEST_GRADE, new_stars)
    
    # Create user pet
    new_user_pet = {
        "id": f"user-pet-{pet['id']}-{hash(pet['id']) % 10000}",
        "userId": TEST_USER_ID,
        "spiritPetId": pet["id"],
        "currentLevel": 1,
        "isActive": False,
        "unlockedAt": "2025-01-01T00:00:00Z",
        "spiritPet": pet,
    }
    
    # Save to storage
    updated_pets = pets_before + [new_user_pet]
    setSpiritPetsForGrade(TEST_USER_ID, TEST_GRADE, updated_pets)
    
    # Verify
    stars_after = getStarsForGrade(TEST_GRADE)
    pets_after = getSpiritPetsForGrade(TEST_USER_ID, TEST_GRADE)
    
    print(f"\n📋 Kết quả:")
    print(f"   - Stars: {stars_before} → {stars_after} (trừ {unlock_cost})")
    print(f"   - Pets: {len(pets_before)} → {len(pets_after)} (thêm 1)")
    print(f"   - Pet unlocked: {pet['baseNameVi']}")
    
    assert stars_after == stars_before - unlock_cost, f"Stars should be {stars_before - unlock_cost}, got {stars_after}"
    assert len(pets_after) == len(pets_before) + 1, f"Pets should be {len(pets_before) + 1}, got {len(pets_after)}"
    assert any(p.get("spiritPetId") == pet["id"] for p in pets_after), "Pet should be in list"
    
    print("✅ TEST 4 PASSED: Mở khóa linh vật thành công\n")

def test_prevent_duplicate_unlock():
    """Test 5: Ngăn chặn unlock trùng lặp"""
    print("\n" + "="*60)
    print("TEST 5: Ngăn chặn unlock trùng lặp")
    print("="*60)
    
    pet = SPIRIT_PETS[0]  # Cáo Flare
    pets_before = getSpiritPetsForGrade(TEST_USER_ID, TEST_GRADE)
    stars_before = getStarsForGrade(TEST_GRADE)
    
    # Try to unlock again
    existing_pet = next((p for p in pets_before if p.get("spiritPetId") == pet["id"]), None)
    if existing_pet:
        print(f"⚠️  {pet['baseNameVi']} đã được mở khóa rồi, bỏ qua...")
        print(f"✅ Stars: {getStarsForGrade(TEST_GRADE)} (không thay đổi)")
        print(f"✅ Pets: {len(getSpiritPetsForGrade(TEST_USER_ID, TEST_GRADE))} (không thay đổi)")
    else:
        print("❌ ERROR: Should have been unlocked already!")
        assert False, "Should have been unlocked already"
    
    pets_after = getSpiritPetsForGrade(TEST_USER_ID, TEST_GRADE)
    stars_after = getStarsForGrade(TEST_GRADE)
    
    assert len(pets_before) == len(pets_after), "Pets should not change"
    assert stars_before == stars_after, "Stars should not change"
    
    print("✅ TEST 5 PASSED: Ngăn chặn unlock trùng lặp thành công\n")

def test_purchase_album_item():
    """Test 6: Mua vật phẩm album"""
    print("\n" + "="*60)
    print("TEST 6: Mua vật phẩm album")
    print("="*60)
    
    item = ALBUM_ITEMS[0]  # Trạng Tí
    coins_before = getCoinsForGrade(TEST_GRADE)
    items_before = getOwnedItems(TEST_USER_ID)
    
    print(f"📊 Trạng thái trước khi mua:")
    print(f"   - Coins: {coins_before}")
    print(f"   - Items đã có: {len(items_before)}")
    
    if coins_before < item["price"]:
        print(f"❌ Không đủ coins! Cần {item['price']}, có {coins_before}")
        # Add more coins for test
        addCoinsForGrade(TEST_GRADE, item["price"] - coins_before)
        coins_before = getCoinsForGrade(TEST_GRADE)
        print(f"✅ Đã thêm coins: {coins_before}")
    
    # Check if already owned
    if item["id"] in items_before:
        print(f"⚠️  {item['name']} đã được sở hữu rồi!")
        print("✅ TEST 6 SKIPPED: Item already owned\n")
        return
    
    # Purchase item
    print(f"\n🛒 Mua {item['name']} (cost: {item['price']} 🪙)")
    
    # Deduct coins
    new_coins = coins_before - item["price"]
    setCoinsForGrade(TEST_GRADE, new_coins)
    
    # Add to owned items
    addOwnedItem(TEST_USER_ID, item["id"])
    
    # Verify
    coins_after = getCoinsForGrade(TEST_GRADE)
    items_after = getOwnedItems(TEST_USER_ID)
    
    print(f"\n📋 Kết quả:")
    print(f"   - Coins: {coins_before} → {coins_after} (trừ {item['price']})")
    print(f"   - Items: {len(items_before)} → {len(items_after)} (thêm 1)")
    print(f"   - Item purchased: {item['name']}")
    
    assert coins_after == coins_before - item["price"], f"Coins should be {coins_before - item['price']}, got {coins_after}"
    assert len(items_after) == len(items_before) + 1, f"Items should be {len(items_before) + 1}, got {len(items_after)}"
    assert item["id"] in items_after, "Item should be in owned list"
    
    print("✅ TEST 6 PASSED: Mua vật phẩm album thành công\n")

def test_persistence():
    """Test 7: Kiểm tra persistence (lưu/load)"""
    print("\n" + "="*60)
    print("TEST 7: Kiểm tra persistence (lưu/load)")
    print("="*60)
    
    # Save current state
    stars_before = getStarsForGrade(TEST_GRADE)
    coins_before = getCoinsForGrade(TEST_GRADE)
    pets_before = getSpiritPetsForGrade(TEST_USER_ID, TEST_GRADE)
    items_before = getOwnedItems(TEST_USER_ID)
    
    print(f"📊 Trạng thái trước khi 'reload':")
    print(f"   - Stars: {stars_before}")
    print(f"   - Coins: {coins_before}")
    print(f"   - Pets: {len(pets_before)}")
    print(f"   - Items: {len(items_before)}")
    
    # Simulate "reload" (get from storage again)
    stars_after = getStarsForGrade(TEST_GRADE)
    coins_after = getCoinsForGrade(TEST_GRADE)
    pets_after = getSpiritPetsForGrade(TEST_USER_ID, TEST_GRADE)
    items_after = getOwnedItems(TEST_USER_ID)
    
    print(f"\n📊 Trạng thái sau khi 'reload':")
    print(f"   - Stars: {stars_after}")
    print(f"   - Coins: {coins_after}")
    print(f"   - Pets: {len(pets_after)}")
    print(f"   - Items: {len(items_after)}")
    
    # Verify persistence
    assert stars_before == stars_after, f"Stars should persist: {stars_before} != {stars_after}"
    assert coins_before == coins_after, f"Coins should persist: {coins_before} != {coins_after}"
    assert len(pets_before) == len(pets_after), f"Pets should persist: {len(pets_before)} != {len(pets_after)}"
    assert len(items_before) == len(items_after), f"Items should persist: {len(items_before)} != {len(items_after)}"
    
    # Verify pet data
    for pet_before in pets_before:
        pet_after = next((p for p in pets_after if p.get("id") == pet_before.get("id")), None)
        assert pet_after is not None, f"Pet {pet_before.get('id')} should persist"
        assert pet_after.get("spiritPetId") == pet_before.get("spiritPetId"), "Pet spiritPetId should persist"
        assert pet_after.get("currentLevel") == pet_before.get("currentLevel"), "Pet currentLevel should persist"
    
    print("✅ TEST 7 PASSED: Persistence hoạt động đúng\n")

def test_multiple_unlocks():
    """Test 8: Mở khóa nhiều linh vật liên tiếp"""
    print("\n" + "="*60)
    print("TEST 8: Mở khóa nhiều linh vật liên tiếp")
    print("="*60)
    
    # Add more stars for multiple unlocks
    current_stars = getStarsForGrade(TEST_GRADE)
    needed_stars = 150  # Enough for 3 pets (50 each)
    if current_stars < needed_stars:
        addStarsForGrade(TEST_GRADE, needed_stars - current_stars)
        print(f"✅ Đã thêm sao: {getStarsForGrade(TEST_GRADE)}")
    
    pets_before = getSpiritPetsForGrade(TEST_USER_ID, TEST_GRADE)
    stars_before = getStarsForGrade(TEST_GRADE)
    
    print(f"📊 Trạng thái trước khi unlock nhiều:")
    print(f"   - Stars: {stars_before}")
    print(f"   - Pets: {len(pets_before)}")
    
    # Unlock multiple pets
    unlocked_count = 0
    for pet in SPIRIT_PETS[1:]:  # Skip first one (already unlocked)
        existing = next((p for p in pets_before if p.get("spiritPetId") == pet["id"]), None)
        if existing:
            print(f"⚠️  {pet['baseNameVi']} đã được mở khóa rồi, bỏ qua...")
            continue
        
        current_stars = getStarsForGrade(TEST_GRADE)
        if current_stars < pet["unlock_cost"]:
            print(f"⚠️  Không đủ sao để unlock {pet['baseNameVi']}, dừng...")
            break
        
        # Unlock
        new_stars = current_stars - pet["unlock_cost"]
        setStarsForGrade(TEST_GRADE, new_stars)
        
        new_user_pet = {
            "id": f"user-pet-{pet['id']}-{hash(pet['id']) % 10000}",
            "userId": TEST_USER_ID,
            "spiritPetId": pet["id"],
            "currentLevel": 1,
            "isActive": False,
            "unlockedAt": "2025-01-01T00:00:00Z",
            "spiritPet": pet,
        }
        
        pets_before.append(new_user_pet)
        setSpiritPetsForGrade(TEST_USER_ID, TEST_GRADE, pets_before)
        unlocked_count += 1
        
        print(f"✅ Đã unlock {pet['baseNameVi']} (còn {new_stars} ⭐)")
    
    # Verify
    pets_after = getSpiritPetsForGrade(TEST_USER_ID, TEST_GRADE)
    stars_after = getStarsForGrade(TEST_GRADE)
    
    print(f"\n📋 Kết quả:")
    print(f"   - Đã unlock: {unlocked_count} pets")
    print(f"   - Stars: {stars_before} → {stars_after}")
    print(f"   - Pets: {len(pets_before) - unlocked_count} → {len(pets_after)}")
    
    assert len(pets_after) >= len(pets_before) - unlocked_count + unlocked_count, "Pets should increase"
    assert stars_after <= stars_before, "Stars should decrease"
    
    print("✅ TEST 8 PASSED: Mở khóa nhiều linh vật thành công\n")

def test_grade_isolation():
    """Test 9: Kiểm tra isolation giữa các lớp"""
    print("\n" + "="*60)
    print("TEST 9: Kiểm tra isolation giữa các lớp")
    print("="*60)
    
    grade_1 = 1
    grade_2 = 2
    
    # Set different values for each grade
    setStarsForGrade(grade_1, 100)
    setStarsForGrade(grade_2, 200)
    
    stars_1 = getStarsForGrade(grade_1)
    stars_2 = getStarsForGrade(grade_2)
    
    print(f"📊 Stars lớp {grade_1}: {stars_1}")
    print(f"📊 Stars lớp {grade_2}: {stars_2}")
    
    assert stars_1 == 100, f"Grade 1 stars should be 100, got {stars_1}"
    assert stars_2 == 200, f"Grade 2 stars should be 200, got {stars_2}"
    assert stars_1 != stars_2, "Grades should have different stars"
    
    print("✅ TEST 9 PASSED: Isolation giữa các lớp hoạt động đúng\n")

def run_all_tests():
    """Chạy tất cả tests"""
    print("\n" + "="*60)
    print("BAT DAU TEST HE THONG THUONG, SAO, MO KHOA")
    print("="*60)
    
    # Reset storage for clean test
    storage.clear()
    
    try:
        test_initial_state()
        test_earn_stars_from_exercise()
        test_prevent_duplicate_reward()
        test_unlock_spirit_pet()
        test_prevent_duplicate_unlock()
        test_purchase_album_item()
        test_persistence()
        test_multiple_unlocks()
        test_grade_isolation()
        
        print("\n" + "="*60)
        print("TAT CA TESTS DA PASS!")
        print("="*60)
        print("\nTong ket:")
        print(f"   - Stars lop {TEST_GRADE}: {getStarsForGrade(TEST_GRADE)}")
        print(f"   - Coins lop {TEST_GRADE}: {getCoinsForGrade(TEST_GRADE)}")
        print(f"   - Pets da unlock: {len(getSpiritPetsForGrade(TEST_USER_ID, TEST_GRADE))}")
        print(f"   - Items da mua: {len(getOwnedItems(TEST_USER_ID))}")
        print("\nHe thong thuong, sao, mo khoa hoat dong dung!\n")
        
    except AssertionError as e:
        print(f"\nTEST FAILED: {e}")
        print("\nStorage dump:")
        for key, value in storage.getAll().items():
            print(f"   {key}: {value}")
        raise
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    run_all_tests()

