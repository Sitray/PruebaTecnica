const fetch = require('node-fetch');
const { getWeightOnPlanet, getRandom } = require('../../app/swapiFunctions');

const _isWookieeFormat = (req) => {
    if(req.query.format && req.query.format == 'wookiee'){
        return true;
    }
    return false;
}


const applySwapiEndpoints = (server, app) => {
    server.get('/hfswapi/test', async (req, res) => {
        const data = await app.swapiFunctions.genericRequest('https://swapi.dev/api/', 'GET', null, true);
        res.send(data);
    });

    server.get('/hfswapi/getPeople/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const people = await app.db.swPeople.findByPk(id, {
                attributes: ['name', 'mass', 'height', 'homeworld_name', 'homeworld_id']
            });

            // people ? res.json(people) : res.sendStatus(404);
            if(people) {
                res.json(people);
            } else {
                //TODO: Hacer la llamada a https://swapi.py4e.com/api/ (hacer un metodo generico)
            }
        } catch (error) {
            console.error('Error fetching people:', error);
            res.status(500).send('Error fetching people');
        }

    });

    server.get('/hfswapi/getPlanet/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const planet = await app.db.swPlanet.findByPk(id, {
                attributes: ['name', 'gravity']
            });

            //TODO: LLamar funcion generica para obtener el planeta
            planet ? res.json(planet) : res.sendStatus(404);
        } catch (error) {
            console.error('Error fetching planet:', error);
            res.status(500).send('Error fetching planet');
        }

    });

    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
        try {
            const randomPositionPerson = getRandom(88)
            const randomPositionPlanet = getRandom(61)
            const findPeople = await app.db.swPeople.findAll();
            const findPlanet = await app.db.swPlanet.findAll();

            if(findPeople[randomPositionPerson] && findPlanet[randomPositionPlanet]) {
                const person = findPeople[randomPositionPerson];
                const planet = findPlanet[randomPositionPlanet];
                if(person.homeworld_name === planet.name){ res.status(500).send({message: 'El planeta es el mismo'})}
                

                const character = {
                    name: person.name,
                    planet: planet.name,
                    characterWeight: getWeightOnPlanet(person.mass, planet.gravity)
                }

                res.json(character)
            } else {

                const resultsPeople = await fetch(`https://swapi.py4e.com/api/people/${randomPositionPerson}`);
                const randomPerson = await resultsPeople.json();
        
                const resultsPlanet = await fetch(`https://swapi.py4e.com/api/planets/${randomPositionPlanet}`);
                const randomPlanet = await resultsPlanet.json();

                if(resultsPeople.status === 404 || resultsPlanet.status === 404) { 
                    res.status(500).send({message: resultsPeople.statusText})
                }

                if (randomPerson.homeworld === randomPlanet.url) {
                    res.status(500).send({ message: 'El planeta es el mismo de SWAPI' });
                }
                const parsedGravity = parseFloat(randomPlanet.gravity);
                const parsedMass = parseFloat(randomPerson.mass);
                
                if (isNaN(parsedGravity) || isNaN(parsedMass)) {
                    res.status(500).send({ message: 'No hay  datos de masa o gravedad' });
                }

                const characterWeight = getWeightOnPlanet(parsedGravity, parsedMass);
                const character = {
                    name: randomPerson.name,
                    planet: randomPlanet.name,
                    characterWeight: characterWeight
                };
        
                res.json(character);
            }

        } catch (error) {
            console.error('Error fetching planet:', error);
            res.status(500).send('Error fetching planet');
        }

    });

    server.get('/hfswapi/getLogs',async (req, res) => {
        const data = await app.db.logging.findAll();
        res.send(data);
    });

}

module.exports = applySwapiEndpoints;