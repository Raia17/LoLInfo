let currentChamp
const searchBar = document.querySelector('#search-bar')
searchBar.addEventListener("keypress", valueCheck)
window.addEventListener("load", loadData('Aatrox'))



function valueCheck(e) {
    if (e.key != "Enter") {
        return
    }

    let inputValue = e.target.value
    inputValue = inputValue.replace(/[^a-zA-Z0-9 ]/g, '')
    inputValue = inputValue.replace(" ", "")

    let character = inputValue.charAt(0).toUpperCase() + inputValue.slice(1)

    loadData(character)
}



async function loadData(character) {

    try {
        let res = await fetch(`http://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/champion/${character}.json`)
        let data = await res.json()
        currentChamp = character
        renderPage(data.data[character])
    } catch (e) {
        console.error(e);
    }
}



function renderPage(data) {
    
    // base info
    const champName = document.querySelector('.hero-section-champ-name')
    const champTitle = document.querySelector('.hero-section-champ-title')
    const champHeroImage = document.querySelector('.hero-section-img img')
    const champLore = document.querySelector('.lore-section-box-article-body')

    champName.textContent = data.name
    champTitle.textContent = data.title
    champHeroImage.setAttribute('src', `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChamp}_0.jpg`)
    champLore.textContent = data.lore

    // stats
    const stats = document.querySelectorAll('.stats .champion-section-tabs-tab-info')
    for(let i = 0; i < stats.length; i++) {
        const bar = stats[i].lastElementChild
        const barHeader = stats[i].firstElementChild.textContent.toLowerCase()
        console.log(data.info[barHeader]);
        bar.style.setProperty('--value', 10 * data.info[barHeader] + '%')
    }

    // abilities


    // skins
    const skinHeader = document.querySelector('.champion-section-tabs-tab-skin-header')
    const skinImage = document.querySelector('.champion-section-tabs-tab-skin-img')
    let currentIndex = 0

    setSkin()

    const previousHandler = document.querySelector('#previous')
    const nextHandler = document.querySelector('#next')

    previousHandler.addEventListener("click", handlerSkins)
    nextHandler.addEventListener("click", handlerSkins)

    function setSkin() {
        skinHeader.textContent = data.skins[currentIndex].name
        let url = `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChamp}_${currentIndex}.jpg`
        skinImage.setAttribute('src', url)
        skinImage.addEventListener("error", (e) => {
            skinImage.setAttribute('src', `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChamp}_0.jpg`)
        })
    }

    function handlerSkins(e) {
        console.log(e.target.id);
        if(e.target.id === "next") {
            if (currentIndex < data.skins.length - 1) {
                currentIndex++
                setSkin()
                return
            }
            currentIndex = 0
            setSkin()
        } else if (e.target.id === "previous") {
            if (currentIndex > 0) {
                currentIndex--
                setSkin()
                return
            }
            currentIndex = data.skins.length - 1
            setSkin()
        }
    }
}

