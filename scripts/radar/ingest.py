"""Import manually reviewed JSON files; never turn discovery results into automatic approvals."""
import argparse
from core import DATA, load, save, upsert

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    args = parser.parse_args()
    entries = load(args.input)
    if isinstance(entries, dict):
        entries = [entries]
    if not isinstance(entries, list):
        raise ValueError("Input must be a JSON object or array")
    if not entries:
        print("No reviewed records in input")
        return
    # Validate all before any persistent write.
    current = load(DATA / "projects.json", [])
    updated = upsert(current, entries)
    save(DATA / "projects.json", updated)
    print(f"Imported {len(entries)} reviewed entries; database contains {len(updated)} items")

if __name__ == "__main__":
    main()
