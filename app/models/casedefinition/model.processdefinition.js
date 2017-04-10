import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;



const ProcessDefinitionSchema = new mongoose.Schema({
  caseDefinition: {type: ObjectId, ref: 'CaseDefinition', required:true},
  name: {type: String, required: true},
  label: {type: String, select: true},
  isRepeatable: Boolean,
  isMandatory: Boolean,
  parent: {type: ObjectId, ref: 'ProcessDefintion'},
  preconditions: {type: ObjectId, ref: 'SentryDefinition'},
  __v: {type: Number, select: false}
},{discriminatorKey: 'type'});

ProcessDefinitionSchema.statics.findSubById = processId=>{
  return ProcessDefinition.find({parent:processId});
}

ProcessDefinitionSchema.statics.findByCaseDefinitionId = caseDefinitionId=>{
  return ProcessDefinition.find({caseDefinition:caseDefinitionId});
}

let ProcessDefinition = mongoose.model('ProcessDefinition', ProcessDefinitionSchema)
export default  ProcessDefinition;