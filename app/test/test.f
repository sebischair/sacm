import assert from "assert"; // node.js core module
import chai from "chai";
import chaiHttp from "chai-http";
import Workspace from '../models/workspace/model.workspace';
import EntityDefinition from '../models/datadefinition/model.entitydefinition';
import server from "../../app";


let should = chai.should();
let expect = chai.expect;

let base_api = 'http://localhost:8084/api';
chai.use(chaiHttp);

var uid = Math.random().toString(36).substring(7);
var jwt = "Basic bXVzdGVybWFubkB0ZXN0LnNjOm90dHRv";
let test_obj = {
  test_uid : uid,
  created_casedefinition: {
    name: 'CaseDev1',
    label: 'CaseDev1--Label',
    entityDefinition: ''
  },
  updated_casedefinition: {
    name: 'CaseDev1',
    label: 'CaseDev1--Label',
    entityDefinition: ''  
  }
};

//Our parent block
describe('Test CasesDefinitions', () => {

    /*
    * Test the /POST route
    */
    describe('/POST CasesDefinition', () => {

        // Delete user (if exists)
        before(function(done) {
          this.timeout(25000);

          var data = { name: 'Camuute',
          description: 'blalblalba',
          id: 'alsdkalsdklasd',
          permissions:{
            readers: [],
            writers: [],
            contributors: [],
            administrators: []
          }
        }

          // Create Workspace
          Workspace.create(jwt, data).then(() => {});

          // Create EntityDefinition
          /*
          EntityDefinition.create(jwt, {
            workspace: this.getWorkspaceIdByXMLId(Workspace.$.id), 
            name: ed.$.id
          })
          .then(persistedEntityDefinition =>{
            this.entityDefinitionMap.set(ed.$.id, persistedEntityDefinition.id);
            return Promise.resolve();
          });
          */


        });


        it('Creates a new CasesDefinition', function(done) {
          this.timeout(25000);
          chai.request(base_api)
              .post('/casedefinitions')
              .send(test_obj.created_casedefinition)
              .end((err, res) => {

                // check if payload is included
                expect(res).to.include.all.keys('body');

                // check if http status is 200
                res.should.have.status(200);

                // check user id
                expect(res.body).to.include({name: test_obj.created_casedefinition.name});

                done();
              });
        });
    });


    /*
    * Test the /GET route
    */
    describe('/GET User', () => {

        it('Get a specific user by its ID', function(done) {
          //this.timeout(15000);
          chai.request(base_api)
              .get('/user/'+encodeURIComponent(test_obj.test_uid))
              .end((err, res) => {
                // check if payload is included
                expect(res).to.include.all.keys('body');

                // check if http status is 200
                res.should.have.status(200);

                // check user id
                expect(res.body).to.include({id: test_obj.test_uid});

                done();
              });
        });
    });

    /*
    * Test the /GET route
    */
    describe('/GET All users', () => {

        it('Get all users', function(done) {
          //this.timeout(15000);
          chai.request(base_api)
              .get('/users/')
              .end((err, res) => {
                // check if payload is included
                expect(res).to.include.all.keys('body');

                // check if http status is 200
                res.should.have.status(200);

                // check user id
                expect(res.body).to.be.an('array');

                done();
              });
        });
    });



    describe('/PATCH Update User', () => {

        // Delete user (if exists)
        before(function(done) {
          this.timeout(15000);
          done();
        });


        it('Update a user by its ID', function(done) {
          this.timeout(15000);
          chai.request(base_api)
              .patch('/user/'+encodeURIComponent(test_obj.test_uid))
              .send(test_obj.updated_user_obj)
              //.field('name', 'Peter Parker')
              //.field('email', '723h4jnasdkad@asdasd.de')
              //.field('id', 'ThisIsACustomId775')
              .end((err, res) => {

                //console.log(res.body);

                // check if payload is included
                expect(res).to.include.all.keys('body');

                // check if http status is 200
                res.should.have.status(200);

                // check user id
                expect(res.body).to.include({id: test_obj.created_user.id});
                expect(res.body).to.include({email: test_obj.updated_user_obj.email});

                done();
              });
        });
    });



describe('/DELTE User', () => {

        // Delete user (if exists)
        before(function(done) {
          this.timeout(15000);
          done();
        });


        it('Delete a user by its ID', function(done) {
          this.timeout(15000);
          chai.request(base_api)
              .delete('/user/'+encodeURIComponent(test_obj.test_uid))
              .end((err, res) => {

                //console.log(res.body);

                // check if payload is included
                expect(res).to.include.all.keys('body');

                // check if http status is 200
                res.should.have.status(200);

                // check user id
                expect(res.body).to.include({success: true});

                done();
              });
        });
    });



// end all
});
