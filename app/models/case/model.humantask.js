import mongoose from 'mongoose';
import Process from './model.process';
const ObjectId = mongoose.Schema.Types.ObjectId;



const HumanTaskSchema = new mongoose.Schema({
  owner: String,
  param: []
},{discriminatorKey: 'type'});



let HumanTask = Process.discriminator('HumanTask', HumanTaskSchema);

export default  HumanTask;