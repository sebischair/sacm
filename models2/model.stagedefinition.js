import mongoose from 'mongoose';
import ProcessDefinition from './model.processdefinition';


var options = {discriminatorKey: 'type'};

const StageDefinitionSchema = new mongoose.Schema({
  owner: String,
}, options);
let StageDefinition = ProcessDefinition.discriminator('StageDefinition', StageDefinitionSchema);


export default  StageDefinition;