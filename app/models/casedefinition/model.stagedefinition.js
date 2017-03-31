import mongoose from 'mongoose';
import ProcessDefinition from './model.processdefinition';



const StageDefinitionSchema = new mongoose.Schema({
  
},{discriminatorKey: 'type'});

StageDefinitionSchema.statics.findSubById = processId=>{
  return StageDefinition.find({parent:processId});
}



let StageDefinition = ProcessDefinition.discriminator('StageDefinition', StageDefinitionSchema);
export default  StageDefinition;