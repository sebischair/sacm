import mongoose from 'mongoose';
import ProcessDefinition from './model.processdefinition';
const ObjectId = mongoose.Schema.Types.ObjectId;



const HumanTaskDefinitionSchema = new mongoose.Schema({
  owner: String,
  param: [] 
},{discriminatorKey: 'type'});



let HumanTaskDefinition = ProcessDefinition.discriminator('HumanTaskDefinition', HumanTaskDefinitionSchema);

export default  HumanTaskDefinition;