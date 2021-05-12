import express from 'express';
import http from "../../models/http";
import fs from "fs";
const router = express.Router();

const secret = fs.readFileSync('public.key.pem')+'';

router.post('/jwt', (req, res, next) => {

});

module.exports = router;
