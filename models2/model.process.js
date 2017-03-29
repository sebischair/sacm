import mongoose from 'mongoose';
import Promise from 'bluebird';
const ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/sacm');


var options = {discriminatorKey: 'type'};

const ProcessSchema = new mongoose.Schema({
  name: String,
  isRepeatable: Boolean,
  isMandatory: Boolean,
}, options);
let Process = mongoose.model('Process', ProcessSchema)


const StageSchema = new mongoose.Schema({
  owner: String,
}, options);
let Stage = Process.discriminator('Stage', StageSchema);


module.exports = {
    Process,
    Stage
}