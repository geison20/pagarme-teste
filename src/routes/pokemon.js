const pokemonController = require("../controllers/Pokemon");
const pokemonValidation = require("../middlewares/pokemon");

module.exports = (app) => {
    // create pokemon
    app.post(`/api/${process.env.API_VERSION}/pokemon/create`, [pokemonValidation.create], pokemonController.createPokemon);

    // get all pokemons
    app.get(`/api/${process.env.API_VERSION}/pokemon/all`, pokemonController.getAllPokemons);

    // buy a pokemon
    app.post(`/api/${process.env.API_VERSION}/pokemon/buy`, [pokemonValidation.buy], pokemonController.buyPokemon);
};
