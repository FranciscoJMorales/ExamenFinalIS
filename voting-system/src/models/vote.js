const mongoose = require("mongoose");

const VoteSchema = mongoose.Schema(
    {
        dpi: {
            type: String,
            unique: true,
            required: true
        },
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "candidate"
        },
        ip: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("vote", VoteSchema);
