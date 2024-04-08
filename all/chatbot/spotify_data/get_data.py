#https://spotipy.readthedocs.io/en/2.22.1/
import spotipy
import os
from dotenv import load_dotenv
from spotipy.oauth2 import SpotifyClientCredentials
load_dotenv()
client_pass = os.getenv("SPOTIPY_CLIENT_ID")
client_pass_secret = os.getenv("SPOTIPY_CLIENT_SECRET")
#credentials = client_id + ':' + client_secret

birdy_uri = 'spotify:playlist:4vCc5ESMGnxHZbZzdKKmKA'
spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(client_id=client_pass, client_secret=client_pass_secret))

results = spotify.playlist_tracks(birdy_uri)
playlist_data = results['items']
for song in playlist_data:
    print(song['track']['name'])
    print(song['track']['external_urls']['spotify'])
    print(song['track']['artists'][0]['name'])
    print("****************************************")

