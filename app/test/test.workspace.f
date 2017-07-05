import assert from "assert"; // node.js core module
import chai from "chai";
import chaiHttp from "chai-http";
import Workspace from '../models/workspace/model.workspace';
import User from '../models/group/model.user';
import EntityDefinition from '../models/datadefinition/model.entitydefinition';
import server from "../../app";


let should = chai.should();
let expect = chai.expect;

let base_api = 'http://localhost:8084/api/v1';
let base_api_sc = 'http://localhost:8083/api/v1';
chai.use(chaiHttp);

let uid = Math.random().toString(36).substring(7);
let jwt = "Basic bXVzdGVybWFubkB0ZXN0LnNjOm90dHRv";
let current_user = null; 
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
describe('Test Workspace', () => {

  //Before each test delete all workspaces
    beforeEach(function(done) { 
        this.timeout(5000);

        // Get current user
        User.me(jwt).then((res) => {   
          current_user = res;       
          Workspace.deleteAll(jwt).then((res)=>{
              console.log('');
              done();
          });
        });

    });


    /*
    * Test the /POST route
    */
    describe('Direct Workspace creation', () => {




        it('Creates a new workspace with a random id', function(done) {
          this.timeout(30000);

         
          var data = { 
            name: 'NAMExx',
            description: 'DESC',
            permissions:{
              readers: [],
              writers: [],
              contributors: [],
              administrators: [current_user.id]
              }
          }


          chai.request(base_api_sc)
              .post('/workspaces')
              .set('Authorization', 'Basic bXVzdGVybWFubkB0ZXN0LnNjOm90dHRv')
              .send(data)
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
                expect(res.body).to.include({name: data.name});

                done();
              });

        });


        it('Creates a new workspace with a custom id', function(done) {
          this.timeout(30000);
          
          var data = { 
            name: 'NAMEXXxx',
            description: 'DESCXX',
            id: 'uhhhzxxuu',
            permissions:{
              readers: [],
              writers: [],
              contributors: [],
              administrators: [current_user.id]
              }
          }


          chai.request(base_api_sc)
              .post('/workspaces')
              .set('Authorization', 'Basic bXVzdGVybWFubkB0ZXN0LnNjOm90dHRv')
              .send(data)
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
                expect(res.body).to.include({name: data.name, id: data.id});

                done();
              });

        });




      });  



// end all
});
