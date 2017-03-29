import mongoose from 'mongoose';
import ProcessDefinition from './model.processdefinition';


var options = {discriminatorKey: 'type'};

const TaskDefinitionSchema = new mongoose.Schema({
  param: String,
}, options);




let TaskDefinition = ProcessDefinition.discriminator('TaskDefinition', TaskDefinitionSchema);

export default  TaskDefinition;