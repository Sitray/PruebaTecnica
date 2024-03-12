const { genericRequest, translateWookieeToEnglish } = require('../../app/swapiFunctions');

class PeopleModel {
  static async getPeopleById(id, app, isWookiee) {
    try {
      const people = await app.db.swPeople.findByPk(id, {
        attributes: ['name', 'mass', 'height', 'homeworld_name', 'homeworld_id']
      });
    
    if(people) {
        return people;
    } 

    const response = await genericRequest(`https://swapi.py4e.com/api/people/${id}${isWookiee}`, 'GET', null, false)
    let parsedResponse;

    if(isWookiee) {
        const translatedResponse = translateWookieeToEnglish(response);
        parsedResponse = {
            name: translatedResponse.name,
            mass: translatedResponse.mass,
            height: translatedResponse.height,
            homeworld: translatedResponse.homeworld
        };
      } else {
        parsedResponse = {
          name: response.name,
          mass: response.mass,
          height: response.height,
          homeworld: response.homeworld
        };
      }
      return parsedResponse;
    } catch (error) {
      console.error('Error buscando personas:', error);
      return null
    }

  }
}

module.exports = {
  PeopleModel
}