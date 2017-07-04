import assert from "assert"; // node.js core module
import chai from "chai";
import chaiHttp from "chai-http";
import Workspace from '../models/workspace/model.workspace';
import server from "../../app";


let should = chai.should();
let expect = chai.expect;

let base_api = 'http://localhost:8084/api';
chai.use(chaiHttp);

var uid = Math.random().toString(36).substring(7);

let test_obj = {
  test_uid : uid,
  created_user: {
    name: 'Peter Bambo',
    id: uid,
    email: uid + '@jasdud.de'
  },
  updated_user_obj: {
    name: 'Peter Bambo',
    id: uid,
    email: uid + 'xx@xjasdud.de'    
  }
};

//Our parent block
describe('Test User', () => {

/*
    beforeEach(function(done) { //Before each test delete all workspaces
        this.timeout(5000);
        Workspace.deleteAll().then((res)=>{
            console.log('');
            console.log('');
            console.log('');
            done();
        });
        done();
    });

  */


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
