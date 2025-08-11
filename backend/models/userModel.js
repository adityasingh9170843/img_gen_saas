import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    creditBalance: {
        type: Number,
        default: 5
    }
},
{
    timestamps: true
})

export const userModel = mongoose.models.user || mongoose.model("user", userSchema);
