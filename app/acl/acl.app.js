/*
import acl from 'acl';
import mongoose from 'mongoose';
import Doctor from './acl.doctor';
import express from 'express';

class ACL {

  constructor() {
    this.iacl = null;
  }

  setup() {


    try {
      var dbc = mongoose.connect('mongodb://localhost:27017/sacm');
      dbc = dbc.connection;
    } catch(e) {

      var dbc = mongoose.connection;
    }


    //var db = express().mongoose.connection;
    var iacl = new acl(new acl.mongodbBackend(dbc.db));
    this.iacl = iacl;
  }

  init() {
    if(this.iacl == null) {
      this.setup();
    }
    new Doctor(this.iacl).init();
  }


  getACL() {
    if(this.iacl == null) {
      this.setup();
    }
    return this.iacl;
  }
}

export let sacm_acl = new ACL();
*/
