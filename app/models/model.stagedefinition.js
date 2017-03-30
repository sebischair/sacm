import mongoose from 'mongoose';
import ProcessDefinition from './model.processdefinition';


var options = {discriminatorKey: 'type'};

const StageDefinitionSchema = new mongoose.Schema({

}, options);

StageDefinitionSchema.statics.findSubById = processId=>{
  return StageDefinition.find({parent:processId});
}



let StageDefinition = ProcessDefinition.discriminator('StageDefinition', StageDefinitionSchema);

export default  StageDefinition;