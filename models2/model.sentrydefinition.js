import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.Promise = Promise;



const SentryDefinitionSchema = new mongoose.Schema({
  preProcesses: {type: ObjectId, ref: 'ProcessDefinition'},
});

let SentryDefinition = mongoose.model('SentryDefinition', SentryDefinitionSchema)


export default SentryDefinition;