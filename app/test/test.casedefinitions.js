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
chai.use(chaiHttp);

var uid = Math.random().toString(36).substring(7) + '-Patrick#';
var jwt = "Basic bXVzdGVybWFubkB0ZXN0LnNjOm90dHRv";
let current_user = null;
let test_obj = {
  test_uid : uid,
  created_casedefinition: {
    name: 'CaseDev1',
    label: 'CaseDev1--Label',
    description: 'asdasdasd',
    entityDefinition: ''
  },
  updated_casedefinition: {
    name: 'CaseDev2',
    label: 'CaseDev2--Label'
  }
};

let result_case_def = null;

var workspace_data = { 
  name: 'Camuute',
  description: 'blalblalba',
  id: 'alsdkalsdklasd',
  permissions:{
    readers: [],
    writers: [],
    contributors: [],
    administrators: []
  }
}

//Our parent block
describe('Test CasesDefinitions', () => {

    /*
    * Test the /POST route
    */
    describe('/POST CasesDefinition', () => {

        // Delete user (if exists)
        before(function(done) {
          this.timeout(25000);



        // Get current user
        User.me(jwt).then((res) => {   
          current_user = res;       
          Workspace.deleteAll(jwt).then((res)=>{
            // Create Workspace
            workspace_data.permissions.administrators.push(current_user.id);
            Workspace.create(jwt, workspace_data).then((res) => {

                // Create EntityDefinition
                EntityDefinition.create(jwt, {
                  workspace: res.id,
                  name: uid
                }).then((res) => {
                  test_obj.created_casedefinition.entityDefinition = res.id;
                  done();
                });

            });
          });
        });

          

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

                // Assign created CaseDefinition object
                result_case_def = res.body;

                // check user id
                expect(res.body).to.include({name: test_obj.created_casedefinition.name});

                done();
              });
        });

        it('Gets a specific CasesDefinition', function(done) {
          this.timeout(25000);
          chai.request(base_api)
              .get('/casedefinitions/'+encodeURIComponent(result_case_def.id))
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


        it('Patches a CasesDefinition', function(done) {
          this.timeout(25000);
          chai.request(base_api)
              .patch('/casedefinitions/'+encodeURIComponent(result_case_def.id))
              .send(test_obj.updated_casedefinition)
              .end((err, res) => {

                // check if payload is included
                expect(res).to.include.all.keys('body');

                // check if http status is 200
                res.should.have.status(200);

                // Assign updated CaseDefinition object
                result_case_def = res.body;

                // check user id
                expect(res.body).to.include({name: test_obj.updated_casedefinition.name});

                done();
              });
        });


        it('Deletes a CasesDefinition', function(done) {
          this.timeout(25000);
          chai.request(base_api)
              .delete('/casedefinitions/'+encodeURIComponent(result_case_def.id))
              .send(test_obj.updated_casedefinition)
              .end((err, res) => {

                console.log(res);

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
