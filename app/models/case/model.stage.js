import mongoose from 'mongoose';
import Promise from 'bluebird';
const ObjectId = mongoose.Schema.Types.ObjectId;


const StageSchema = new mongoose.Schema({

},{discriminatorKey: 'type'});




let Stage = mongoose.model('Stage', StageSchema)
export default Process;