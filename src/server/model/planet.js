const { genericRequest, getWeightOnPlanet, getRandom, getRandomPerson, getRandomPlanet, getCharacterFromAPI  } = require('../../app/swapiFunctions');

class PlanetModel {
  static async getPlanetById(id, app) {
    try {
      const planet = await app.db.swPlanet.findByPk(id, {
          attributes: ['name', 'gravity']
      });

      if(planet) {
          return planet
      } else {
          const  response = await genericRequest(`https://swapi.py4e.com/api/planets/${id}`, 'GET', null, false)
          const parsedResponse = {
            namme: response.name,
            gravity: response.gravity
          }
        return parsedResponse
      }
    } catch (error) {
      console.error('Error no se encontro el planeta:', error);
      return  null
    }
  }

  static async getWeightOnPlanetRandom(app) {
    try {
      const [person, planet] = await Promise.all([getRandomPerson(app), getRandomPlanet(app)]);

      if (person && planet) {
        if (person.homeworld_name === planet.name) {
          throw new Error('La persona y el planeta son el mismo');
        }

        return {
          name: person.name,
          planet: planet.name,
          characterWeight: getWeightOnPlanet(person.mass, planet.gravity)
        }
      }

      const character = await getCharacterFromAPI(getRandom(88), getRandom(61));
      return character
  } catch (error) {
      console.error('Error fetching character:', error);
      throw new Error(error.message);
    }
  }
}

module.exports = {
  PlanetModel
}