#!/usr/bin/env python3
"""
Codex Search Example

Demonstrates searching the BlackRoad Codex for code components.
"""

import os
import sys
from blackroad import BlackRoadClient

API_KEY = os.environ.get("BLACKROAD_API_KEY")
client = BlackRoadClient(api_key=API_KEY)


def search_and_display(query, **kwargs):
    """Search Codex and display results"""
    print(f"\n🔍 Searching: '{query}'")
    if kwargs:
        print(f"   Filters: {kwargs}")

    results = client.codex.search(query, **kwargs)

    if not results.components:
        print("   No results found")
        return

    print(f"   Found {len(results.components)} components ({results.took_ms}ms)\n")

    for comp in results.components[:10]:
        type_emoji = {
            "function": "ƒ",
            "class": "⬡",
            "module": "📦"
        }.get(comp.type, "•")

        print(f"   {type_emoji} {comp.name}")
        print(f"     {comp.file_path}:{comp.line_number}")
        print(f"     Language: {comp.language}")
        if comp.signature:
            print(f"     Signature: {comp.signature[:60]}...")
        print()


def main():
    print("=== BlackRoad Codex Search Example ===")

    # 1. Get Codex statistics
    print("\n📊 Codex Statistics:")
    stats = client.codex.stats()
    print(f"   Total components: {stats.total_components:,}")
    print(f"   Functions: {stats.by_type.get('functions', 0):,}")
    print(f"   Classes: {stats.by_type.get('classes', 0):,}")
    print(f"   Last indexed: {stats.last_indexed}")

    # 2. Basic search
    search_and_display("authentication middleware")

    # 3. Search by type
    search_and_display("database connection", type="class")

    # 4. Search by language
    search_and_display("api handler", language="python")

    # 5. Search functions only
    search_and_display("validate email", type="function")

    # 6. Interactive mode
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
        search_and_display(query)

    print("\n✓ Codex search complete!")
    print("\nTip: Run with arguments for custom search:")
    print("  python codex_search.py rate limiting")


if __name__ == "__main__":
    if not API_KEY:
        print("ERROR: BLACKROAD_API_KEY environment variable required")
        exit(1)
    main()
