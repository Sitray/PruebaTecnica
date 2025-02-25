const WookieePeople = require('./wookieePeople');
const CommonPeople = require('./CommonPeople');



const peopleFactory = async (id, lang) => {
    let people = null;
    if (lang == 'wookiee'){
        people = new WookieePeople(id);
    } else {
        people = new CommonPeople(id);
    }
    await people.init();
    return people;
}

module.exports = { peopleFactory }