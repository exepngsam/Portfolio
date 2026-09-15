import urllib.request, json
res = urllib.request.urlopen('https://api.github.com/users/exepngsam/repos?sort=updated')
repos = json.loads(res.read().decode())
with open('repos.txt', 'w', encoding='utf-8') as f:
    for r in repos[:10]:
        f.write(f"{r['name']}: {r['description']} ({r['html_url']})\n")
