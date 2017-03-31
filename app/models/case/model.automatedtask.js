import mongoose from 'mongoose';
import Process from './model.process';
const ObjectId = mongoose.Schema.Types.ObjectId;



const AutomatedTaskSchema = new mongoose.Schema({
  param: [{isReadOnly: Boolean, attrDef: ObjectId}] 
},{discriminatorKey: 'type'});



let AutomatedTask = Process.discriminator('AutomatedTask', AutomatedTaskSchema);
export default  AutomatedTask;