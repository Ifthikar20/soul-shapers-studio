#!/usr/bin/env python3
"""
Script to retrieve content UUIDs from the database
Usage: python3 get_content_uuids.py
"""

import os
import sys
from typing import List, Dict

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', '5432')),
    'database': os.getenv('DB_NAME', 'soul_shapers'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'postgres')
}

def get_content_uuids() -> List[Dict]:
    """Retrieve all content UUIDs from the database"""
    try:
        import psycopg2
    except ImportError:
        print("❌ Error: psycopg2 is not installed")
        print("Install it with: pip install psycopg2-binary")
        sys.exit(1)

    try:
        # Connect to database
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # Query for content UUIDs
        query = """
        SELECT
            id,
            title,
            content_type,
            access_tier,
            created_at
        FROM content
        ORDER BY created_at DESC;
        """

        cursor.execute(query)
        results = cursor.fetchall()

        if not results:
            print("⚠️  No content found in database")
            return []

        print(f"\n✅ Found {len(results)} content items:\n")
        print(f"{'UUID':<40} | {'Title':<30} | {'Type':<10} | {'Access':<10}")
        print("-" * 100)

        content_list = []
        for row in results:
            uuid, title, content_type, access_tier, created_at = row
            print(f"{uuid:<40} | {title[:30]:<30} | {content_type:<10} | {access_tier or 'N/A':<10}")
            content_list.append({
                'id': uuid,
                'title': title,
                'content_type': content_type,
                'access_tier': access_tier
            })

        # Show audio content specifically
        audio_content = [c for c in content_list if c['content_type'] == 'audio']
        if audio_content:
            print(f"\n🎵 Audio Content ({len(audio_content)} items):")
            print("-" * 100)
            for item in audio_content:
                print(f"  UUID: {item['id']}")
                print(f"  Title: {item['title']}")
                print(f"  Streaming URL: http://localhost:8000/api/streaming/content/{item['id']}/stream")
                print()

        cursor.close()
        conn.close()

        return content_list

    except psycopg2.Error as e:
        print(f"❌ Database error: {e}")
        print("\nTroubleshooting:")
        print("1. Check database connection settings in environment variables:")
        print(f"   DB_HOST={DB_CONFIG['host']}")
        print(f"   DB_PORT={DB_CONFIG['port']}")
        print(f"   DB_NAME={DB_CONFIG['database']}")
        print(f"   DB_USER={DB_CONFIG['user']}")
        print("2. Ensure PostgreSQL is running")
        print("3. Verify database credentials")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    print("🔍 Retrieving content UUIDs from database...")
    print(f"📍 Database: {DB_CONFIG['database']} at {DB_CONFIG['host']}:{DB_CONFIG['port']}\n")

    content_list = get_content_uuids()

    if content_list:
        print(f"\n✨ Total content items: {len(content_list)}")
        print("\n💡 To use these UUIDs in your application:")
        print("   1. Copy a UUID from the list above")
        print("   2. Use the streaming URL format: /api/streaming/content/{UUID}/stream")
        print("   3. Ensure your JWT token is included in the Authorization header")
