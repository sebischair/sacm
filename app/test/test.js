import assert from "assert"; // node.js core module
import chai from "chai";
import chaiHttp from "chai-http";
import Workspace from '../models/workspace/model.workspace';
import server from "../../app";


let should = chai.should();
let expect = chai.expect;

let base_api = 'http://localhost:8084/api';
chai.use(chaiHttp);

let test_obj = {
  test_uid : 'oi6l6vdha6vs',
  created_user: {
    name: 'Peter Bambo',
    id: '92834982293487',
    email: 'x872jabdjlasdhze@jasdud.de'
  },
  updated_user_obj: {
    name: 'Peter Bambo',
    id: '92834982293487',
    email: '22x872jabdjlasdhze@jasdud.de'    
  }
};

//Our parent block
describe('Test Definitions', () => {

    beforeEach(function(done) { //Before each test delete all workspaces
        this.timeout(5000);
        /*
        Workspace.deleteAll().then((res)=>{
            console.log('');
            console.log('');
            console.log('');
            done();
        });
        */
        done();
    });


    /*
    * Test the /GET route
    */
    describe('/GET User', () => {
        it('Get a specific user by its ID', function(done) {
          this.timeout(15000);
          chai.request(base_api)
              .get('/users/'+encodeURIComponent(test_obj.test_uid))
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
    * Test the /POST route
    */
    describe('/POST Create User', () => {

        // Delete user (if exists)
        before(function(done) {
          this.timeout(15000);
          //console.log('before');
          chai.request(base_api)
              .delete('/users/'+encodeURIComponent(test_obj.created_user.id))
              .end((err, res) => {
                //console.log(res.body);
                done();
              });
        });


        it('Creating a new user with custom ID', function(done) {
          this.timeout(15000);
          chai.request(base_api)
              .post('/users')
              .send(test_obj.created_user)
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
              .patch('/users')
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

/***
* GROUPS
*/

    /*
    * Test the /POST route
    */
    describe('/POST Create group', () => {

        // Delete user (if exists)
        before(function(done) {
          this.timeout(15000);
          //console.log('before');
          chai.request(base_api)
              .delete('/groups/'+encodeURIComponent(test_obj.created_user.id))
              .end((err, res) => {
                //console.log(res.body);
                done();
              });
        });


        it('Creating a new user with custom ID', function(done) {
          this.timeout(15000);
          chai.request(base_api)
              .post('/users')
              .send(test_obj.created_user)
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

                done();
              });
        });
    });



});
