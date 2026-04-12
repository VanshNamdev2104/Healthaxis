import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chat : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chat"
    },
    content : {
        type : String,
        required : true
    },
    summary : {
        type : String,
        required : true
    },
    role: {
        type: String,
        enum: ["human", "ai"],
        default: "human",
    }
}, {
    timestamps: true
})

const messageModel = mongoose.model("Message", messageSchema);
export default messageModel;