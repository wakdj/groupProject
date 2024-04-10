#https://spotipy.readthedocs.io/en/2.22.1/
import spotipy
import os
from dotenv import load_dotenv
from spotipy.oauth2 import SpotifyClientCredentials
import json
load_dotenv()
client_pass = os.getenv("SPOTIPY_CLIENT_ID")
client_pass_secret = os.getenv("SPOTIPY_CLIENT_SECRET")
#credentials = client_id + ':' + client_secret

sad_pop_uri = 'spotify:playlist:4vCc5ESMGnxHZbZzdKKmKA'
sad_slowcore_uri = 'spotify:playlist:37i9dQZF1DX30gKInBBe5k'
sad_blues_uri = "spotify:playlist:3HBMO2cSZUqj0yQzPCV2sG"
happy_pop_uri = "spotify:playlist:37i9dQZF1DWVlYsZJXqdym"
happy_jazz_uri = "spotify:playlist:37i9dQZF1DX5YTAi6JhwZm"
happy_rock_uri = 'spotify:playlist:5shpZNIDc85cR2bj7UUAXA'

categories_sub_categories = [
    {
        "category": "sad",
        "sub_category": {"sad_pop":sad_pop_uri,"sad_blues":sad_blues_uri,'sad_slowcore':sad_slowcore_uri}
    },
    {
        "category": "happy",
        "sub_category": {"happy_pop":happy_pop_uri, "happy_feel_good":happy_jazz_uri, "happy_rock":happy_rock_uri}
    }
]
spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(client_id=client_pass, client_secret=client_pass_secret))

# results = spotify.playlist_tracks(sad_pop_uri)
# full_playlist_data = results['items'] 
# stripped_playlist_data = {}

for cat_sub in categories_sub_categories:
    main_category = cat_sub["category"]
    sub_category = cat_sub["sub_category"]  
    for uri in sub_category:
        all_songs = []
        print(sub_category[uri])
        results = spotify.playlist_tracks(sub_category[uri])
        full_playlist_data = results['items']
        for song in full_playlist_data:
            song_info = {
                "name": song['track']['name'],
                "spotify_url": song['track']['external_urls']['spotify'],
                "artist": song['track']['artists'][0]['name']
            }
            all_songs.append(song_info)
        sub_category[uri] = all_songs
             

print(categories_sub_categories)
        
    # if main_category not in stripped_playlist_data:
    #     stripped_playlist_data[main_category] = {}

    # if sub_category not in stripped_playlist_data[main_category]:
    #     stripped_playlist_data[main_category][sub_category] = []

    # song_info = {
    #     "name": song['track']['name'],
    #     "spotify_url": song['track']['external_urls']['spotify'],
    #     "artist": song['track']['artists'][0]['name']
    # }

    # stripped_playlist_data[main_category][sub_category].append(song_info)
# print(stripped_playlist_data["sad_pop"][0]['name'])
script_dir = os.path.dirname(__file__)
file_path = os.path.join(script_dir, "all_playlist_info.json")
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(categories_sub_categories, f)