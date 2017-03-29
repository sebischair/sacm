import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;



const CaseDefinitionSchema = new mongoose.Schema({
  name: String,
});

let CaseDefinition = mongoose.model('CaseDefinition', CaseDefinitionSchema)


export default CaseDefinition;