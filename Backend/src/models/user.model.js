import mongoose from "mongoose";
import bcrypt from 'bcrypt';


const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        min: 3,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type:String,
        required: true,
    },
    todolist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todo"
    }]
},{
    timestamps: true
})

userSchema.pre("save", async function(){
    if(!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}


export const User = mongoose.model("User", userSchema)