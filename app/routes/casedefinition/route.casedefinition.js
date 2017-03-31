import express from 'express';

var router = express.Router();

// Models
import CaseDefinition from './../../models/casedefinition/model.casedefinition';

// Middlewares
import Auth from './../../middlewares/middleware.auth';
import Authorizer from './../../middlewares/middleware.authorize';



router.get('/', (req, res, next)=>{
  CaseDefinition.find({})
    .then(cds=>{
        res.status(200).send(cds);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.get('/:id', (req, res, next)=>{
  CaseDefinition.findById(req.params.id)
    .then(cd=>{
        res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.delete('/:id', (req, res, next)=>{
  CaseDefinition.findById(req.params.id)
    .then(cd=>{
        console.log(cd);
        return cd.remove();
    })
    .then(()=>{
       res.status(200).send();
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

router.post(

  // Path
  '/',

  // Middleware
  [
    // Authentication
    Auth.authenticate(
    'useOAuth2', {
      session: false
    })
    ,

    // Authorization of general resources
    new Authorizer().authorizeResource('create'),

    // Authorization on instance level
    new Authorizer().authorizeInstance()
  ],

  // Controller
  (req, res, next)=>{
    new CaseDefinition({
      name: 'test case'
    }).save().then(cd=>{
      res.status(200).send(cd);
    })
    .catch(err=>{
      res.status(500).send(err);
    });
  }
);

router.get('/:id/tree', (req, res, next)=>{
  CaseDefinition.calcCaseDefTree(req.params.id)
    .then(t=>{
      res.status(200).send(t);
    })
    .catch(err=>{
      res.status(500).send(err);
    });
});


module.exports = router;
