import listEndpoints from "express-list-endpoints";
import apiRoutes from "../routes/route.app";

const _applications = {
  SACMFRONTEND: 'SACM.FRONTEND',
  UIM: 'UIM',
  SMS: 'SMS',
  POSTMAN: 'POSTMAN',
  NA: 'NA'
};

const _methods = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'];

const _resources = new Set(['import', 'workspaces', 'groups', 'users', 'entities', 'alerts', 'automatedtasks', 'cases', 'humantasks', 'dualtasks', 'logs', 'messages', 'processes', 'stages', 'summarysections', 'tasks', 'taskparams']);

const _routes = (function () {
  let routes = [];
  listEndpoints(apiRoutes()).forEach(endpoint => {
    if (routes.indexOf(endpoint.path) < 0)
      routes.push(endpoint.path);
  });
  return routes.sort().reverse().map(endpoint => endpoint.split('/'));
})();

export default {
  applications: _applications,
  methods: _methods,
  resources: _resources,
  routes: _routes
};
