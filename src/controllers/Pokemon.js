const PokemonModel = require("../models/pokemonSchema");
const request = require('request-promise');

class Pokemon {
  createPokemon (req, res) {
    let queryToCreatePokemons = {
      name: req.body.name,
      price: req.body.price
    };

    if (req.body.stock) {
      queryToCreatePokemons.stock = req.body.stock;
    }

    PokemonModel.create(queryToCreatePokemons).then( pokemonCreated => {
      pokemonCreated = pokemonCreated.toJSON();

      delete pokemonCreated.updatedAt;
      delete pokemonCreated.createdAt;

      res.status(201).json({
        error: false,
        code: 201,
        message: "Pokemon created",
        error_system: null,
        pokemon: pokemonCreated,
        date: new Date(),
      });

      return;
    })
    .catch( err => {
      console.error(err);
      log.error("Error in create a pokemon");

      res.status(400).json({
        error: true,
        code: 400,
        message: "Error in create pokemon",
        error_system: err.action ? err.action : err.errors,
        date: new Date()
      });

      return;
    });
  }
  getAllPokemons (req, res) {
    PokemonModel.findAll().then(pokemons => {
      pokemons = pokemons.map(pokemon => {
        pokemon = pokemon.toJSON();

        delete pokemon.createdAt;
        delete pokemon.updatedAt;

        return pokemon;
      });

      res.status(200).json({
        error: false,
        code: 200,
        message: "ok",
        error_system: null,
        pokemons: pokemons,
        date: new Date(),
      });

      return;
    }).catch(err => {
      console.error(err);
      log.error("Error in find all pokemons");

      res.status(400).json({
        error: true,
        code: 400,
        message: "notfound pokemons",
        error_system: err.action ? err.action : err.errors,
        date: new Date()
      });

      return;
    });
  }
  buyPokemon (req, res) {
    let idPokemon = req.body.id;
    let quantity = req.body.quantity;
    let pagarmeUri = "https://api.pagar.me/1/transactions";
    let pokemonInstance = {};

    PokemonModel.findOne({
      where : { id : idPokemon }
    }).then(pokemon => {
      pokemonInstance = pokemon;

      if (!pokemon) return Promise.reject({message: "notfound pokemon"});

      if (pokemon.stock < quantity ) return Promise.reject({message: "Not enought pokemon in stock"});

      let pokemonPrice = pokemon.price;
      let pokemonName = pokemon.name;
      let amount = pokemonPrice * quantity * 100;

      return request({
  			uri: pagarmeUri,
  			method: 'POST',
  			json: {
  				api_key: process.env.API_KEY_PAGARME,
  				amount,
  				card_number: "4024007138010896",
  				card_expiration_date: "1050",
  				card_holder_name: "Ash Ketchum",
  				card_cvv: "123",
  				metadata: {
  					product: 'pokemon',
  					name: pokemonName,
  					quantity
  				}
  			}
  		})
    })
    .then( response => {
      if (response.status == 'paid') {
        pokemonInstance.stock = pokemonInstance.stock - quantity;
        return pokemonInstance.save();
      } else {
        return Promise.reject(response.message);
      }
    })
    .then( pokemon => {
      res.status(200).json({
        error: false,
        code: 200,
        message: "ok",
        date: new Date(),
      });

      return;
    })
    .catch( err => {
      console.log(err);
      log.error("Error in buy a pokemon");

      res.status(400).json({
        error: true,
        code: 400,
        message: err.message ? err.message : "Error in buy a pokemon",
        date: new Date()
      });

      return;
    })
  }
}

module.exports = new Pokemon();
