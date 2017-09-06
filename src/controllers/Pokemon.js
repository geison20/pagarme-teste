const PokemonModel = require("../models/pokemonSchema");
const request = require("request-promise");

class Pokemon {
    static createPokemon(req, res) {
        const queryToCreatePokemons = {
            name: req.body.name,
            price: req.body.price,
        };

        if (req.body.stock) {
            queryToCreatePokemons.stock = req.body.stock;
        }

        PokemonModel.create(queryToCreatePokemons).then((pokemonCreated) => {
            const pokemonCreatedJSON = pokemonCreated.toJSON();

            delete pokemonCreatedJSON.updatedAt;
            delete pokemonCreatedJSON.createdAt;

            res.status(201).json({
                error: false,
                code: 201,
                message: "Pokemon created",
                error_system: null,
                pokemon: pokemonCreatedJSON,
                date: new Date(),
            });
        })
            .catch((err) => {
                console.error(err);
                log.error("Error in create a pokemon");

                res.status(400).json({
                    error: true,
                    code: 400,
                    message: "Error in create pokemon",
                    error_system: err.action ? err.action : err.errors,
                    date: new Date(),
                });
            });
    }
    static getAllPokemons(req, res) {
        PokemonModel.findAll().then((pokemons) => {
            const pokemonsFilter = pokemons.map((pk) => {
                const pokemon = pk.toJSON();

                delete pokemon.createdAt;
                delete pokemon.updatedAt;

                return pokemon;
            });

            res.status(200).json({
                error: false,
                code: 200,
                message: "ok",
                error_system: null,
                pokemonsFilter,
                date: new Date(),
            });
        }).catch((err) => {
            console.error(err);
            log.error("Error in find all pokemons");

            res.status(400).json({
                error: true,
                code: 400,
                message: "notfound pokemons",
                error_system: err.action ? err.action : err.errors,
                date: new Date(),
            });
        });
    }
    static buyPokemon(req, res) {
        const { id: idPokemon, quantity } = req.body;
        const pagarmeUri = "https://api.pagar.me/1/transactions";
        let pokemonInstance = {};

        PokemonModel.findOne({
            where: { id: idPokemon },
        }).then((pokemon) => {
            pokemonInstance = pokemon;

            if (!pokemon) throw new Error({ message: "notfound pokemon" });

            if (pokemon.stock < quantity) throw new Error({ message: "Not enought pokemon in stock" });

            const pokemonPrice = pokemon.price;
            const pokemonName = pokemon.name;
            const amount = pokemonPrice * quantity * 100;

            return request({
                uri: pagarmeUri,
                method: "POST",
                json: {
                    api_key: process.env.API_KEY_PAGARME,
                    amount,
                    card_number: "4024007138010896",
                    card_expiration_date: "1050",
                    card_holder_name: "Ash Ketchum",
                    card_cvv: "123",
                    metadata: {
                        product: "pokemon",
                        name: pokemonName,
                        quantity,
                    },
                },
            });
        })
            .then((response) => {
                if (response.status === "paid") {
                    pokemonInstance.stock -= quantity;
                    return pokemonInstance.save();
                }
                return Promise.reject(response.message);
            })
            .then(() => {
                res.status(200).json({
                    error: false,
                    code: 200,
                    message: "ok",
                    date: new Date(),
                });
            })
            .catch((err) => {
                console.log(err);
                log.error("Error in buy a pokemon");

                res.status(400).json({
                    error: true,
                    code: 400,
                    message: err.message ? err.message : "Error in buy a pokemon",
                    date: new Date(),
                });
            });
    }
}

module.exports = Pokemon;
