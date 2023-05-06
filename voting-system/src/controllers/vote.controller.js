const Vote = require("../models/vote");

const controller = {
  //Add attributes for the controller
};

controller.vote = async (req, res, next) => {
    try {
        const vote = req.body;
        vote.ip = req.ip;
        const result = await Vote.create(vote);
        res.status(200).json({
            message: "Voto registrado",
            value: result
        });
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
}

module.exports = controller;
