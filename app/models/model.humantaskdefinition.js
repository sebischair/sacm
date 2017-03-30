import mongoose from 'mongoose';
import ProcessDefinition from './model.processdefinition';
const ObjectId = mongoose.Schema.Types.ObjectId;

var options = {discriminatorKey: 'type'};

const HumanTaskDefinitionSchema = new mongoose.Schema({
  owner: String,
  param: [{isReadOnly: Boolean, attrDef: ObjectId}] 
}, options);



let HumanTaskDefinition = ProcessDefinition.discriminator('HumanTaskDefinition', HumanTaskDefinitionSchema);

export default  HumanTaskDefinition;