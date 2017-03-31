import mongoose from 'mongoose';
import Promise from 'bluebird';
const ObjectId = mongoose.Schema.Types.ObjectId;


const ProcessSchema = new mongoose.Schema({
  name: {type: String, required: true},
  label: {type: String, required: true},
  case: {type: ObjectId, ref: 'Case', required:true},
  processDefinition: {type: ObjectId, ref: 'ProcessDefintion', required: true},
  state: {type: String, enum: ['available', 'enabled', 'active', 'completed', 'terminated'], required: true},
  statedates: {
    available: {type: Date, default: Date.now}
    enabled: Date,
    active: Date,
    completed: Date,
    terminated: Date
  },
  parent: {type: ObjectId, ref: 'Process'}
  __v: { type: Number, select: false}
},{discriminatorKey: 'type'});




let Process = mongoose.model('Process', ProcessSchema)


export default Process;