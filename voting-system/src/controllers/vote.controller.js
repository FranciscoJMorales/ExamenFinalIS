const Candidate = require("../models/candidate");
const Vote = require("../models/vote");
const Mongoose  = require("mongoose");

const { CommunicationProtocolEnum, DaprClient } = require("@dapr/dapr");

const protocol = (process.env.DAPR_PROTOCOL === "grpc")
    ? CommunicationProtocolEnum.GRPC
    : CommunicationProtocolEnum.HTTP

const host = process.env.DAPR_HOST ?? "localhost"

let port
switch (protocol) {
    case CommunicationProtocolEnum.HTTP: {
        port = process.env.DAPR_HTTP_PORT
        break
    }
    case CommunicationProtocolEnum.GRPC: {
        port = process.env.DAPR_GRPC_PORT
        break
    }
    default: {
        port = 3500
    }
}

const DAPR_STATE_STORE_NAME = "statestore"

const client = new DaprClient(host, port, protocol)

const controller = {
  //Add attributes for the controller
};

controller.vote = async (req, res, next) => {
    try {
        const status = await client.state.get(DAPR_STATE_STORE_NAME, "1")
        if (status.voting) {
            const vote = req.body;
            vote.ip = req.ip;
            const voteExists = await Vote.findOne({dpi: vote.dpi});
            if (voteExists) {
                vote.valid = false;
                const result = await Vote.create(vote);
                res.status(400).json({
                    message: "Voto no válido",
                    value: result
                });
            }
            else {
                vote.valid = true;
                const result = await Vote.create(vote);
                res.status(200).json({
                    message: "Voto registrado",
                    value: result
                });
            }
        }
        else {
            res.status(400).json("La votación no está abierta");
        }
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
}

controller.viewCandidates = async (req, res, next) => {
    try {
        const candidates = await Candidate.find({});
        res.status(200).json(candidates);
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
}

controller.getVoteReport = async (req, res, next) => {
    try {
        const status = await client.state.get(DAPR_STATE_STORE_NAME, "1")
        if (status.voting) {
            let result = {
                validVotes: [],
                notValidVotes: 0
            };
            const candidates = await Candidate.find({});
            for (let candidate of candidates) {
                let votes = await Vote.find({
                    candidate: Mongoose.Types.ObjectId(candidate._id),
                    valid: true
                })
                result.validVotes.push({
                    candidate: candidate,
                    votes: votes.length
                })
            }
            let notvalid = await Vote.find({valid: false});
            result.notValidVotes = notvalid.length;
            res.status(200).json(result);
        }
        else {
            res.status(400).json("La votación no está abierta");
        }
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
}

module.exports = controller;
