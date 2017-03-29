'use strict';
//import xml2js from 'xml2js-es6-promise';
import fs from 'fs';
import Promise from 'bluebird';
var xml2js = Promise.promisifyAll(require('xml2js'));


module.exports = class XMLImporter {
    
    constructor() {
    }

    import(){
        const file = fs.readFileSync('./importer/barcelona.cs3.xml').toString();
        console.log(file);
        xml2js.parseStringAsync(file)
            .then(json=>{
                console.log('parsed');
                console.log(JSON.stringify(json))
            })
            .catch(err=>{
                console.log(err);
            });
        console.log('hallo');
    }
}