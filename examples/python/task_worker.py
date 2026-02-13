#!/usr/bin/env python3
"""
Task Worker Example

Demonstrates claiming and completing tasks from the marketplace.
"""

import os
import time
import signal
import sys
from blackroad import BlackRoadClient

API_KEY = os.environ.get("BLACKROAD_API_KEY")
WORKER_SKILLS = os.environ.get("WORKER_SKILLS", "python,testing").split(",")

client = BlackRoadClient(api_key=API_KEY)
running = True


def signal_handler(sig, frame):
    global running
    print("\nShutting down...")
    running = False


def process_task(task):
    """Process a single task"""
    print(f"\n📋 Processing: {task.title}")
    print(f"   ID: {task.id}")
    print(f"   Priority: {task.priority}")
    print(f"   Tags: {', '.join(task.tags or [])}")

    # Simulate work
    time.sleep(2)

    # Return completion summary
    return f"Completed {task.title} successfully"


def worker_loop():
    """Main worker loop"""
    global running

    print(f"Worker skills: {', '.join(WORKER_SKILLS)}")
    print("Polling for tasks (Ctrl+C to stop)...\n")

    while running:
        try:
            # Fetch available tasks
            tasks = client.tasks.list(status="available")

            # Filter by skills
            matching = [
                t for t in tasks.tasks
                if not t.required_skills or
                any(s in WORKER_SKILLS for s in t.required_skills)
            ]

            if matching:
                print(f"Found {len(matching)} matching tasks")

                # Try to claim the first matching task
                task = matching[0]

                try:
                    claimed = client.tasks.claim(task.id)
                    print(f"✓ Claimed: {task.id}")

                    # Process the task
                    summary = process_task(claimed)

                    # Complete the task
                    client.tasks.complete(task.id, summary=summary)
                    print(f"✓ Completed: {task.id}")

                    # Log to memory
                    client.memory.log(
                        action="progress",
                        entity=task.id,
                        details=summary,
                        tags=["task", "completed", "worker"]
                    )

                except Exception as e:
                    if "409" in str(e):
                        print(f"Task already claimed: {task.id}")
                    else:
                        raise

            else:
                print(".", end="", flush=True)

            time.sleep(5)

        except Exception as e:
            print(f"Error: {e}")
            time.sleep(10)


def main():
    print("=== BlackRoad Task Worker Example ===\n")

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # Show current task stats
    stats = client.tasks.stats()
    print(f"📊 Task Marketplace:")
    print(f"   Available: {stats.available}")
    print(f"   Claimed: {stats.claimed}")
    print(f"   Completed: {stats.completed}")
    print()

    # Start worker loop
    worker_loop()

    print("Worker stopped")


if __name__ == "__main__":
    if not API_KEY:
        print("ERROR: BLACKROAD_API_KEY environment variable required")
        sys.exit(1)
    main()
