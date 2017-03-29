import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.Promise = Promise;



const CaseDefinitionSchema = new mongoose.Schema({
  name: String,
});

let CaseDefinition = mongoose.model('CaseDefinition', CaseDefinitionSchema)


export default CaseDefinition;