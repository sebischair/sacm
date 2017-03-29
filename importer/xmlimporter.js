'use strict';
import fs from 'fs';
import Promise from 'bluebird';
import xml2js from 'xml2js';
const xml = Promise.promisifyAll(xml2js);


module.exports = class XMLImporter {
    
    constructor() {
    }

    import(filePath){
        const xmlString = fs.readFileSync(filePath).toString();
        return new Promise((resolve, reject)=>{            
            xml.parseStringAsync(xmlString)
                .then(json=>{
                    console.log('parsed');
                    console.log(JSON.stringify(json));
                    resolve();
                })
                .catch(err=>{
                    reject(err);
                });
        });
    }
}