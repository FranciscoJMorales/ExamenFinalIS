const Candidate = require("../models/candidate");
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

controller.createCandidate = async (req, res, next) => {
    try {
        const candidate = req.body;
        const result = await Candidate.create(candidate);
        res.status(200).json({
            message: "Candidato registrado",
            value: result
        });
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
}

controller.openCandidateRegister =  async (req, res, next) => {
  try {
    const status = { register: true, voting: false }
    const state = [
        {
            key: "1",
            value: status
        }
    ]

    // Save state into a state store
    await client.state.save(DAPR_STATE_STORE_NAME, state);
    res.status(200).json("Registro abierto");
  }
  catch (error) {
      res.status(500).json({
          error: error,
      });
  }
}

controller.closeCandidateRegister =  async (req, res, next) => {
    try {
        res.status(200).json("Candidato registrado");
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
}

controller.openVoting =  async (req, res, next) => {
    try {
        res.status(200).json("Candidato registrado");
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
}

controller.closeVoting =  async (req, res, next) => {
    try {
        res.status(200).json("Candidato registrado");
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
}

module.exports = controller;
