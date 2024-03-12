const fetch = require('node-fetch');

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
            const resultsPeople = await fetch("https://swapi.py4e.com/api/people");
            const getAllPeople = await resultsPeople.json();
            const randomPerson = getAllPeople.results[Math.floor(Math.random() * getAllPeople.results.length)];
    
            const resultsPlanet = await fetch("https://swapi.py4e.com/api/planets");
            const getAllPlanets = await resultsPlanet.json();
            const randomPlanet = getAllPlanets.results[Math.floor(Math.random() * getAllPlanets.results.length)];
    
            //si viene de swapi
            if(randomPerson.homeworld === randomPlanet.url){
                console.log("entra if")    
                res.status(500).send({message: 'El planeta es el mismo'})     
            }
      
            const getFirstNumberFromGravity = parseFloat(randomPlanet.gravity === 'N/A' ? 1 : randomPlanet.gravity) ; 
            const characterWeight = randomPerson.mass * getFirstNumberFromGravity;
            const character = {
                name: randomPerson.name,
                planet: randomPlanet.name,
                characterWeight: characterWeight
            }

             res.json(character)
        } catch (error) {
            
        }

    });

    server.get('/hfswapi/getLogs',async (req, res) => {
        const data = await app.db.logging.findAll();
        res.send(data);
    });

}

module.exports = applySwapiEndpoints;