const userModel = require("../../src/models/userSchema");
const pokemonModel = require("../../src/models/pokemonSchema");
const userTest = { email: "test@gmail.com", name: "test", password: "!Test12345" };
const pokemonTest = { name: "Charizard", price: "50", stock: "10" };

describe("Routes Pokemon", () => {

  let token = "";
  let user = {};
  let pokemon = {};
  let pokemons = [];

  // create a new user
  before("before create a user and make login to generate a token", done => {
    request
    .post(`/api/${process.env.API_VERSION}/user/create`)
    .send(userTest)
    .expect(201)
    .end(done);
  });

  // make login with user
  before("before make login with user fake", done => {
    request
    .post(`/api/${process.env.API_VERSION}/authentication/login`)
    .send({ email: "test@gmail.com", password: "!Test12345" })
    .expect(200)
    .end( (err, response) => {
      token = response.body.token;
      user = response.body.user;
      done();
    });
  });

  // create a pokemon
  describe(`POST /api/${process.env.API_VERSION}/pokemon/create`, () => {
    it("should create a pokemon in database", done => {

      request
      .post(`/api/${process.env.API_VERSION}/pokemon/create`)
      .send(pokemonTest)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(201)
      .end((err, response) => {
        pokemon = response.body.pokemon;

        expect(pokemon).to.be.a('object');
        expect(pokemon).to.have.property('name');
        expect(pokemon).to.have.property('price');
        expect(pokemon).to.have.property('stock');
        done();
      });
    });
  });

  // buy pokemons with pagar.me
  describe(`POST /api/${process.env.API_VERSION}/pokemon/buy`, () => {
    it("should BUY a pokemon", done => {

      request
      .post(`/api/${process.env.API_VERSION}/pokemon/buy`)
      .send({ id : pokemon.id, quantity: 2 })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done)
    });
  });

  // select all pokemons
  describe(`GET /api/${process.env.API_VERSION}/pokemon/all`, () => {
    it("should return a list with all pokemon in database", done => {

      request
      .get(`/api/${process.env.API_VERSION}/pokemon/all`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end((err, res) => {
        pokemons = res.body.pokemons;

        expect(pokemons).to.be.a('array');
        expect(pokemons[0]).to.have.property('name');
        expect(pokemons[0]).to.have.property('price');
        expect(pokemons[0]).to.have.property('stock');
        done();
      });
    });
  });

  // delete pokemon test
  after("delete pokemon from database", done => {
    pokemonModel.destroy({
      where : { id : pokemon.id },
    })
    .then(successfull => {
      console.log("pokemon deleted");
      done();
    })
    .catch(err => {
      console.log(err);
    });
  });

  // delete user test
  after("delete user from database", done => {
    userModel.destroy({
      where : { id : user.id },
    })
    .then(successfull => {
      console.log("User deleted");
      done();
    })
    .catch(err => {
      console.log(err);
    });
  });
});
