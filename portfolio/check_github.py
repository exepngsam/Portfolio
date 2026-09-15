import urllib.request
import urllib.error

usernames = ['soumyajitjena', 'soumyajit-jena', 'soumyajit', 'soumyajit19', 'soumyajitjena19', 'SoumyajitJena123']

for u in usernames:
    try:
        urllib.request.urlopen(f"https://github.com/{u}")
        print(f"FOUND: {u}")
    except urllib.error.HTTPError as e:
        print(f"{u}: {e.code}")
