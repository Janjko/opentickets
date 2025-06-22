import os
import yaml
from pathlib import Path
from collections import defaultdict
import urllib.parse
import requests
import json
from osm2geojson import json2geojson

def generate_osm_key(tag_list):
    """Converts a list of {'key': ..., 'value': ...} dicts into a sorted tuple of key-value pairs."""
    return tuple(sorted((tag['key'], tag['value']) for tag in tag_list))

def build_overpass_query(tags):
    """Build Overpass 'and' query from tag list and return a full URL-encoded Overpass API URL."""
    # Build the inner part of the Overpass query (e.g., node["key"="value"]["key2"="value2"];)
    tag_query = "".join(f'["{tag["key"]}"="{tag["value"]}"]' for tag in tags)
    area_id = get_area_id_from_nominatim("Croatia")
    # Full Overpass QL query
    query = f'[out:json][timeout:25];area(id:{area_id})->.searchArea;nwr{tag_query}(area.searchArea);out geom;'

    # URL-encode and insert into full Overpass API URL
    encoded_query = urllib.parse.quote(query)
    full_url = f'https://overpass-api.de/api/interpreter?data={encoded_query}'

    return full_url

def download_and_save_geojson(name, query_url, folder, filename):
    try:
        print(f"Downloading: {name}")
        response = requests.get(query_url)
        response.raise_for_status()
        overpass_data = response.json()

        geojson = json2geojson(overpass_data)

        os.makedirs(folder, exist_ok=True)
        filepath = os.path.join(folder, f"{filename}.geojson")
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(geojson, f, ensure_ascii=False, indent=2)
        print(f"Saved to {filepath}")

    except Exception as e:
        print(f"Failed to fetch/convert {name}: {e}")
def get_area_id_from_nominatim(query):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": query,
        "format": "json",
        "limit": 1
    }
    headers = {"User-Agent": "OpenTicketsBot/1.0"}  # Required by Nominatim usage policy
    response = requests.get(url, params=params, headers=headers)
    data = response.json()

    if not data:
        raise ValueError("Location not found")

    osm_type = data[0]["osm_type"]
    osm_id = int(data[0]["osm_id"])

    if osm_type == "relation":
        return 3600000000 + osm_id
    elif osm_type == "way":
        return 2400000000 + osm_id
    elif osm_type == "node":
        return 1600000000 + osm_id
    else:
        raise ValueError("Unknown OSM type")


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
                    if key in aquire_dict:
                        continue
                    name = "_".join(f"{k}-{v}" for k, v in key)
                    query_url = build_overpass_query(tags)
                    aquire_dict[key] = {
                        'name': aquire.get('name'),
                        'type': aquire.get('type'),
                        'region': aquire.get('region'),
                        'overpass_query': query_url
                    }
                safe_name = name.replace(":", "_")
                download_and_save_geojson(name, query_url, "./geojson/aquire", safe_name)

            # Process 'entitlements' section
            for ent in ticket.get('entitlements', []):
                tags = ent.get('osm_tags')
                if tags:
                    key = generate_osm_key(tags)
                    name = "_".join(f"{k}-{v}" for k, v in key)
                    if key in entitlements_dict:
                        continue
                    query_url = build_overpass_query(tags)
                    entitlements_dict[key] = {
                        'type': ent.get('type'),
                        'overpass_query': query_url
                    }
                safe_name = name.replace(":", "_")
                download_and_save_geojson(name, query_url, "./geojson/entitlements", safe_name)

# Example output
print("\n--- Aquire Locations ---")
for k, v in aquire_dict.items():
    print(f"{k}: {v}")

print("\n--- Entitlements ---")
for k, v in entitlements_dict.items():
    print(f"{k}: {v}")
