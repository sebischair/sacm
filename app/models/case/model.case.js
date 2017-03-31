import mongoose from 'mongoose';
import ProcessDefinition from './model.processdefinition';
import Promise from 'bluebird';
const ObjectId = mongoose.Schema.Types.ObjectId;


const CaseSchema = new mongoose.Schema({
  name: String,
  caseDefintion: {type: ObjectId, ref: 'CaseDefintion'},
  state: {type: String, enum: ['available', 'enabled', 'active', 'completed', 'terminated']},
  statedates: {
    available: Date,
    enabled: Date,
    active: Date,
    completed: Date,
    terminated: Date
  },
  __v: { type: Number, select: false}
});




let Case = mongoose.model('Case', CaseSchema)


export default Case;