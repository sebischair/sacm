import express from 'express';
import Entity from './../../models/case/model.entity';
const router = express.Router();



/**
 * @api {get} /entity/:id/deeplinks Get Entity with Deeplinks
 * @apiName GetEntity
 * @apiGroup Entity
 * @apiParam {String} id ID of the Entity
 * @apiSampleRequest /entity/:id/deeplinks
 * @apiSuccessExample {json} Success-Response:
 * {
 *     "id": "1m6iwf4o772x7",
 *     "workspace": "11lc2lth49deu",
 *     "description": null,
 *     "name": "Democase #1497338790142",
 *     "entityDefinition": {
 *         "id": "1p5cnxzl86uqo",
 *         "description": null,
 *         "name": "CaseData"
 *     },
 *     "parent": "x7g8htek0pzq",
 *     "attributes": [
 *         {
 *             "attributeTypeConstraints": {
 *                 "entityDefinition": "2vm7t0z83dw5",
 *                 "resourceType": "entities"
 *             },
 *             "values": [
 *                 {
 *                     "id": "1b9xf4i34zk3",
 *                     "workspace": "11lc2lth49deu",
 *                     "description": null,
 *                     "name": "Discharge #1497338790969",
 *                     "parent": "1m6iwf4o772x7",
 *                     "entityDefinition": {
 *                         "id": "2vm7t0z83dw5",
 *                         "description": null,
 *                         "name": "Discharge"
 *                     },
 *                     "attributes": [
 *                         {
 *                             "attributeTypeConstraints": {},
 *                             "values": [
 *                                 "some date"
 *                             ],
 *                             "isDerived": false,
 *                             "defaultValues": [],
 *                             "description": "Discharge Date",
 *                             "name": "date",
 *                             "attributeType": "string",
 *                             "multiplicity": "maximalOne",
 *                             "uiReference": null
 *                         },
 *                         {
 *                             "attributeTypeConstraints": {},
 *                             "values": [
 *                                 "some reason"
 *                             ],
 *                             "isDerived": false,
 *                             "defaultValues": [],
 *                             "description": "Reason",
 *                             "name": "reason",
 *                             "attributeType": "string",
 *                             "multiplicity": "maximalOne",
 *                             "uiReference": null
 *                         }
 *                     ],
 *                     "resourceType": "entities"
 *                 }
 *             ],
 *             "isDerived": false,
 *             "defaultValues": [],
 *             "description": "Discharge",
 *             "name": "Discharge",
 *             "attributeType": "link",
 *             "multiplicity": "maximalOne",
 *             "uiReference": null
 *         },
 *         {
 *             "attributeTypeConstraints": {
 *                 "groupType": {
 *                     "id": "1plars5bsfdm",
 *                     "name": "Barcelona-Hospital"
 *                 },
 *                 "resourceType": "users"
 *             },
 *             "values": [],
 *             "isDerived": false,
 *             "defaultValues": [],
 *             "description": "Patient",
 *             "name": "patient",
 *             "attributeType": "link",
 *             "multiplicity": "maximalOne",
 *             "uiReference": null
 *         },
 *         {
 *             "attributeTypeConstraints": {
 *                 "entityDefinition": "iuaaugfa3wbi",
 *                 "resourceType": "entities"
 *             },
 *             "values": [
 *                 {
 *                     "id": "be27vg44ego0",
 *                     "workspace": "11lc2lth49deu",
 *                     "description": null,
 *                     "name": "PhysicalActivityPrescription #1497338792378",
 *                     "parent": "1m6iwf4o772x7",
 *                     "entityDefinition": {
 *                         "id": "iuaaugfa3wbi",
 *                         "description": null,
 *                         "name": "PhysicalActivityPrescription"
 *                     },
 *                     "attributes": [
 *                         {
 *                             "attributeTypeConstraints": {},
 *                             "values": [
 *                                 "v1"
 *                             ],
 *                             "isDerived": false,
 *                             "defaultValues": [],
 *                             "description": "Start date",
 *                             "name": "phactp1",
 *                             "attributeType": "string",
 *                             "multiplicity": "maximalOne",
 *                             "uiReference": null
 *                         },
 *                         {
 *                             "attributeTypeConstraints": {},
 *                             "values": [
 *                                 "v2"
 *                             ],
 *                             "isDerived": false,
 *                             "defaultValues": [],
 *                             "description": "End date",
 *                             "name": "phactp2",
 *                             "attributeType": "string",
 *                             "multiplicity": "maximalOne",
 *                             "uiReference": null
 *                         }
 *                     ],
 *                     "resourceType": "entities"
 *                 }
 *             ],
 *             "isDerived": false,
 *             "defaultValues": [],
 *             "description": "PhysicalActivityPrescription",
 *             "name": "PhysicalActivityPrescription",
 *             "attributeType": "link",
 *             "multiplicity": "maximalOne",
 *             "uiReference": null
 *         },
 *         {
 *             "attributeTypeConstraints": {
 *                 "groupType": {
 *                     "id": "1plars5bsfdm",
 *                     "name": "Barcelona-Hospital"
 *                 },
 *                 "resourceType": "users"
 *             },
 *             "values": [],
 *             "isDerived": false,
 *             "defaultValues": [],
 *             "description": "Owner",
 *             "name": "Owner",
 *             "attributeType": "link",
 *             "multiplicity": "maximalOne",
 *             "uiReference": null
 *         },
 *         {
 *             "attributeTypeConstraints": {
 *                 "entityDefinition": "ga75nwvullk8",
 *                 "resourceType": "entities"
 *             },
 *             "values": [
 *                 {
 *                     "id": "1tf9os0svzef6",
 *                     "workspace": "11lc2lth49deu",
 *                     "description": null,
 *                     "name": "Lace #1497338790563",
 *                     "parent": "1m6iwf4o772x7",
 *                     "entityDefinition": {
 *                         "id": "ga75nwvullk8",
 *                         "description": null,
 *                         "name": "Lace"
 *                     },
 *                     "attributes": [
 *                         {
 *                             "attributeTypeConstraints": {
 *                                 "enumerationOptions": [
 *                                     {
 *                                         "description": "1 day",
 *                                         "value": "1"
 *                                     },
 *                                     {
 *                                         "description": "2 days",
 *                                         "value": "2"
 *                                     }
 *                                 ]
 *                             },
 *                             "values": [
 *                                 "2"
 *                             ],
 *                             "isDerived": false,
 *                             "defaultValues": [],
 *                             "description": "Length of Stay (including day of admission and discharge)",
 *                             "name": "lace1",
 *                             "attributeType": "enumeration",
 *                             "multiplicity": "maximalOne",
 *                             "uiReference": null
 *                         },
 *                         {
 *                             "attributeTypeConstraints": {
 *                                 "enumerationOptions": [
 *                                     {
 *                                         "description": "No",
 *                                         "value": "0"
 *                                     },
 *                                     {
 *                                         "description": "Yes",
 *                                         "value": "1"
 *                                     }
 *                                 ]
 *                             },
 *                             "values": [
 *                                 "0"
 *                             ],
 *                             "isDerived": false,
 *                             "defaultValues": [],
 *                             "description": "Was the patient admitted to hospital via the emergency department?",
 *                             "name": "lace2",
 *                             "attributeType": "enumeration",
 *                             "multiplicity": "maximalOne",
 *                             "uiReference": null
 *                         }
 *                     ],
 *                     "resourceType": "entities"
 *                 }
 *             ],
 *             "isDerived": false,
 *             "defaultValues": [],
 *             "description": "Lace",
 *             "name": "Lace",
 *             "attributeType": "link",
 *             "multiplicity": "maximalOne",
 *             "uiReference": null
 *         },
 *         {
 *             "attributeTypeConstraints": {
 *                 "entityDefinition": "16v02iz0qzkhq",
 *                 "resourceType": "entities"
 *             },
 *             "values": [
 *                 {
 *                     "id": "1lpw94y9od02o",
 *                     "workspace": "11lc2lth49deu",
 *                     "description": null,
 *                     "name": "Barthel #1497338791892",
 *                     "parent": "1m6iwf4o772x7",
 *                     "entityDefinition": {
 *                         "id": "16v02iz0qzkhq",
 *                         "description": null,
 *                         "name": "Barthel"
 *                     },
 *                     "attributes": [
 *                         {
 *                             "attributeTypeConstraints": {
 *                                 "enumerationOptions": [
 *                                     {
 *                                         "description": "unable",
 *                                         "value": "0"
 *                                     },
 *                                     {
 *                                         "description": "independent",
 *                                         "value": "10"
 *                                     }
 *                                 ]
 *                             },
 *                             "values": [
 *                                 "10"
 *                             ],
 *                             "isDerived": false,
 *                             "defaultValues": [],
 *                             "description": "FEEDING",
 *                             "name": "barthel1",
 *                             "attributeType": "enumeration",
 *                             "multiplicity": "maximalOne",
 *                             "uiReference": null
 *                         },
 *                         {
 *                             "attributeTypeConstraints": {
 *                                 "enumerationOptions": [
 *                                     {
 *                                         "description": "dependent",
 *                                         "value": "0"
 *                                     },
 *                                     {
 *                                         "description": "independent (or in shower)",
 *                                         "value": "5"
 *                                     }
 *                                 ]
 *                             },
 *                             "values": [
 *                                 "5"
 *                             ],
 *                             "isDerived": false,
 *                             "defaultValues": [],
 *                             "description": "BATHING",
 *                             "name": "barthel2",
 *                             "attributeType": "enumeration",
 *                             "multiplicity": "maximalOne",
 *                             "uiReference": null
 *                         }
 *                     ],
 *                     "resourceType": "entities"
 *                 }
 *             ],
 *             "isDerived": false,
 *             "defaultValues": [],
 *             "description": "Barthel",
 *             "name": "Barthel",
 *             "attributeType": "link",
 *             "multiplicity": "maximalOne",
 *             "uiReference": null
 *         }
 *     ],
 *     "resourceType": "entities"
 * }
 */
