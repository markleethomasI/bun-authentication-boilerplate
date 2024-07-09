import mongoose from 'mongoose'

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    tokens: {
        type: Array
    }
});

const User = mongoose.model('User', userSchema);

export default User