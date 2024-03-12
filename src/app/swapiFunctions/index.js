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
    translateWookieeToEnglish
}