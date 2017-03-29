import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;

var options = {discriminatorKey: 'type'};

const ProcessDefinitionSchema = new mongoose.Schema({
  caseDefinition: {type: ObjectId, ref: 'CaseDefinition'},
  name: String,
  isRepeatable: Boolean,
  isMandatory: Boolean,
  parent: {type: ObjectId, ref: 'ProcessDefintion'},
  preconditions: {type: ObjectId, ref: 'SentryDefinition'}
}, options);

ProcessDefinitionSchema.statics.findSubById = processId=>{
  return ProcessDefinition.find({parent:processId});
}

let ProcessDefinition = mongoose.model('ProcessDefinition', ProcessDefinitionSchema)
export default  ProcessDefinition;
