import mongoose from 'mongoose';
import ProcessDefinition from './model.processdefinition';
const ObjectId = mongoose.Schema.Types.ObjectId;



const AutomatedTaskDefinitionSchema = new mongoose.Schema({
  param: [{isReadOnly: Boolean, attrDef: ObjectId}] 
},{discriminatorKey: 'type'});



let AutomatedTaskDefinition = ProcessDefinition.discriminator('AutomatedTaskDefinition', AutomatedTaskDefinitionSchema);

export default  AutomatedTaskDefinition;