router.get('/:id/deeplinks', (req, res, next)=>{
  Entity.findDeepLinksById(req.jwt, req.params.id)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});


/**
 * @api {get} /entity/:id Get Entity
 * @apiName GetEntity
 * @apiGroup Entity
 * @apiParam {String} id ID of the Entity
 * @apiSampleRequest /entity/:id
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "id": "1m6iwf4o772x7",
 *     "workspace": "11lc2lth49deu",
 *     "description": null,
 *     "name": "Democase #1497338790142",
 *     "entityDefinition": {
 *         "id": "1p5cnxzl86uqo",
 *         "description": null,
 *         "name": "CaseData"
 *     },
 *     "parent": "x7g8htek0pzq",
 *     "attributes": [
 *         {
 *             "attributeTypeConstraints": {
 *                 "entityDefinition": "2vm7t0z83dw5",
 *                 "resourceType": "entities"
 *             },
 *             "values": [
 *                 {
 *                     "id": "1b9xf4i34zk3",
 *                     "name": "Discharge #1497338790969"
 *                 }
 *             ],
 *             "isDerived": false,
 *             "defaultValues": [],
 *             "description": "Discharge",
 *             "name": "Discharge",
 *             "attributeType": "link",
 *             "multiplicity": "maximalOne",
 *             "uiReference": null
 *         },
 *         {
 *             "attributeTypeConstraints": {
 *                 "groupType": {
 *                     "id": "1plars5bsfdm",
 *                     "name": "Barcelona-Hospital",
 *                 },
 *                 "resourceType": "users"
 *             },
 *             "values": [],
 *             "isDerived": false,
 *             "defaultValues": [],
 *             "description": "Patient",
 *             "name": "patient",
 *             "attributeType": "link",
 *             "multiplicity": "maximalOne",
 *             "uiReference": null
 *         },
 *         {
 *             "attributeTypeConstraints": {
 *                 "entityDefinition": "iuaaugfa3wbi",
 *                 "resourceType": "entities"
 *             },
 *             "values": [
 *                 {
 *                     "id": "be27vg44ego0",
 *                     "name": "PhysicalActivityPrescription #1497338792378"
 *                 }
 *             ],
 *             "isDerived": false,
 *             "defaultValues": [],
 *             "description": "PhysicalActivityPrescription",
 *             "name": "PhysicalActivityPrescription",
 *             "attributeType": "link",
 *             "multiplicity": "maximalOne",
 *             "uiReference": null
 *         },
 *         {
 *             "attributeTypeConstraints": {
 *                 "groupType": {
 *                     "id": "1plars5bsfdm",
 *                     "name": "Barcelona-Hospital",
 *                 },
 *                 "resourceType": "users"
 *             },
 *             "values": [],
 *             "isDerived": false,
 *             "defaultValues": [],
 *             "description": "Owner",
 *             "name": "Owner",
 *             "attributeType": "link",
 *             "multiplicity": "maximalOne",
 *             "uiReference": null
 *         },
 *         {
 *             "attributeTypeConstraints": {
 *                 "entityDefinition": "ga75nwvullk8",
 *                 "resourceType": "entities"
 *             },
 *             "values": [
 *                 {
 *                     "id": "1tf9os0svzef6",
 *                     "name": "Lace #1497338790563"
 *                 }
 *             ],
 *             "isDerived": false,
 *             "defaultValues": [],
 *             "description": "Lace",
 *             "name": "Lace",
 *             "attributeType": "link",
 *             "multiplicity": "maximalOne",
 *             "uiReference": null
 *         },
 *         {
 *             "attributeTypeConstraints": {
 *                 "entityDefinition": "16v02iz0qzkhq",
 *                 "resourceType": "entities"
 *             },
 *             "values": [
 *                 {
 *                     "id": "1lpw94y9od02o",
 *                     "name": "Barthel #1497338791892"
 *                 }
 *             ],
 *             "isDerived": false,
 *             "defaultValues": [],
 *             "description": "Barthel",
 *             "name": "Barthel",
 *             "attributeType": "link",
 *             "multiplicity": "maximalOne",
 *             "uiReference": null
 *         }
 *     ],
 *     "resourceType": "entities"
 * }
 */
router.get('/:id', (req, res, next)=>{
  Entity.findById(req.jwt, req.params.id)
    .then(c=>{
      res.status(200).send(c);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});



module.exports = router;
