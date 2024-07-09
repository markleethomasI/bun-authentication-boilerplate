import mongoose from 'mongoose'

const companySchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: true
    },
    numbers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Number'
    }]

});


const Company = mongoose.model('Company', companySchema);

export default Company