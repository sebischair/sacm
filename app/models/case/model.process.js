import Promise from 'bluebird';
import http from '../http';
import Model from '../model';

export default class Process extends Model{

  static getResourceType(){
    return 'processes';
  }

  static findById(jwt, processId){
    return http.get(jwt, '/processes/'+processId);
  }
  
  static findByCaseId(jwt, caseId){
    return http.get(jwt, '/cases/'+caseId+'/processes');
  }

  static findAllByCaseId(jwt, caseId){
    return http.get(jwt, '/cases/'+caseId+'/processes/all');
  }

  static findByProcessDefinitionId(jwt, processDefinitionId){
    return http.get(jwt, '/processdefinitions/'+processDefinitionId+'/processes');
  }

  static findByStageId(jwt, stageId){
    return http.get(jwt, '/stages/'+stageId+'/processes');
  }

  static autocompleteOwner(jwt, processId){
    return http.get(jwt, '/processes/'+processId+'/owner/autocomplete');
  }

  static findByCaseQuery(jwt, caseId, query){
    return http.post(jwt, '/cases/'+caseId+'/processes/query', query);
  }

  static findByCaseQueryLast(jwt, caseId, query){
    return this.findByCaseQuery(jwt, caseId, query)
      .then(processes=>{
        console.log(process.length)
        if(processes.length == 0)
          return Promise.reject('No process for caseId: "'+caseId+'" and query: "'+JSON.stringify(query)+'" found');
        else 
          return Promise.resolve(processes[processes.length-1]);   
      });
  }
}
Process.STATE_AVAILABLE = 'AVAILABLE';
Process.STATE_ENABLED = 'ENABLED';
Process.STATE_ACTIVE = 'ACTIVE';
Process.STATE_COMPLETED = 'COMPLETED';
Process.STATE_TERMINATED = 'TERMINATED';

Process.POSSIBLEACTION_ACTIVATE = 'ACTIVATE';
Process.POSSIBLEACTION_DRAFT = 'DRAFT';
Process.POSSIBLEACTION_DRAFTHUMANPART = 'DRAFTHUMANPART';
Process.POSSIBLEACTION_DRAFTAUTOMATEDPART = 'DRAFTAUTOMATEDPART';
Process.POSSIBLEACTION_COMPLETE = 'COMPLETE';
Process.POSSIBLEACTION_COMPLETEHUMANPART = 'COMPLETEHUMANPART';
Process.POSSIBLEACTION_COMPLETEAUTOMATEDPART = 'COMPLETEAUTOMATEDPART';
Process.POSSIBLEACTION_TERMINATE = 'TERMINATED';
Process.POSSIBLEACTION_DELETE = 'DELETE';
Process.POSSIBLEACTION_CHANGEOWNER = 'CHANGEOWNER';
Process.POSSIBLEACTION_CHANGEDUEDATE = 'CHANGEDUEDATE';