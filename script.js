let currentChamp
let globalChampData
const searchBar = document.querySelector('#search-bar')
searchBar.addEventListener("keypress", valueCheck)
searchBar.addEventListener("input", searchEngine(event, globalChampData.data))
window.addEventListener("load", loadData('Aatrox'))

loadAllChampsData()

async function loadAllChampsData() {
    
    try {
        
        let res = await fetch(`https://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/champion.json`)
        globalChampData = await res.json()
        
    } catch (err) {
        throw err
    }
}

function searchEngine(e, data = {}) {
 
    let value = e.target.value
    
    let max_lenght = 5
    let currentLenght = 0

    const suggestions = document.querySelector('.search-bar-suggestions')
    suggestions.innerHTML = ''

    if (value === '') return

    for (const champion in data) {
        if (Object.hasOwnProperty.call(data, champion)) {
            if (currentLenght >= max_lenght) {
                return
            }

            const champ = data[champion];
            if (champ.id.toLowerCase().includes(value.toLowerCase()) || champ.name.toLowerCase().includes(value.toLowerCase())) {
                createSearchItem(champ, suggestions)
                currentLenght++
            }

            
            
        }
    }
}

function createSearchItem(value, parent) {
    const div = document.createElement('div')
    const img = document.createElement('img')
    const p = document.createElement('p')

    div.appendChild(img)
    div.appendChild(p)

    div.classList.add('search-bar-suggestions-item')
    img.classList.add('search-bar-suggestions-item-img')
    p.classList.add('search-bar-suggestions-item-name')

    img.setAttribute('src', `https://ddragon.leagueoflegends.com/cdn/12.9.1/img/champion/${value.image.full}`)

    p.textContent = value.name
    p.setAttribute('data-id', value.id)
    p.setAttribute('data-name', value.name)

    parent.appendChild(div)

    div.addEventListener("click", (e) => {
        loadData(p.getAttribute('data-id'))
        parent.innerHTML = ''
        searchBar.value = ''
    })
}


function valueCheck(e) {
    if (e.key != "Enter") {
        return
    }

    let inputValue = e.target.value
    inputValue = inputValue.replace(/[^a-zA-Z0-9 ]/g, '')
    inputValue = inputValue.replace(" ", "")

    let character = inputValue.charAt(0).toUpperCase() + inputValue.slice(1)
    e.target.value = ''
    searchEngine({}, e.target.value)
    loadData(character)
}



async function loadData(character) {

    try {
        let res = await fetch(`https://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/champion/${character}.json`)
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
    champHeroImage.setAttribute('src', `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChamp}_0.jpg`)
    champLore.textContent = data.lore

    // stats
    const stats = document.querySelectorAll('.stats .champion-section-tabs-tab-info')
    for(let i = 0; i < stats.length; i++) {
        const bar = stats[i].lastElementChild
        const barHeader = stats[i].firstElementChild.textContent.toLowerCase()
        bar.style.setProperty('--value', 10 * data.info[barHeader] + '%')
    }

    // abilities
    let abilitiesInfo = {
        passive: {
            header: data.passive.name,
            img: data.passive.image.full,
            desc: data.passive.description
        },
        abilities: []
    }

    for(const ability of data.spells) {
        abilityName = ability.name
        abilityImage = ability.image.full
        abilityDescription = ability.description

        newAbility = {
            header: abilityName,
            img: abilityImage,
            desc: abilityDescription
        }

        abilitiesInfo.abilities.push(newAbility);
    }

    const passiveImg = document.querySelector('.champion-section-tabs-tab-abilities-navbar-item.passive img')
    passiveImg.setAttribute('src', `https://ddragon.leagueoflegends.com/cdn/12.9.1/img/passive/${abilitiesInfo.passive.img}`)

    const abilitiesImgs = document.querySelectorAll('.champion-section-tabs-tab-abilities-navbar-item.ability img')
    for(i = 0; i<abilitiesInfo.abilities.length; i++) {
        abilitiesImgs[i].setAttribute('src', 'https://ddragon.leagueoflegends.com/cdn/12.9.1/img/spell/' + abilitiesInfo.abilities[i].img)
    }

    const allAbilities = document.querySelectorAll('.champion-section-tabs-tab-abilities-navbar-item')

    //Execução padrão
    const infoHeader = document.querySelector('.champion-section-tabs-tab-abilities-info-header')
    const infoBody = document.querySelector('.champion-section-tabs-tab-abilities-info-body')
    infoHeader.textContent = abilitiesInfo.passive.header
    infoBody.textContent = abilitiesInfo.passive.desc
    document.querySelector('.champion-section-tabs-tab-abilities-navbar-item.passive').classList.add('show')
    
    
    allAbilities.forEach((ability, index) => {
        ability.addEventListener("click", (e) => {
            allAbilities.forEach(ability => {
                ability.classList.remove('show')
            })
            ability.classList.add('show')

            if (index === 0) {
                infoHeader.textContent = abilitiesInfo.passive.header
                infoBody.textContent = abilitiesInfo.passive.desc
                return
            }

            infoHeader.textContent = abilitiesInfo.abilities[index-1].header
            infoBody.textContent = abilitiesInfo.abilities[index-1].desc
        })
    });
    
    

    // skins
    const skinHeader = document.querySelector('.champion-section-skins-header')
    const skinImage = document.querySelector('.champion-section-skins-img')
    let currentIndex = 0

    setSkin()

    const previousHandler = document.querySelector('#previous')
    const nextHandler = document.querySelector('#next')

    previousHandler.addEventListener("click", handlerSkins)
    nextHandler.addEventListener("click", handlerSkins)

    function setSkin() {
        if (data.skins[currentIndex].name != 'default') {
            skinHeader.textContent = data.skins[currentIndex].name
        } else {
            skinHeader.textContent = currentChamp
        }
        
        let url = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChamp}_${data.skins[currentIndex].num}.jpg`
        skinImage.setAttribute('src', url)
    }

    function handlerSkins(e) {
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


const navItems = document.querySelectorAll('.champion-section-tabs-navbar-item-btn')

navItems.forEach(item => {
    item.addEventListener("click", (e) => {

        navItems.forEach(navItem => {
            navItem.classList.remove('active')
        });

        const navBar = document.querySelector('.champion-section-tabs-navbar')
        const statsTab = document.querySelector('.champion-section-tabs-tab.stats')
        const abilitiesTab = document.querySelector('.champion-section-tabs-tab.abilities')
        const skinHandler = document.querySelector('.champion-section-skins-handlers')

        navBar.classList.remove('disabled')
        skinHandler.classList.remove('active')
        statsTab.classList.remove('active')
        abilitiesTab.classList.remove('active')

        if(item.id === "stats") {
            statsTab.classList.add('active')
        } else if (item.id === "abilities") {
            abilitiesTab.classList.add('active')
        } else if (item.id === "skins") {
            navBar.classList.add('disabled')
            skinHandler.classList.add('active')
        }

        e.target.classList.add('active')
    })
});


const closeBtn = document.querySelector('#close')
closeBtn.addEventListener("click", (e) => {
    navItems.forEach(item => {
        item.classList.remove('active')
        if (item.id === "stats") {
            item.classList.add('active')
        }
    })

    const navBar = document.querySelector('.champion-section-tabs-navbar')
    const statsTab = document.querySelector('.champion-section-tabs-tab.stats')
    const skinHandler = document.querySelector('.champion-section-skins-handlers')

    statsTab.classList.add('active')
    navBar.classList.remove('disabled')
    skinHandler.classList.remove('active')
})

