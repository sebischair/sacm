import mongoose from 'mongoose';
import ProcessDefinition from './model.processdefinition';
const ObjectId = mongoose.Schema.Types.ObjectId;

var options = {discriminatorKey: 'type'};

const AutomatedTaskDefinitionSchema = new mongoose.Schema({
  param: [{isReadOnly: Boolean, attrDef: ObjectId}] 
}, options);



let AutomatedTaskDefinition = ProcessDefinition.discriminator('AutomatedTaskDefinition', AutomatedTaskDefinitionSchema);

export default  AutomatedTaskDefinition;