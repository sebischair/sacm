import assert from "assert"; // node.js core module
import chai from "chai";
import chaiHttp from "chai-http";
import Workspace from '../models/workspace/model.workspace';
import EntityDefinition from '../models/datadefinition/model.entitydefinition';
import server from "../../app";


let should = chai.should();
let expect = chai.expect;

let base_api = 'http://localhost:8084/api';
let base_api_sc = 'http://localhost:8083/api/v1';
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
describe('Test Workspace', () => {

  //Before each test delete all workspaces
    beforeEach(function(done) { 
        this.timeout(5000);
        Workspace.deleteAll('bXVzdGVybWFubkB0ZXN0LnNjOm90dHRv').then((res)=>{
            console.log('');
            console.log('');
            console.log('');
            done();
        });
        done();
    });


    /*
    * Test the /POST route
    */
    describe('Direct Workspace creation', () => {


        it('Creates a new workspace with random id', function(done) {
          this.timeout(30000);
          
          var data = { 
            name: 'NAME',
            description: 'DESC',
            permissions:{
              readers: [],
              writers: [],
              contributors: [],
              administrators: ['qdsq66ukt6ls']
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

                console.log(res.body);

                // check if payload is included
                expect(res).to.include.all.keys('body');

                // check if http status is 200
                res.should.have.status(200);

                // check user id
                expect(res.body).to.include({name: data.name});

                done();
              });

        });


        it('Creates a new workspace with custom id', function(done) {
          this.timeout(30000);
          
          var data = { 
            name: 'NAMEXX',
            description: 'DESCXX',
            id: 'uhhhz',
            permissions:{
              readers: [],
              writers: [],
              contributors: [],
              administrators: ['qdsq66ukt6ls']
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

                console.log(res.body);

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
