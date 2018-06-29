'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality Check', function() {
  it('true should be true', function() {
    expect(true).to.be.true;
  });
  it('2 + 2 should equal 4', function() {
    expect(2 + 2).to.equal(4);
  });
});

describe('Noteful App', function() {

  // before(function() {

  // });

  // after(function() {
    
  // });

  describe('Express static', function() {
  
    it('GET request "/" should return the index page', function() {
      return chai
        .request(app)
        .get('/')
        .then(function(res) {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });
  });

  describe('404 handler', function() {

    it('should respond with 404 when given a bad path', function() {
      return chai
        .request(app)
        .get('/DOES/NOT/EXIST')
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  });

  describe('GET /api/notes', function() {

    it('should return the default of 10 notes as an array', function() {
      return chai
        .request(app)
        .get('/api/notes')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(10);
        });
    });

    it('should return an array of objects with the id, title, and content', function() {
      return chai
        .request(app)
        .get('/api/notes')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(10);
          res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys('id', 'title', 'content');
          });
        });
    });

    it('should return correct search results for valid query' , function() {
      return chai
        .request(app)
        .get('/api/notes?searchTerm=about%20cats')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(4);
          expect(res.body[0]).to.be.an('object');
        });
    });

    it('should return an empty array for an incorrect query', function() {
      return chai
        .request(app)
        .get('/api/notes?searchTerm=Something%20not%20Valid')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(0);
        });
    });
  });

  describe('GET /api/notes/:id', function() {

    it('should return correct note object with id, title and content for given id', function() {
      return chai
        .request(app)
        .get('/api/notes/1000')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id','title','content');
          expect(res.body.id).to.equal(1000);
          expect(res.body.title).to.equal('5 life lessons learned from cats');
        });
    });

    it('should respond with a 404 for an invalid id', function() {
      return chai
        .request(app)
        .get('/api/notes/DOESNOTEXIST')
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  });

  describe('POST /api/notes', function() {

    it('should create and return a new item with loction header when provided valid data', function() {
      const newItem = {title: 'Cats are cool', content: 'Lorem ipsum dolor sit amet'};
      return chai
        .request(app)
        .post('/api/notes')
        .send(newItem)
        .then(res => {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id','title','content');
          expect(res.body.id).to.be.equal(1010);
          expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
          expect(res).to.have.header('location');
        });
    });

    it('should return an object with a message property "Missing title in the request body" when missing "title" field', function(){
      const badItem = {content: 'Lorem ipsum dolor sit amet'};
      return chai
        .request(app)
        .post('/api/notes')
        .send(badItem)
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `title` in request body');
        });
    });
  });

  describe('PUT /api/notes/:id', function() {

    it('should update and return a note object when given valid data', function() {
      const updateItem = {title:'updated kitten title', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'};
      return chai
        .request(app)
        .put('/api/notes/1000')
        .send(updateItem)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.equal(1000);
          expect(res.body.title).to.equal(updateItem.title);
          expect(res.body.content).to.equal(updateItem.content);
        });
    });

    it('should respond with a 404 for an invalid id', function() {
      const updateItem = {title:'updated kitten title', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'};
      return chai
        .request(app)
        .put('/api/notes/9999')
        .send(updateItem)
        .catch(err=>err.response)
        .then(res => {
          expect(res).to.have.status(404);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Not Found');
        });
    });

    it('should return an object with a message property "Missing title in request body" when mssing the "title" field', function() {
      const badUpdateItem = {content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'};
      return chai
        .request(app)
        .put('/api/notes/1000')
        .send(badUpdateItem)
        .catch(err=>err.response)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `title` in request body');
        });
    });
  });

  describe('DELETE /api/notes/:id', function() {

    it('should delete an item by id', function () {
      return chai
        .request(app)
        .delete('/api/notes/1001')
        .then(res => {
          expect(res).to.have.status(204);
        });
    });

    it('should respond with 404 when delete non-existant ids', function () {
      return chai
        .request(app)
        .delete('/api/notes/900')
        .catch(err=>err.response)
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('Not Found');
        });
    });
  });
});