"""Import explicitly reviewed records (no auto-approval from discovery)."""
import argparse
from core import DATA, load, save, upsert

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--input",required=True)
    args=p.parse_args()
    entries=load(args.input)
    if isinstance(entries,dict):entries=[entries]
    if not isinstance(entries,list):raise ValueError("Input must be JSON object or array")
    current=load(DATA/"projects.json",[])
    updated=upsert(current,entries)
    save(DATA/"projects.json",updated)
    print(f"Stored {len(entries)} reviewed inputs; {len(updated)} total entries")

if __name__=="__main__":main()
