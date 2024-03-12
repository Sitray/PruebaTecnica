const { genericRequest } = require('../../app/swapiFunctions');

class PeopleModel {
  static async getPeopleById(id, app) {
    try {
      const people = await app.db.swPeople.findByPk(id, {
        attributes: ['name', 'mass', 'height', 'homeworld_name', 'homeworld_id']
    });
    
    if(people) {
        return people;
    } else {
      const response = await genericRequest(`https://swapi.py4e.com/api/people/${id}`, 'GET', null, false)
      const parsedResponse = {
        name: response.name,
        mass: response.mass,
        height: response.height,
        hoemworld: response.homeworld
      }
      
      return parsedResponse;
    }
    } catch (error) {
      console.error('Error buscando personas:', error);
      return null
    }

  }
}

module.exports = {
  PeopleModel
}