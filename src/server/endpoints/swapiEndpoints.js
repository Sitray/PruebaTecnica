
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
            const people = await app.db.swPeople.findByPk(id);

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
            const planet = await app.db.swPlanet.findByPk(id);

            //TODO: LLamar funcion generica para obtener el planeta
            planet ? res.json(planet) : res.sendStatus(404);
        } catch (error) {
            console.error('Error fetching planet:', error);
            res.status(500).send('Error fetching planet');
        }

    });

    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
        res.sendStatus(501);
    });

    server.get('/hfswapi/getLogs',async (req, res) => {
        const data = await app.db.logging.findAll();
        res.send(data);
    });

}

module.exports = applySwapiEndpoints;