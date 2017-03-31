import mongoose from 'mongoose';
import Promise from 'bluebird';
const ObjectId = mongoose.Schema.Types.ObjectId;


const CaseSchema = new mongoose.Schema({
  name: String,
  label: String,
  caseDefintion: {type: ObjectId, ref: 'CaseDefintion', required: true},
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