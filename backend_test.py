#!/usr/bin/env python3
"""
Backend API Testing for Danny Gruchmann Portfolio
Tests the inquiries API endpoints as specified in the review request.
"""

import requests
import json
import uuid
from datetime import datetime
import sys
import os

# Get backend URL from frontend .env
BACKEND_URL = "https://gruchmann-labs.preview.emergentagent.com/api"

def test_root_endpoint():
    """Test GET /api/ - sanity check"""
    print("\n=== Testing GET /api/ (sanity check) ===")
    try:
        response = requests.get(f"{BACKEND_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and response.json() == {"message": "Hello World"}:
            print("✅ Root endpoint working correctly")
            return True
        else:
            print("❌ Root endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
        return False

def test_create_inquiry_valid():
    """Test POST /api/inquiries with valid data"""
    print("\n=== Testing POST /api/inquiries (valid data) ===")
    
    valid_payload = {
        "name": "Max Mustermann",
        "email": "max@example.com",
        "company": "ACME GmbH",
        "budget": "15–40k €",
        "message": "Wir brauchen einen neuen Online-Shop mit Headless-Architektur."
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/inquiries", json=valid_payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 201:
            data = response.json()
            
            # Verify all required fields are present
            required_fields = ["id", "name", "email", "company", "budget", "message", "createdAt"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                print(f"❌ Missing fields: {missing_fields}")
                return False, None
            
            # Verify id is a UUID string
            try:
                uuid.UUID(data["id"])
                print("✅ ID is valid UUID")
            except ValueError:
                print(f"❌ ID is not a valid UUID: {data['id']}")
                return False, None
            
            # Verify createdAt is ISO-8601 format
            try:
                datetime.fromisoformat(data["createdAt"].replace('Z', '+00:00'))
                print("✅ createdAt is valid ISO-8601")
            except ValueError:
                print(f"❌ createdAt is not valid ISO-8601: {data['createdAt']}")
                return False, None
            
            # Verify all submitted fields match
            for field in ["name", "email", "company", "budget", "message"]:
                if data[field] != valid_payload[field]:
                    print(f"❌ Field {field} mismatch: expected {valid_payload[field]}, got {data[field]}")
                    return False, None
            
            print("✅ Valid inquiry creation successful")
            return True, data["id"]
        else:
            print("❌ Expected 201 Created status")
            return False, None
            
    except Exception as e:
        print(f"❌ Create inquiry error: {e}")
        return False, None

def test_create_inquiry_validation_errors():
    """Test POST /api/inquiries validation errors"""
    print("\n=== Testing POST /api/inquiries (validation errors) ===")
    
    test_cases = [
        {
            "name": "Missing name",
            "payload": {
                "email": "test@example.com",
                "message": "Test message"
            },
            "expected_status": 422
        },
        {
            "name": "Invalid email",
            "payload": {
                "name": "Test User",
                "email": "not-an-email",
                "message": "Test message"
            },
            "expected_status": 422
        },
        {
            "name": "Empty message",
            "payload": {
                "name": "Test User",
                "email": "test@example.com",
                "message": ""
            },
            "expected_status": 422
        },
        {
            "name": "Whitespace only message",
            "payload": {
                "name": "Test User",
                "email": "test@example.com",
                "message": "   "
            },
            "expected_status": 422
        },
        {
            "name": "Missing all required",
            "payload": {},
            "expected_status": 422
        }
    ]
    
    all_passed = True
    
    for test_case in test_cases:
        print(f"\n--- Testing: {test_case['name']} ---")
        try:
            response = requests.post(f"{BACKEND_URL}/inquiries", json=test_case["payload"])
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == test_case["expected_status"]:
                print(f"✅ {test_case['name']} validation working correctly")
            else:
                print(f"❌ {test_case['name']} expected {test_case['expected_status']}, got {response.status_code}")
                all_passed = False
                
        except Exception as e:
            print(f"❌ {test_case['name']} error: {e}")
            all_passed = False
    
    return all_passed

def test_create_inquiry_minimal():
    """Test POST /api/inquiries with only required fields"""
    print("\n=== Testing POST /api/inquiries (minimal required fields) ===")
    
    minimal_payload = {
        "name": "Anna",
        "email": "anna@test.de",
        "message": "Hallo"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/inquiries", json=minimal_payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 201:
            data = response.json()
            
            # Verify required fields
            if data["name"] == "Anna" and data["email"] == "anna@test.de" and data["message"] == "Hallo":
                # Verify optional fields are empty strings
                if data["company"] == "" and data["budget"] == "":
                    print("✅ Minimal inquiry creation successful with empty strings for optional fields")
                    return True, data["id"]
                else:
                    print(f"❌ Optional fields not empty strings: company='{data['company']}', budget='{data['budget']}'")
                    return False, None
            else:
                print("❌ Required fields don't match")
                return False, None
        else:
            print("❌ Expected 201 Created status")
            return False, None
            
    except Exception as e:
        print(f"❌ Minimal inquiry creation error: {e}")
        return False, None

def test_list_inquiries():
    """Test GET /api/inquiries - list inquiries"""
    print("\n=== Testing GET /api/inquiries (list inquiries) ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/inquiries")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Number of inquiries: {len(data)}")
            
            if not isinstance(data, list):
                print("❌ Response is not a JSON array")
                return False
            
            if len(data) > 0:
                # Check first inquiry structure
                first_inquiry = data[0]
                required_fields = ["id", "name", "email", "company", "budget", "message", "createdAt"]
                missing_fields = [field for field in required_fields if field not in first_inquiry]
                
                if missing_fields:
                    print(f"❌ Missing fields in inquiry: {missing_fields}")
                    return False
                
                # Check if sorted by createdAt desc (newest first)
                if len(data) > 1:
                    first_time = datetime.fromisoformat(data[0]["createdAt"].replace('Z', '+00:00'))
                    second_time = datetime.fromisoformat(data[1]["createdAt"].replace('Z', '+00:00'))
                    
                    if first_time >= second_time:
                        print("✅ Inquiries sorted by createdAt desc (newest first)")
                    else:
                        print("❌ Inquiries not sorted correctly")
                        return False
                
                print("✅ List inquiries working correctly")
                return True
            else:
                print("✅ List inquiries working (empty list)")
                return True
        else:
            print("❌ Expected 200 OK status")
            return False
            
    except Exception as e:
        print(f"❌ List inquiries error: {e}")
        return False

def test_mongodb_persistence(created_ids):
    """Test MongoDB persistence by verifying created inquiries appear in list"""
    print("\n=== Testing MongoDB Persistence ===")
    
    if not created_ids:
        print("⚠️ No inquiries were created successfully, skipping persistence test")
        return True
    
    try:
        response = requests.get(f"{BACKEND_URL}/inquiries")
        if response.status_code == 200:
            inquiries = response.json()
            inquiry_ids = [inq["id"] for inq in inquiries]
            
            found_ids = []
            missing_ids = []
            
            for created_id in created_ids:
                if created_id in inquiry_ids:
                    found_ids.append(created_id)
                else:
                    missing_ids.append(created_id)
            
            if missing_ids:
                print(f"❌ Missing inquiries in database: {missing_ids}")
                return False
            else:
                print(f"✅ All created inquiries found in database: {found_ids}")
                return True
        else:
            print("❌ Could not retrieve inquiries for persistence test")
            return False
            
    except Exception as e:
        print(f"❌ Persistence test error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Danny Gruchmann Portfolio Backend API Tests")
    print(f"Backend URL: {BACKEND_URL}")
    
    results = {}
    created_inquiry_ids = []
    
    # Test 1: Root endpoint
    results["root_endpoint"] = test_root_endpoint()
    
    # Test 2: Create inquiry with valid data
    success, inquiry_id = test_create_inquiry_valid()
    results["create_inquiry_valid"] = success
    if inquiry_id:
        created_inquiry_ids.append(inquiry_id)
    
    # Test 3: Validation errors
    results["validation_errors"] = test_create_inquiry_validation_errors()
    
    # Test 4: Create inquiry with minimal fields
    success, inquiry_id = test_create_inquiry_minimal()
    results["create_inquiry_minimal"] = success
    if inquiry_id:
        created_inquiry_ids.append(inquiry_id)
    
    # Test 5: List inquiries
    results["list_inquiries"] = test_list_inquiries()
    
    # Test 6: MongoDB persistence
    results["mongodb_persistence"] = test_mongodb_persistence(created_inquiry_ids)
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())