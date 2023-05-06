const mongoose = require("mongoose");

const CandidateSchema = mongoose.Schema(
    {
        politicparty: {
            type: String,
            unique: true,
            required: true
        },
        president: {
            type: String,
            required: true
        },
        vicepresident: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("candidate", CandidateSchema);
