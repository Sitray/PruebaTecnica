const fetch = require('node-fetch');

const getWeightOnPlanet = (mass, gravity) => {
    return mass * gravity;
}

const genericRequest = async (url, method, body, logging = false) => {
    let options = {
        method: method
    }
    if(body){
        options.body = body;
    }
    const response = await fetch(url, options);
    const data = await response.json();
    if(logging){
        console.log(data);
    }
    return data;
}

const getRandom = (index) => {
    return Math.floor(Math.random() * index)
}

const getRandomPerson = async (app) => {
    const randomPosition = getRandom(88);
    return app.db.swPeople.findOne({ offset: randomPosition });
}

const getRandomPlanet = async (app) => {
    const randomPosition = getRandom(61);
    return app.db.swPlanet.findOne({ offset: randomPosition });
}

const getCharacterFromAPI = async (personPosition, planetPosition) => {
    const [personResponse, planetResponse] = await Promise.all([
        genericRequest(`https://swapi.py4e.com/api/people/${personPosition}`, 'GET', null, false),
        genericRequest(`https://swapi.py4e.com/api/planets/${planetPosition}`, 'GET', null, false)
    ]);

    if (personResponse.status === 404 || planetResponse.status === 404) {
        throw new Error('No se encontró la persona o el planeta');
    }

    const [person, planet] = await Promise.all([personResponse, planetResponse]);

    if (person.homeworld === planet.url) {
        throw new Error('La persona y el planeta son el mismo');
    }

    const parsedGravity = parseFloat(planet.gravity);
    const parsedMass = parseFloat(person.mass);

    if (isNaN(parsedGravity) || isNaN(parsedMass)) {
        throw new Error('Falta la gravidad o la masa del personaje');
    }

    return {
        name: person.name,
        planet: planet.name,
        characterWeight: getWeightOnPlanet(parsedGravity, parsedMass)
    };
}

const wookieeToEnglish = {
    'whrascwo': 'name',
    'acwoahrracao': 'height',
    'scracc': 'mass',
    'acraahrc_oaooanoorc': 'hair_color',
    'corahwh_oaooanoorc': 'skin_color',
    'worowo_oaooanoorc': 'eye_color',
    'rhahrcaoac_roworarc': 'birth_year',
    'rrwowhwaworc': 'gender',
    'acooscwoohoorcanwa': 'homeworld',
    'wwahanscc': 'films',
    'cakwooaahwoc': 'species',
    'howoacahoaanwoc': 'vehicles',
    'caorarccacahakc': 'starships',
    'oarcworaaowowa': 'created',
    'wowaahaowowa': 'edited',
    'hurcan': 'url'
};

const translateWookieeToEnglish = (wookieeObject) => {
    const englishObject = {};

    for (const key in wookieeObject) {
        const englishKey = wookieeToEnglish[key];
        if (englishKey) {
            englishObject[englishKey] = wookieeObject[key];
        } else {
            englishObject[key] = wookieeObject[key];
        }
    }
    
    return englishObject;
}

module.exports = {
    getWeightOnPlanet,
    genericRequest,
    getRandom,
    getRandomPerson,
    getRandomPlanet,
    getCharacterFromAPI,
    translateWookieeToEnglish
}