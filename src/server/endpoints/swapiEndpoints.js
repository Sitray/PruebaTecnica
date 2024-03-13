const fetch = require('node-fetch');
const { PeopleModel } = require('../model/people');
const { PlanetModel } = require('../model/planet');

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

    server.get('/hfswapi/getPeople/:id', async (req, res, next) => {
        const { id } = req.params;
        const isWookiee = _isWookieeFormat(req) ? '?format=wookiee' : '';
        const people = await PeopleModel.getPeopleById(id, app, isWookiee);
        if(!people) res.status(500).send({message:'Error buscando a la persona'}); 

        res.json(people);
        next()
   
    });

    server.get('/hfswapi/getPlanet/:id', async (req, res,  next) => {
        const { id } = req.params;
        const planet = await PlanetModel.getPlanetById(id, app);
        if(!planet) res.status(500).send({message:'Error buscando el planeta'}); 

        res.json(planet);
        next()

    });

    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res, next) => {
        const character = await PlanetModel.getWeightOnPlanetRandom(app);
        if(!character) res.status(500).send({message:'Error devolviendo el peso del personaje'});
        
        res.json(character)
        next()
    });

    server.get('/hfswapi/getLogs',async (req, res) => {
        const data = await app.db.logging.findAll();
        res.send(data);
    });

}

module.exports = applySwapiEndpoints;