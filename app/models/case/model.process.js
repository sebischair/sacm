import mongoose from 'mongoose';
import Promise from 'bluebird';
const ObjectId = mongoose.Schema.Types.ObjectId;


const ProcessSchema = new mongoose.Schema({
  name: String,
  label: String,
  case: {type: ObjectId, ref: 'Case'},
  processDefinition: {type: ObjectId, ref: 'ProcessDefintion'},
  state: {type: String, enum: ['available', 'enabled', 'active', 'completed', 'terminated']},
  statedates: {
    available: Date,
    enabled: Date,
    active: Date,
    completed: Date,
    terminated: Date
  },
  __v: { type: Number, select: false}
},{discriminatorKey: 'type'});




let Process = mongoose.model('Process', ProcessSchema)


export default Process;