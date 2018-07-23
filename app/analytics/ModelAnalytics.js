'use strict';
import Promise from 'bluebird';
import winston from 'winston';
import find from 'find-promise';
import Excel from 'exceljs';
const fs = Promise.promisifyAll(require("fs"));
const xml2js = Promise.promisifyAll(require("xml2js"));
const repositoryPath = 'D:/Projekte/CONNECARE/Technical/repos/sacm.backend.analytics';
const Git = require('simple-git/promise')(repositoryPath);

module.exports = class ModelAnalytics{

  static translatePathToCS(filePath){
    let map = new Map();
    map.set('importer/studyrelease.case.barcelona.cs1.xml', 'BCS1');
    map.set('importer/studyrelease.case.barcelona.cs2.xml', 'BCS2');
    map.set('importer/studyrelease.case.groningen.cs1.xml', 'GCS1');
    map.set('importer/studyrelease.case.groningen.cs2.xml', 'GCS2');
    map.set('importer/studyrelease.case.israel.cs1.xml', 'ICS1');
    map.set('importer/studyrelease.case.israel.cs2.xml', 'ICS2');
    map.set('importer/studyrelease.case.leida.cs1.xml', 'LCS1');
    map.set('importer/studyrelease.case.leida.cs2.xml', 'LCS2');
    map.set('importer/studyrelease.case.isreal.cs1.xml', 'ICS1');
    map.set('importer/case.barcelona.cs1.xml', 'BCS1');
    map.set('importer/case.groningen.cs2.review.2.xml', 'GCS2');
    map.set('importer/case.groningen.cs2.review.xml', 'GCS2');
    map.set('importer/case.groningen.cs2.xml', 'GCS2');
    map.set('importer/case.israel.cs2.xml', 'ICS2');
    map.set('importer/case.leida.cs1.xml', 'ICS1');
    map.set('importer/case.leida.cs2.xml', 'LCS2');
    map.set('importer/cs1.barcelona.v1.xml', 'BCS1');
    map.set('importer/barcelona.cs3.xml', 'BCS2');
    map.set('importer/barcelona.cs3.xml', 'BCS2');

    for(let path of map.keys()){
      if(filePath.endsWith(path))
        return map.get(path);
    }
    return null;
  }

  static filterFiles(files){
    let matches = [];
    for(let file of files){
      file = file.replace(/\\/g,'/');
      if(this.translatePathToCS(file) != null)
        matches.push(file);
    }
    return matches;
  }

  static async analyzeRepository(){
    let ignoreList = new Set();
    ignoreList.add('0f26c2ce4af992b5c20b02038615831e8e6034ee'); //XML parse error, only GCS1 changed
    ignoreList.add('13c67d4a43bbb49911742f749331a2c4f1f2e89e'); //XML parse error, only GCS1 changed
    ignoreList.add('bc52e79647fcf4a4a1be15cb73d71733570ad951'); //XML parse error, only GCS1 changed
    ignoreList.add('26e74f4a2f3e1eb4bd948d7c86a63ae9407ea49d'); //XML parse error, only GCS1 changed
    ignoreList.add('545b884647d0c9d01897846298f19c60e9e53c25'); //XML parse error, only LCS2 changed
    ignoreList.add('46973c13092950d2dd6f03e65e2005a9a326bcee'); //XML parse error, only LCS1 changed
    ignoreList.add('e55993b6c71cd82a2b310633fd73fbb5f79bf5ce'); //XML parse error, only LCS1 changed
    ignoreList.add('9f7fa8fea07e2c9d0c6ba5bbee81993fffa3dd9e'); //XML parse error, only ICS2 changed
    ignoreList.add('f8dafe17979040ddcecd30f08488fb8ba2c99358'); //XML parse error, only BCS2 changed
    ignoreList.add('e48bcce27db754dec1e898c32c6f6919fda858d3'); //XML parse error, only LCS2 changed
    ignoreList.add('a4d7a99b71fa3aed60b72cdbe2ca87eacf346d55'); //XML parse error, only ICS2 changed
    ignoreList.add('9c9342b25bf24d1283418b953f4913533f211107'); //XML parse error, only ICS2 changed
    ignoreList.add('34c94578aece68e812bcb46fa57f3e6826cc4e8c'); //XML parse error, only ICS2 changed
    ignoreList.add('04079f41ac83377a02288f86f765f916853ccda0'); //XML parse error, only LCS2 changed
    ignoreList.add('cb02cc78aa800407208c516ca48bac02e96a440a'); //XML parse error, only LCS2 changed
    ignoreList.add('a3185a2048fb2537470a7d00eef111e5632bcb5f'); //XML parse error, only GCS2 changed
    ignoreList.add('b0239923afd8b87c5b2c339922ab2054c3c5dd50'); //XML parse error, only GCS2 changed
    ignoreList.add('e82963081c9a39d5d5add39102eedaf66173094e'); //XML parse error, only GCS2 changed
    ignoreList.add('0beb6a033c63d94c6feef640676f736b8f190c07'); //XML parse error, only GCS2 changed
    ignoreList.add('3d35582adb7641128fe8452f98cffd487be3d40d'); //XML parse error, only GCS2 changed
    ignoreList.add('bce43f31becdfac496ced89c103dff7978c4f0f2'); //XML parse error, only GCS2 changed
    ignoreList.add('9c967c781239d0777fee67c9880627c617454d02'); //XML parse error, only LCS2 changed
    ignoreList.add('592f70608e15768d4c9bc04236afb663330258bf'); //XML parse error
    ignoreList.add('c907ea76f7b57cf4ba4ee93971e65678ad3df7f1'); //XML parse error
    ignoreList.add('976cb74f910d391578683e1c7ba9ab7cb791d0b9'); //XML parse error
    ignoreList.add('c70c8d442b05f978b347e4b943f04004f141f4a0'); //XML parse error
    ignoreList.add('eb30a1907fd4accd879da563de865db6e3cd0f36'); //XML parse error
    ignoreList.add('b4f64553b5caa6ea9d5a0ddbe4218fa8e62aa0d7'); //XML parse error
    ignoreList.add('16a48af65f8ad4d3efaf35c5a2f947aedec1d4f4'); //XML parse error
    ignoreList.add('c87229c7f7fd0d3f3742afcf93279d2b42339898'); //XML parse error
    ignoreList.add('09c917e8742d84dd3fc15a9a4da74b3c33ff252e'); //XML parse error
    ignoreList.add('2f661cf3dfda46fd70189d811c3e26eba7f99183'); //XML parse error
    ignoreList.add('d7e2908aafbb2db64539864633cf4f132fa0bd47'); //XML parse error
    ignoreList.add('a2ff6d707ea1d4071aa6b8c2db68197370cca96e'); //XML parse error
    ignoreList.add('d7a7833acf41de2c23670042443d9d058af1198c'); //XML parse error
    ignoreList.add('9ff7a4292c5f73a0a8ac726b0acb1335b816cef5'); //XML parse error
    ignoreList.add('e454a79aa60efbf64df6fc7306a59cb6363b39a6'); //XML parse error
    ignoreList.add('a0e91d291b182b05881add6f394d4f87327e3c26'); //XML parse error
    ignoreList.add('c5c24fdf1294eeac98ff4ac89be2ae175947c262'); //XML parse error
    ignoreList.add('50c06420daefd40bb0a8539d5e64d5c2d344f5d0'); //XML parse error
    ignoreList.add('f3bfcee27ee701366497581e3b4592571730f141'); //XML parse error
    ignoreList.add('05daec662ffa719285289f3e179cf3cd5ca4dce2'); //XML parse error
    ignoreList.add('0acc4099c6bf99b53d392865d0c7ddaac971388f'); //XML parse error
    ignoreList.add('54c3c518fefda064ae453026b56ad624e8b5efbe'); //XML parse error
    ignoreList.add('de98d0d9cd27416b98a5e358eb62aefd9f6a9165'); //XML parse error
    ignoreList.add('b5795549ddc96199187c4a575fa28ee8a15788fd'); //XML parse error
    ignoreList.add('a24c64eb1ccce6870da553468bac7d4608d8f035'); //XML parse error
    ignoreList.add('6ff4c476e9d6dbfc9da96a17eeccfddde5357241'); //XML parse error
    ignoreList.add('10532705d782d88024feef30bf4c20308f91bf34'); //XML parse error
    ignoreList.add('176f83100c6039e14ba2634c9e138439572f4d30'); //XML parse error
    ignoreList.add('45ebb83043aeea6c334ea93c168a543dc9bbd22e'); //XML parse error
    ignoreList.add('f84d6c06077ef4b61b4fdb9e68f35f889e669fad'); //XML parse error
    ignoreList.add('82bfb1a08c4d06eb94771d308f59709aee8c6fae'); //XML parse error
    ignoreList.add('053f706d6781d65444e74f3201740baeed8fa822'); //XML parse error
    ignoreList.add('804e36111ad6b1432075fc1dafa9fa5bc432339e'); //XML parse error
    ignoreList.add('01fba4e95f5a6a27069440a9c2a59e247714b9ef'); //XML parse error
    ignoreList.add('94cbacc7d2ba3922188d81a3a81508b68cadb148'); //XML parse error
    ignoreList.add('33e52683b457fc47f492dd15fdcf4841069594c3'); //XML parse error
    ignoreList.add('f27c00d3db2fe220908c078467c4ff897bd39410'); //XML parse error
    ignoreList.add('fb764ee2916789b9f29f115e4fd516eea8154792'); //XML parse error
    ignoreList.add('57b3f20092230710181573c46d7d53aa74f7c0e6'); //XML parse error
    ignoreList.add('e4592c6e6661d68581e89ff8c5498424fa324fe0'); //XML parse error
    ignoreList.add('a376e22a47aef9c3bb00833ff8e87c33d692dc43'); //XML parse error
    ignoreList.add('da48f272920aa58106b6ae1757bdbe7fa9be0669'); //XML parse error
    ignoreList.add('c3b506554580ff3f9462db3495168daff2070d49'); //XML parse error
    ignoreList.add('20ff415646708814815720a5b8f9894742d861a9'); //XML parse error
    ignoreList.add('4ea18cb55c8f292da1d9a56e8cf8432eac80df45'); //XML parse error
    ignoreList.add('510901cfa4ede6be7cfaabfa7dbd5b78595e30dc'); //XML parse error
    ignoreList.add('fa909d62f5e43b286b13ab4fa695f6ff62a6176b'); //XML parse error
    ignoreList.add('da1c9222a83b55401d9485c58ac165534c3ca633'); //XML parse error
    ignoreList.add('03ae66752da7b5199e1fd0e3ea80b3edd7df98d5'); //XML parse error
    ignoreList.add('840fdc921cd26a380e595de49297984d211045d0'); //XML parse error
    ignoreList.add('e429fde88c0259920af8ee98a1494991b4b05840'); //XML parse error
    ignoreList.add('5fca035ce7de46f49c19cd9bc3c18b248106e198'); //XML parse error
    ignoreList.add('6d57ac76f8650ef63ccab275af84aff5577f4e5b'); //XML parse error
    ignoreList.add('039010c58fd8f43b17f869c468db48feb63645c2'); //XML parse error
    ignoreList.add('f0bc979acbbccd87f5816235a94c9cff3865ba36'); //XML parse error
    ignoreList.add('2f7eb67038bda2b176a6bb8cf83e5dc6fcdc1dac'); //XML parse error
    ignoreList.add('b37ecd01bcd11312383dafda4cec14bbc9e41886'); //XML parse error
    ignoreList.add('61656b8fecfa33fc913bb3f9ace891db3dff7dc9'); //XML parse error
    ignoreList.add('fbb5a307de645ec726b647f7a3df3099150c2775'); //XML parse error
    ignoreList.add('b1f54e68423c5c3be52388386906c914e7f40cc4'); //XML parse error
    ignoreList.add('6c1a7337efba75b0dffdf346e5e46009ba8308db'); //XML parse error
    ignoreList.add('45ebe1c68f94b243852cd4ad1b3f77e005019c24'); //XML parse error
    ignoreList.add('6f2311c998c8f8e2b7f628e6b1ff245def01db8f'); //XML parse error
    ignoreList.add('82200546156efc631e1ecd62fabb9c2e8768d395'); //XML parse error
    ignoreList.add('40ee23776810dba4ec10c09fbc0ad99f771f46fd'); //XML parse error
    ignoreList.add('55e10c05b1664bf0fc89a647c30a0b4ab687a20b'); //XML parse error
    ignoreList.add('e36efd69b5a3f065b72443ab88b18c41cd87da25'); //XML parse error
    ignoreList.add('bf9dfab6e34cc458b4afdec4294d22ba336d3e3b'); //XML parse error
    ignoreList.add('ca97cfe20a4a7ead1ab9bd5ff86d3b8b42d788a3'); //XML parse error
    ignoreList.add('d79d27db975ce0be1731d09b882c9ba684888c36'); //XML parse error
    ignoreList.add('67811f89fa0a225e0882f05301df2e7785ab6269'); //XML parse error
    ignoreList.add('fa83fa5e213bb31a4cbeb6bbec8f2329a9d838d1'); //XML parse error
    ignoreList.add('7d48fee1b770b383a4d54feb7a0be95418e979d5'); //XML parse error
    ignoreList.add('990519e62935d2e31ecdc0aeea814204a75b5629'); //XML parse error
    ignoreList.add('8bcd62072be4711c43b97bb2dc2e868dea1531af'); //XML parse error
    ignoreList.add('7d96f318cc89a87e8618319a77d118a546deecb5'); //XML parse error
    ignoreList.add('c3f7321a674ddcd191b76a2b360b4250d5e5a329'); //XML parse error

    let result = [];
   // try{
      await Git.checkout(['master']);
      console.log('git checkout master completed')
      let data = await Git.log(['-m', '--after', '2017-10-04', '--follow', '*.xml']);
      console.log('git log completed - '+data.all.length + ' matching commits!')
      let allFilePaths = new Set();
      //let isStarted = false;
      for(let i=0; i<data.all.length; i++){
        
        let c = data.all[i];
        /*
        if(c.hash == 'e6110f59afd7d8e1a4efd7c9af5fa3397f149ab6')
          isStarted = true;
        if(!isStarted)
          continue;
          */
        if(ignoreList.has(c.hash))
          continue;

        await Git.checkout([c.hash]);
        console.log('\n'+(i+1)+'/'+data.all.length +' checkout '+c.hash+' completed! ');
        console.log('---Message: '+c.message)
        console.log('---Date: '+c.date)
        console.log('---Author Name: '+c.author_name)
        let findPath = repositoryPath;
        if(await fs.exists(repositoryPath+'/app'))  
          findPath +='/app';
        let files = await find.file(/\.xml$/, findPath);
        
        if(files)
          for(let f of files)
            allFilePaths.add(f.replace(/\\/g,'/').replace(repositoryPath,''));

        files = this.filterFiles(files);
        console.log('---found '+files.length+' files!');
        let commitResult = {
          hash: c.hash,
          date: c.date,
          message: c.message,
          authorName: c.author_name,
          authorEmail: c.author_email,
          files: []
        };
        for(let file of files){
          console.log('---analyze  ...'+file.replace(repositoryPath,'')) 
          commitResult.files.push({
            file: file.replace(repositoryPath,''),
            case: this.translatePathToCS(file),
            result: await this.analyzeFile(file)
          });
        }
        result.push(commitResult);
        //if(i==100)
         // break;
        
      }
      console.log('\nSet of all repository file names:');
      console.log(allFilePaths)

      await this.saveAsExcel(result);
    //}catch(e){
    //  console.log(e);
   // }    
    return result;
  }

  static async saveAsExcel(commits){
    var workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet('Analytics');
       
    worksheet.columns = [
      { key: 'commitHash', header: 'Hash', width:40},
      { key: 'commitDate', header: 'Date', width:25},
      { key: 'commitAuthorName', header: 'Author Name', width:5},
      { key: 'commitAuthorEmail', header: 'Author Email', width:5},
      { key: 'commitMessage', header: 'Message', width:10},
      { key: 'case', header: 'Case', width:6},
      { key: 'attributeDefinitionsNr', header: 'Nr', width:5},
      { key: 'attributeDefinitionsTypeLink', header: 'TypeLink', width:5},
      { key: 'attributeDefinitionsTypeLinkUser', header: 'TypeLinkUser', width:5},
      { key: 'attributeDefinitionsTypeLinkEntityDefinition', header: 'TypeLinkEntityDefinition', width:5},
      { key: 'attributeDefinitionsTypeNoType', header: 'TypeNoType', width:5},
      { key: 'attributeDefinitionsTypeString', header: 'TypeString', width:5},
      { key: 'attributeDefinitionsTypeLongText', header: 'TypeLongText', width:5},
      { key: 'attributeDefinitionsTypeBoolean', header: 'TypeBoolean', width:5},
      { key: 'attributeDefinitionsTypeNumber', header: 'TypeNumber', width:5},
      { key: 'attributeDefinitionsTypeNumberMin', header: 'TypeNumberMin', width:5},
      { key: 'attributeDefinitionsTypeNumberMax', header: 'TypeNumberMax', width:5},
      { key: 'attributeDefinitionsTypeEnumeration', header: 'TypeEnumeration', width:5},
      { key: 'attributeDefinitionsTypeEnumerationOptions', header: 'EnumerationOptions', width:5},
      { key: 'attributeDefinitionsTypeEnumerationOptionsAvg', header: 'EnumerationOptionsAvg', width:5},
      { key: 'attributeDefinitionsTypeDate', header: 'TypeDate', width:5},
      { key: 'attributeDefinitionsTypeDateBefore', header: 'TypeDateBefore', width:5},
      { key: 'attributeDefinitionsTypeDateAfter', header: 'TypeDateAfter', width:5},
      { key: 'attributeDefinitionsTypeJson', header: 'TypeJson', width:5},
      { key: 'attributeDefinitionsMultiplicityAny', header: 'MultiplicityAny', width:5},
      { key: 'attributeDefinitionsMultiplicityExactlyOne', header: 'MultiplicityExactlyOne', width:5},
      { key: 'attributeDefinitionsMultiplicityMaximalOne', header: 'MultiplicityMaximalOne', width:5},
      { key: 'attributeDefinitionsMultiplicityAtLeastOne', header: 'MultiplicityAtLeastOne', width:5},
      { key: 'attributeDefinitionsDefaultValues', header: 'DefaultValues', width:5},
      { key: 'attributeDefinitionsAdditionalDescription', header: 'AdditionalDescription', width:5},
      { key: 'attributeDefinitionsUiReference', header: 'UiReference', width:5},
      { key: 'attributeDefinitionsUiReferenceLineDiagram', header: 'UiReferenceLineDiagram', width:5},
      { key: 'attributeDefinitionsUiReferenceColors', header: 'UiReferenceColors', width:5},
      { key: 'attributeDefinitionsUiReferenceConditionalMultiplicity', header: 'UiReferenceConditionalMultiplicity', width:5},
      { key: 'attributeDefinitionsUiReferencePatientQuestionnaires', header: 'UiReferencePatientQuestionnaires', width:5},
      { key: 'attributeDefinitionsUiReferenceLink', header: 'UiReferenceLink', width:5},
      { key: 'attributeDefinitionsUiReferencePrivateLink', header: 'UiReferencePrivateLink', width:5},
      { key: 'attributeDefinitionsUiReferenceSvg', header: 'UiReferenceSvg', width:5},
    ]
    const fontTemplate = {
      color: { argb: 'FFFFFF' },
      size: 14,
      bold:true
    };
    const fontTemplate2 = {
      color: { argb: 'FFFFFF' }
    };
    const fillTemplate = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FF5733'}
    }
    worksheet.getRow(2).values = worksheet.getRow(1).values;
    worksheet.getRow(1).values = [];
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = 'Commit'
    worksheet.mergeCells('F1:AL1');
    worksheet.getCell('F1').value = 'AttributeDefinitions'
    worksheet.getRow(1).fill = fillTemplate;
    worksheet.getRow(1).font = fontTemplate;
    worksheet.getRow(2).fill = fillTemplate;
    worksheet.getRow(2).font = fontTemplate2;
    worksheet.getRow(2).alignment = { textRotation: 45 };
    worksheet.autoFilter = 'A2:AAA2';
    for(let commit of commits){
      for(let file of commit.files){

        let ad = null
        if(file.result && file.result.attributeDefinitions)
          ad = file.result.attributeDefinitions;

        worksheet.addRow({
          commitHash: commit.hash,
          commitDate: commit.date,
          commitAuthorName: commit.authorName,
          commitAuthorEmail: commit.authorEmail,
          commitMessage: commit.message,
          case: file.case,
          attributeDefinitionsNr: ad ? ad.nr : '',
          attributeDefinitionsTypeLink: ad ? ad.typeLink : '',
          attributeDefinitionsTypeLinkUser: ad ? ad.typeLinkUser : '',
          attributeDefinitionsTypeLinkEntityDefinition: ad ? ad.typeLinkEntityDefinition : '',
          attributeDefinitionsTypeNoType: ad ? ad.typeNoType : '',
          attributeDefinitionsTypeString: ad ? ad.typeString : '',
          attributeDefinitionsTypeLongText: ad ? ad.typeLongText : '',
          attributeDefinitionsTypeBoolean: ad ? ad.typeBoolean : '',
          attributeDefinitionsTypeNumber: ad ? ad.typeNumber : '',
          attributeDefinitionsTypeNumberMin: ad ? ad.typeNumberMin : '',
          attributeDefinitionsTypeNumberMax: ad ? ad.typeNumberMax : '',
          attributeDefinitionsTypeEnumeration: ad ? ad.typeEnumeration : '',
          attributeDefinitionsTypeEnumerationOptions: ad ? ad.typeEnumerationOptions : '',
          attributeDefinitionsTypeEnumerationOptionsAvg: ad ? ad.typeEnumerationOptionsAvg : '',
          attributeDefinitionsTypeDate: ad ? ad.typeDate : '',
          attributeDefinitionsTypeDateBefore: ad ? ad.typeDateBefore : '',
          attributeDefinitionsTypeDateAfter: ad ? ad.typeDateAfter : '',
          attributeDefinitionsTypeJson: ad ? ad.typeJson : '',
          attributeDefinitionsMultiplicityAny: ad ? ad.multiplicityAny : '',
          attributeDefinitionsMultiplicityExactlyOne: ad ? ad.multiplicityExactlyOne : '',
          attributeDefinitionsMultiplicityMaximalOne: ad ? ad.multiplicityMaximalOne : '',
          attributeDefinitionsMultiplicityAtLeastOne: ad ? ad.multiplicityAtLeastOne : '',
          attributeDefinitionsDefaultValues: ad ? ad.defaultValues : '',
          attributeDefinitionsAdditionalDescription: ad ? ad.additionalDescription : '',
          attributeDefinitionsUiReference: ad ? ad.uiReference : '',
          attributeDefinitionsUiReferenceLineDiagram: ad ? ad.uiReferenceLineDiagram : '',
          attributeDefinitionsUiReferenceColors: ad ? ad.uiReferenceColors : '',
          attributeDefinitionsUiReferenceConditionalMultiplicity: ad ? ad.uiReferenceConditionalMultiplicity : '',
          attributeDefinitionsUiReferencePatientQuestionnaires: ad ? ad.uiReferencePatientQuestionnaires : '',
          attributeDefinitionsUiReferenceLink: ad ? ad.uiReferenceLink : '',
          attributeDefinitionsUiReferencePrivateLink: ad ? ad.uiReferencePrivateLink : '',
          attributeDefinitionsUiReferenceSvg: ad ? ad.uiReferenceSvg : '',
        })
      }
      let to = worksheet.lastRow._number;
      let from = to - (commit.files.length-1);
      worksheet.mergeCells('A'+from+':A'+to);
      worksheet.mergeCells('B'+from+':B'+to);
      worksheet.mergeCells('C'+from+':C'+to);
      worksheet.mergeCells('D'+from+':D'+to);
      worksheet.mergeCells('E'+from+':E'+to);
      worksheet.getCell('A'+from).alignment = {vertical:'middle'};
      worksheet.getCell('B'+from).alignment = {vertical:'middle'};
      worksheet.getCell('C'+from).alignment = {vertical:'middle'};
      worksheet.getCell('D'+from).alignment = {vertical:'middle'};
      worksheet.getCell('E'+from).alignment = {vertical:'middle', wrapText: true};
    }

    await workbook.xlsx.writeFile(new Date().getTime()+'.xlsx');
  }

  static async tryToAnalyzeFile(){
    return await this.analyzeFile('app/importer/studyrelease.case.groningen.cs2.xml');
  }

  static async analyzeFile(filePath){   
    let result = {};
    //try{
      //const filePath = 'app/importer/studyrelease.case.groningen.cs2.xml';
      const fileContent = fs.readFileSync(filePath).toString();
      console.log('a')
      const xml = await xml2js.parseStringAsync(fileContent, {explicitChildren:true, preserveChildrenOrder:true});  
      console.log('b')
      const Workspace =  xml.SACMDefinition.Workspace[0];
      console.log('c')
      result.attributeDefinitions = this.analyzeAttributeDefinitions(Workspace); 
      console.log('d')   
      result.derivedAttributeDefinitions = this.analyzeDerivedAttributeDefinitions(Workspace);
      console.log('e')
      result.entityDefinitions = this.analyzeEntityDefinitions(Workspace);
      console.log('f')      
      result.caseDefinition = this.analyzeCaseDefinition(Workspace);
      console.log('g')
      result.summarySectionDefinitions = this.analyzeSummarySectionDefinitions(Workspace);
      console.log('g')
      result.stageDefinitions = this.analyzeStageDefinitions(Workspace);
      console.log('h')
      result.humanTaskDefinitions = this.analyzeTaskDefinitions(Workspace, true, false, false);
      console.log('h')
      result.automatedTaskDefinitions = this.analyzeTaskDefinitions(Workspace, false, true, false);
      console.log('h')
      result.dualTaskDefinitions = this.analyzeTaskDefinitions(Workspace, false, false, true);
      console.log('h')
      result.actions = this.analyzeActionsExecution(xml.SACMDefinition.Execution);
      console.log('i')
   /*
    }catch(e){
      console.log(e);
    }*/
    return result;
  }


  static analyzeAttributeDefinitions(Workspace){
    let result = {
      nr:0,
      typeLink: 0,
      typeLinkUser: 0,
      typeLinkEntityDefinition: 0,
      typeNoType: 0,
      typeString: 0,
      typeLongText: 0,
      typeBoolean: 0,
      typeNumber: 0,
      typeNumberMin: 0,
      typeNumberMax: 0,
      typeEnumeration: 0,
      typeEnumerationOptions: 0,
      typeEnumerationOptionsAvg: 0,
      typeDate: 0,
      typeDateBefore: 0,
      typeDateAfter: 0,
      typeJson: 0,
      multiplicityAny: 0,
      multiplicityExactlyOne: 0,
      multiplicityMaximalOne: 0,
      multiplicityAtLeastOne: 0,
      defaultValues: 0,
      additionalDescription: 0,
      uiReference: 0,
      uiReferenceLineDiagram: 0,
      uiReferenceColors: 0,
      uiReferenceConditionalMultiplicity: 0,
      uiReferencePatientQuestionnaires: 0,
      uiReferenceLink: 0,
      uiReferencePrivateLink: 0,
      uiReferenceSvg: 0
    } 

    Workspace.EntityDefinition.forEach(ed => {
      if(ed.AttributeDefinition)
        ed.AttributeDefinition.forEach(ad=>{
          result.nr++;

          let type = 'notype'
          if(ad.$.type)
            type = ad.$.type.toLowerCase();
          if(type.startsWith('link')){
            result.typeLink++;
            if(type.startsWith('link.user'))
              result.typeLinkUser++;
            if(type.startsWith('link.entitydefinition'))
              result.typeLinkEntityDefinition++;
          }else if(type.startsWith('notype')){
            result.typeNoType++;
          }else if(type.startsWith('string')){
            result.typeString++;
          }else if(type.startsWith('longtext')){
            result.typeLongText++;
          }else if(type.startsWith('boolean')){
            result.typeBoolean++;
          }else if(type.startsWith('number')){
            result.typeNumber++;
            if(type.indexOf('min') != -1)
              result.typeNumberMin++;
            if(type.indexOf('max') != -1)
              result.typeNumberMax++;
          }else if(type.startsWith('enumeration')){
            result.typeEnumeration++;
            if(ad.EnumerationOption)
              result.typeEnumerationOptions += ad.EnumerationOption.length;
          }else if(type.startsWith('date')){
            result.typeDate++;
            if(type.indexOf('before') != -1)
              result.typeDateBefore++;
            if(type.indexOf('after') != -1)
              result.typeDateAfter++;
          }else if(type.startsWith('json')){
            result.typeJson++;
          }

          let multiplicity = ad.$.multiplicity;
          if(!multiplicity)
            multiplicity = 'any';
          multiplicity = multiplicity.toLowerCase();
          if(multiplicity == 'exactlyone'){
            result.multiplicityExactlyOne++;
          }else if(multiplicity == 'maximalone'){
            result.multiplicityMaximalOne++;
          }else if(multiplicity == 'atleastone'){
            result.multiplicityAtLeastOne++;
          }else if(multiplicity == 'any'){
            result.multiplicityAny++;
          }
          
          if(ad.$.defaultValues)
            result.defaultValues++;
          if(ad.$.additionalDescription)
            result.additionalDescription++;
            
          if(ad.$.uiReference){
            result.uiReference++;
            let uiReference = ad.$.uiReference.toLowerCase();
            if(uiReference.startsWith('colors'))
              result.uiReferenceColors++;
            if(uiReference.startsWith('conditonalmultiplicity'))
              result.uiReferenceConditionalMultiplicity++;
            if(uiReference.startsWith('patientquestionaires'))
              result.uiReferencePatientQuestionnaires++;
            if(uiReference.startsWith('link'))
              result.uiReferenceLink++;
            if(uiReference.startsWith('privatelink'))
              result.uiReferencePrivateLink++;
            if(uiReference.startsWith('linediagram'))
              result.uiReferenceLineDiagram++;
            if(uiReference.startsWith('svg'))
              result.uiReferenceSvg++;
          }
            
        });
    });
    
    if(result.typeEnumeration != 0)
      result.typeEnumerationOptionsAvg = result.typeEnumerationOptions/result.typeEnumeration;
    return result;
  }

  static analyzeDerivedAttributeDefinitions(Workspace){
    let result = {
      nr:0,
      explicitType: 0,            
      additionalDescription: 0,
      uiReference: 0,
      uiReferenceLineDiagram: 0,
      uiReferenceColors: 0,
      uiReferenceSvg: 0
    } 

    Workspace.EntityDefinition.forEach(ed => {
      if(ed.DerivedAttributeDefinition)
        ed.DerivedAttributeDefinition.forEach(ad=>{
          result.nr++;

          if(ad.$.explicitAttributeType)
            result.explicitType++;
          if(ad.$.additionalDescription)
            result.additionalDescription++;

          if(ad.$.uiReference){
            result.uiReference++;
            let uiReference = ad.$.uiReference.toLowerCase();
            if(uiReference.startsWith('colors'))
              result.uiReferenceColors++;
            if(uiReference.startsWith('linediagram'))
              result.uiReferenceLineDiagram++;
            if(uiReference.startsWith('svg'))
              result.uiReferenceLineSvg++;
          }
            
        });
    });
    return result;
  }

  static analyzeEntityDefinitions(Workspace){
    let result = {
      nr:0,
      avgNrAttributeDefinitions: 0,
      avgNrDerivedAttributeDefinitions: 0
    }     

    let helperSumAttributeDefinitions = 0;
    let helperSumDerivedAttributeDefinitions = 0;
    Workspace.EntityDefinition.forEach(ed => {
      result.nr++;
      if(ed.AttributeDefinition)
        helperSumAttributeDefinitions += ed.AttributeDefinition.length;
      if(ed.DerivedAttributeDefinition)
        helperSumDerivedAttributeDefinitions += ed.DerivedAttributeDefinition.length;
    });
    result.avgNrAttributeDefinitions = helperSumAttributeDefinitions/Workspace.EntityDefinition.length;
    result.avgNrDerivedAttributeDefinitions = helperSumDerivedAttributeDefinitions/Workspace.EntityDefinition.length;

    return result;
  }

  static analyzeCaseDefinition(Workspace){
    let result = {
      hasClientPath: false,
      hasOwnerPath: false,
      hasNewEntityDefinitionId: false,
      hasNewEntityAttachPath: false,
      hasNotesDefaultValue: false,
      hasOnAvailableHTTPHookURL: false,
      hasOnEnableHttpHTTPHookURL: false,
      hasOnActivateHTTPHookURL: false,
      hasOnCompleteHTTPHookURL: false,
      hasOnTerminateHTTPHookURL: false,
      hasOnDeleteHTTPHookURL: false
    };

    let CaseDefinition = Workspace.CaseDefinition[0];
    if(CaseDefinition.$.clientPath)
      result.hasClientPath = true;
    if(CaseDefinition.$.ownerPath)
      result.hasOwnerPath = true;
    if(CaseDefinition.$.clientPath)
      result.hasClientPath = true;
    if(CaseDefinition.$.newEntityDefinitionId)
      result.hasNewEntityDefinitionId = true;
    if(CaseDefinition.$.newEntityAttachPath)
      result.hasNewEntityAttachPath = true;
    if(CaseDefinition.$.notesDefaultValue)
      result.hasNotesDefaultValue = true;

    if(CaseDefinition.$.onAvailableHTTPHookURL)
      result.hasOnAvailableHTTPHookURL = true;
    if(CaseDefinition.$.onEnableHttpHTTPHookURL)
      result.hasOnEnableHttpHTTPHookURL = true;
    if(CaseDefinition.$.onActivateHTTPHookURL)
      result.hasOnActivateHTTPHookURL = true;
    if(CaseDefinition.$.onCompleteHTTPHookURL)
      result.hasOnCompleteHTTPHookURL = true;
    if(CaseDefinition.$.onTerminateHTTPHookURL)
      result.hasOnTerminateHTTPHookURL = true;
    if(CaseDefinition.$.onDeleteHTTPHookURL)
      result.hasOnDeleteHTTPHookURL = true;
    
    return result;
  }

  static analyzeSummarySectionDefinitions(Workspace){
    let result = {
      nr: 0,
      avgNrSummaryParamDefinitions: 0,
      positionLeft: 0,
      positionCenter: 0,
      positionRight: 0,
      positionStretched: 0
    };
    let helperSumSummaryParamDefinitions = 0;

    let CaseDefinition = Workspace.CaseDefinition[0];
    
    if(!CaseDefinition.SummarySectionDefinition)
      return result;

    CaseDefinition.SummarySectionDefinition.forEach(ssd => {
      result.nr++;
      if(ssd.$.position == 'LEFT')
        result.positionLeft++;
      if(ssd.$.position == 'CENTER')
        result.positionCenter++;  
      if(ssd.$.position == 'RIGHT')
        result.positionRight++;
      if(ssd.$.position == 'STRETCHED')
        result.positionStretched++;
      if(ssd.SummaryParamDefinition)
        helperSumSummaryParamDefinitions += ssd.SummaryParamDefinition.length;
    });

    if(helperSumSummaryParamDefinitions != 0)
      result.avgNrSummaryParamDefinitions = helperSumSummaryParamDefinitions / result.nr;

    return result;
  }

  static analyzeStageDefinitions(Workspace){
    let result = {
      nr: 0,
      avgNrHumanTaskDefinitions: 0,
      avgNrAutomatedTaskDefinitions: 0,
      avgNrDualTaskDefinitions: 0
    }
    let helperSumHumanTaskDefinitions = 0;
    let helperSumAutomatedTaskDefinitions = 0;
    let helperSumDualTaskDefinitions = 0;

    let CaseDefinition = Workspace.CaseDefinition[0];

    CaseDefinition.StageDefinition.forEach(sd => {
      result.nr++;
      if(sd.HumanTaskDefinition)
        helperSumHumanTaskDefinitions += sd.HumanTaskDefinition.length;
      if(sd.AutomatedTaskDefinition)
        helperSumAutomatedTaskDefinitions += sd.AutomatedTaskDefinition.length;
      if(sd.DualTaskDefinition)
        helperSumDualTaskDefinitions += sd.DualTaskDefinition.length;
    });
    result.avgNrHumanTaskDefinitions = helperSumHumanTaskDefinitions/result.nr;
    result.avgNrAutomatedTaskDefinitions = helperSumAutomatedTaskDefinitions/result.nr;
    result.avgNrDualTaskDefinitions = helperSumDualTaskDefinitions/result.nr;

    return result;
  }


  static analyzeTaskDefinitions(Workspace, isHumanTaskDefinition, isAutomatedTaskDefinition, isDualTaskDefinition){
    let result = {
      nr: 0,                     
      ownerPath: 0,
      repeatableOnce: 0,
      repeatableSerial: 0,
      repeatableParallel: 0,
      isMandatory: 0,             
      activationAutomatic: 0,
      activationManual: 0,
      activationExpression: 0,
      manualActivationExpression: 0,                          
      newEntityDefinition: 0,
      newEntityAttachPath: 0,
      externalId: 0,
      dynamicDescriptionPath: 0,
      footnote: 0,
      avgNrTaskParamDefinitions: 0,
    }

    if(isHumanTaskDefinition){   
      result.dueDatePath = 0;
    }else if(isDualTaskDefinition){   
      result.dueDatePath = 0;
      result.automaticCompleteOnPath = 0;
    }else if(isAutomatedTaskDefinition){
      result.automaticCompleteOnPath = 0;
    }
    
    let helperSumTaskParamDefinitions = 0;
    let CaseDefinition = Workspace.CaseDefinition[0];
    CaseDefinition.StageDefinition.forEach(sd => {

      let TaskDefinition = null;
      if(isHumanTaskDefinition)
        TaskDefinition = sd.HumanTaskDefinition;
      if(isAutomatedTaskDefinition)
        TaskDefinition = sd.AutomatedTaskDefinition;
      if(isDualTaskDefinition)
        TaskDefinition = sd.DualTaskDefinition;
      
      if(TaskDefinition)
        TaskDefinition.forEach(td=>{
          result.nr++;
          if(td.TaskParamDefinition)
            helperSumTaskParamDefinitions += td.TaskParamDefinition.length;
          if(td.$.ownerPath)
            result.ownerPath++;
          
          if(td.$.repeatable == 'ONCE')
            result.repeatableOnce++;
          else if(td.$.repeatable == 'SERIAL')
            result.repeatableSerial++;
          else if(td.$.repeatable == 'PARALLEL')
            result.repeatableParallel++;
          else
            result.repeatableOnce++;
          

          if(td.$.isMandatory == 'true')
            result.repeatableOnce++;

          if(td.$.activation == 'AUTOMATIC')
            result.activationAutomatic++;
          else if(td.$.activation == 'MANUAL')
            result.activationManual++;
          else if(td.$.activation == 'EXPRESSION')
            result.activationExpression++;
          else
            result.activationAutomatic++;
          
          if(td.$.manualActivationExpression)
            result.manualActivationExpression++;

          if(td.$.entityDefinitionId)
            result.newEntityDefinition++;          
          if(td.$.entityAttachPath)
            result.newEntityAttachPath++;
          if(td.$.externalId)
            result.externalId++;
          if(td.$.dynamicDescriptionPath)
            result.dynamicDescriptionPath++;
          if(td.$.footnote)
            result.footnote++;
          
          if(isHumanTaskDefinition){  
            if(td.$.dueDatePath) 
              result.dueDatePath++;
          }else if(isDualTaskDefinition){   
            if(td.$.dueDatePath) 
              result.dueDatePath++;
            if(td.$.automaticCompleteOnPath) 
              result.automaticCompleteOnPath++;
          }else if(isAutomatedTaskDefinition){
            if(td.$.automaticCompleteOnPath) 
              result.automaticCompleteOnPath++;
          }
        });
    });

    if(result.nr != 0)
      result.avgNrTaskParamDefinitions = helperSumTaskParamDefinitions/result.nr;

    return result;
  }


  static analyzeActionsExecution(Execution){
    let result = {
      nr: 0,
      activateStage: 0,
      completeStage: 0,
      activateHumanTask: 0,
      activateDualTask: 0,
      completeHumanTask: 0,
      completeAutomatedTask: 0,
      completeDualTaskHumanPart: 0,
      completeDualTaskAutomatedPart: 0,
      correctHumanTask: 0,
      correctDualTaskHumanPart: 0,
      createAlert: 0,
      breakpoint: 0
    }
    if(!Execution || !Execution[0] || !Execution[0].Action)
      return result;
    Execution[0].Action.forEach(a => {
      result.nr++;
      if(a.$.id == 'ActivateStage')
        result.activateStage++;
      if(a.$.id == 'CompleteStage')
        result.completeStage++;
      if(a.$.id == 'ActivateHumanTask')
        result.activateHumanTask++;
      if(a.$.id == 'ActivateDualTask')
        result.activateDualTask++;
      if(a.$.id == 'CompleteHumanTask')
        result.completeHumanTask++;
      if(a.$.id == 'CompleteAutomatedTask')
        result.completeAutomatedTask++;
      if(a.$.id == 'CompleteDualTaskHumanPart')
        result.completeDualTaskHumanPart++;
      if(a.$.id == 'CompleteDualTaskAutomatedPart')
        result.completeDualTaskAutomatedPart++;
      if(a.$.id == 'CorrectHumanTask')
        result.correctHumanTask++;
      if(a.$.id == 'CorrectDualTaskHumanPart')
        result.correctDualTaskHumanPart++;
      if(a.$.id == 'CreateAlert')
        result.createAlert++;      
      if(a.$.breakpoint)
        result.breakpoint++;
    });

    return result;
  }

}




