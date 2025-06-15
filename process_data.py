import os
import yaml
from pathlib import Path
from collections import defaultdict
import urllib.parse

def generate_osm_key(tag_list):
    """Converts a list of {'key': ..., 'value': ...} dicts into a sorted tuple of key-value pairs."""
    return tuple(sorted((tag['key'], tag['value']) for tag in tag_list))

def build_overpass_query(tags):
    """Build Overpass 'and' query from tag list and return a full URL-encoded Overpass API URL."""
    # Build the inner part of the Overpass query (e.g., node["key"="value"]["key2"="value2"];)
    tag_query = "".join(f'["{tag["key"]}"="{tag["value"]}"]' for tag in tags)
    
    # Full Overpass QL query
    query = f'[out:json][timeout:25];node{tag_query};out geom;'

    # URL-encode and insert into full Overpass API URL
    encoded_query = urllib.parse.quote(query)
    full_url = f'https://overpass-api.de/api/interpreter?data={encoded_query}'

    return full_url

def find_yml_files(root_folder):
    return list(Path(root_folder).rglob("*.yml"))

aquire_dict = {}
entitlements_dict = {}

for yml_file in find_yml_files('./data'):
    with open(yml_file, 'r', encoding='utf-8') as f:
        try:
            content = yaml.safe_load(f)
        except yaml.YAMLError as e:
            print(f"Failed to parse {yml_file}: {e}")
            continue

        tickets = content.get('tickets', [])
        for ticket in tickets:
            # Process 'aquire' section
            for aquire in ticket.get('aquire', []):
                tags = aquire.get('osm_tags')
                if tags:
                    key = generate_osm_key(tags)
                    aquire_dict[key] = {
                        'name': aquire.get('name'),
                        'type': aquire.get('type'),
                        'region': aquire.get('region'),
                        'overpass_query': build_overpass_query(tags)
                    }

            # Process 'entitlements' section
            for ent in ticket.get('entitlements', []):
                tags = ent.get('osm_tags')
                if tags:
                    key = generate_osm_key(tags)
                    entitlements_dict[key] = {
                        'type': ent.get('type'),
                        'overpass_query': build_overpass_query(tags)
                    }

# Example output
print("\n--- Aquire Locations ---")
for k, v in aquire_dict.items():
    print(f"{k}: {v}")

print("\n--- Entitlements ---")
for k, v in entitlements_dict.items():
    print(f"{k}: {v}")
