const User = require("../models/user");
const authService = require("../services/auth.service");

const controller = {
  //Add attributes for the controller
};

controller.login = async (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  const user = await User.findOne({ username: username });
  if (user) {
    user.comparePassword(password, async function (err, isMatch) {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err
        });
      } else {
        if (isMatch) {
          res.status(200).json({
            uuid: user._id,
            token: authService.sign({
              user: username
            }),
            expires_in: authService.passportConfig.expireTime * 1000,
            message: `Bienvenido ${username}. Su token caduca en ${
              authService.passportConfig.expireTime / 60
            } minutos`,
          });
        } else {
          res.status(401).json({
            status: 401,
            message: "Las credenciales son incorrectas",
          });
        }
      }
    });
  }
  else {
    res.status(401).json({
      status: 401,
      message: "Las credenciales son incorrectas",
    });
  }
}

controller.register =  async (req, res, next) => {
  try {
      const user = req.body;
      const result = await User.create(user);
      res.status(200).json({
        uuid: result._id,
        token: authService.sign({
          user: user.username
        }),
        expires_in: authService.passportConfig.expireTime * 1000,
        message: `Bienvenido ${user.username}. Su token caduca en ${
          authService.passportConfig.expireTime / 60
        } minutos`,
      });
  }
  catch (error) {
      res.status(500).json({
          error: error,
      });
  }
}

module.exports = controller;
