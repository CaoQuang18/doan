# -*- coding: utf-8 -*-
"""
Test script for AI backend error handling
Run this after starting the AI backend server
"""

import requests
import json

BASE_URL = "http://localhost:5001"

def test_chat(message, description):
    """Test chat endpoint with a message"""
    print(f"\n{'='*60}")
    print(f"TEST: {description}")
    print(f"Input: {message}")
    print(f"{'='*60}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/chat",
            json={"message": message, "user_id": "test_user"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Response: {data.get('response', 'N/A')}")
        print(f"Success: {data.get('success', 'N/A')}")
        print(f"Error: {data.get('error', 'None')}")
        print(f"Intent: {data.get('intent', 'N/A')}")
        print(f"Confidence: {data.get('confidence', 0):.2f}")
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"❌ Request Error: {str(e)}")
        return None
    except json.JSONDecodeError as e:
        print(f"❌ JSON Decode Error: {str(e)}")
        return None

def run_tests():
    """Run all error handling tests"""
    print("\n" + "="*60)
    print("🧪 AI BACKEND ERROR HANDLING TESTS")
    print("="*60)
    
    # Test 1: Empty input
    test_chat("", "Empty input")
    
    # Test 2: Very long input
    test_chat("a" * 600, "Input quá dài (>500 ký tự)")
    
    # Test 3: XSS attempt
    test_chat("<script>alert('xss')</script>", "XSS injection attempt")
    
    # Test 4: SQL injection attempt
    test_chat("'; DROP TABLE users; --", "SQL injection attempt")
    
    # Test 5: Random gibberish
    test_chat("asdfghjkl qwertyuiop zxcvbnm", "Random gibberish")
    
    # Test 6: Special characters only
    test_chat("!@#$%^&*()", "Special characters only")
    
    # Test 7: Numbers only
    test_chat("123456789", "Numbers only")
    
    # Test 8: Mixed invalid content
    test_chat("javascript:void(0)", "JavaScript injection")
    
    # Test 9: Very short but valid
    test_chat("hi", "Valid short input")
    
    # Test 10: Valid Vietnamese query
    test_chat("Tìm apartment 2 phòng ngủ ở Canada", "Valid Vietnamese query")
    
    # Test 11: Invalid JSON (test directly)
    print(f"\n{'='*60}")
    print(f"TEST: Invalid JSON request")
    print(f"{'='*60}")
    try:
        response = requests.post(
            f"{BASE_URL}/chat",
            data="not json",
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {str(e)}")
    
    # Test 12: Missing message field
    print(f"\n{'='*60}")
    print(f"TEST: Missing message field")
    print(f"{'='*60}")
    try:
        response = requests.post(
            f"{BASE_URL}/chat",
            json={"user_id": "test"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Response: {data.get('response', 'N/A')}")
        print(f"Error: {data.get('error', 'None')}")
    except Exception as e:
        print(f"Error: {str(e)}")
    
    # Test 13: Health check
    print(f"\n{'='*60}")
    print(f"TEST: Health check endpoint")
    print(f"{'='*60}")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {str(e)}")
    
    # Test 14: Invalid endpoint
    print(f"\n{'='*60}")
    print(f"TEST: Invalid endpoint (404)")
    print(f"{'='*60}")
    try:
        response = requests.get(f"{BASE_URL}/invalid", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {str(e)}")
    
    # Test 15: Wrong HTTP method
    print(f"\n{'='*60}")
    print(f"TEST: Wrong HTTP method (GET instead of POST)")
    print(f"{'='*60}")
    try:
        response = requests.get(f"{BASE_URL}/chat", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {str(e)}")
    
    print("\n" + "="*60)
    print("✅ ALL TESTS COMPLETED")
    print("="*60)

if __name__ == "__main__":
    print("⚠️  Make sure AI backend is running on http://localhost:5001")
    input("Press Enter to start tests...")
    run_tests()
