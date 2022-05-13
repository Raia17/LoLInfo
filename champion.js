const champion = 'Aatrox'

fetch(`http://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/champion/${champion}.json`)
    .then(response => response.json())
    .then(data => renderPage(data))


function renderPage(data) {
    console.log(data);
}