import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;



const SentryDefinitionSchema = new mongoose.Schema({
  preProcesses: {type: ObjectId, ref: 'ProcessDefinition'},
  __v: { type: Number, select: false}
});

let SentryDefinition = mongoose.model('SentryDefinition', SentryDefinitionSchema)


export default SentryDefinition;