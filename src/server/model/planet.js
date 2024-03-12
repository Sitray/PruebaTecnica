const { genericRequest, getWeightOnPlanet, getRandom } = require('../../app/swapiFunctions');
const { PeopleModel } = require('./people');

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
            name: response.name,
            gravity: response.gravity
          }
          console.log(parsedResponse)
        return parsedResponse
      }
    } catch (error) {
      console.error('Error no se encontro el planeta:', error);
      return  null
    }

  }

  static async getWeightOnPlanetRandom(app) {
    try {
      const [person, planet] = await Promise.all([PeopleModel.getPeopleById(getRandom(88), app, ''), this.getPlanetById(getRandom(61), app)]);

      const parsedGravity = parseFloat(planet.gravity);
      const parsedMass = parseFloat(person.mass);
  
      if (isNaN(parsedGravity) || isNaN(parsedMass)) {
          throw new Error('Falta la gravidad o la masa del personaje');
      }

      return {
        name: person.name,
        planet: planet.name,
        characterWeight: getWeightOnPlanet(parsedMass, parsedGravity)
      }

  } catch (error) {
      console.error('Error fetching character:', error);
      throw new Error(error.message);
    }
  }
}

module.exports = {
  PlanetModel
}