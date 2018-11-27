const _applications = {
  SACMFRONTEND: 'SACM.FRONTEND',
  UIM: 'UIM',
  SMS: 'SMS',
  POSTMAN: 'POSTMAN',
  NA: 'NA'
};

const _methods = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'];

const _resources = new Set(['import', 'workspaces', 'groups', 'users', 'entities', 'alerts', 'automatedtasks', 'cases', 'humantasks', 'dualtasks', 'logs', 'messages', 'processes', 'stages', 'summarysections', 'tasks', 'taskparams']);

export default {
  applications: _applications,
  methods: _methods,
  resources: _resources
};
