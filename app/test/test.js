import assert from "assert"; // node.js core module
import chai from "chai";
import chaiHttp from "chai-http";
import Workspace from '../models/model.workspace';
import server from "../../app";

let should = chai.should();
chai.use(chaiHttp);

//Our parent block
describe('Test Definitions', () => {
    beforeEach((done) => { //Before each test we empty the database
        Workspace.deleteAll().then((res)=>{
            console.log(res)
            done();
        });
    });


    /*
    * Test the /GET route
    */
    describe('/GET book', () => {
        it('it should GET all the books', (done) => {
          chai.request(server)
              .get('/casedefinition/432')
              .end((err, res) => {
                  res.should.have.status(200);
                done();
              });
        });
    });



});
