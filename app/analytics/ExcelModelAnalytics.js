'use strict';
import Promise from 'bluebird';
import winston from 'winston';
import Excel from 'exceljs';
import sizeof from 'object-sizeof';
import fs from 'fs-extra';
import ModelAnalytics from './ModelAnalytics';
const {gzip, ungzip} = require('node-gzip');

module.exports = class ExcelModelAnalytics extends ModelAnalytics{

 

  static async postAnalytics(){
    console.log('kk')
    let commits = await this.readJSON('modelanalytics1532556405202.plain.json.gz');
    console.log(commits.length);
    commits = commits.reverse();
    let cases = new Set(this.translationMap().values());    
    //cases.forEach(c => {
      let c = 'GCS2';
      console.log('Analyzing case: '+c);
      let filteredCommits = [];
      let lastFiles = null;
      commits.forEach(commit=>{
        let filteredCommit = JSON.parse(JSON.stringify(commit));
        filteredCommit.files = [];
        commit.files.forEach(file=>{
          if(file.case == c)
            filteredCommit.files.push(file);
        })
        if(filteredCommit.files.length > 0 && JSON.stringify(filteredCommit.files) != lastFiles){
          filteredCommits.push(filteredCommit);
          lastFiles = JSON.stringify(filteredCommit.files);
        }
      });
      this.saveAsExcel(filteredCommits, 'analytics.'+c);
      
   // });


  }
 


  static async readJSON(filename){
    try{
      console.log('read JSON');
      return JSON.parse((await ungzip(await fs.readFile(filename))).toString());
    }catch(e){
      console.log(e)
    }
  }

  

 

}




