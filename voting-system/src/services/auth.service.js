// importa configuraciones
const JWT_SECRET_KEY = require('../config/jwt.conf');
const bcryptConf = require('../config/bcrypt.conf');
const passportConf = require('../config/passport.conf');

//importa modelos
var User = require('../models/user.js');

// importa passport y modulos passport-jwt
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcrypt');

// ExtractJwt se emplea para extraer el token con facilidad
let ExtractJwt = passportJWT.ExtractJwt;

let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET_KEY,
};

// Strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let userLevelStrategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {

    if(jwt_payload){
        console.log('PAYLOAD RECEIVED: ', jwt_payload);
        User.findOne({username: jwt_payload.user}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user.username);
            } else {
                return done(null, false);
            }
        });
    }
    console.error('no token provided');
    next(null, false);
});

// Strategy to check token
let checkStrategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('PAYLOAD RECIBIDO: ', jwt_payload);
    if (jwt_payload) {
        next(null, jwt_payload.user);
    } else {
        console.error('no token provided');
        next(null, false);
    }
});

//registra el servicio básico de autenticacion (usuario existe)
passport.use(passportConf.strategiesNames.userLevel, userLevelStrategy); // ( strategy name, strategy )
passport.use(passportConf.strategiesNames.check, checkStrategy); // ( strategy name, strategy )

let sign = (payload) => {
    return jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: passportConf.expireTime });
}

let hash = (content) => {
    return bcrypt.hashSync(content, bcryptConf.salt);
}

let compareHash = (content, hash) => {
    return bcrypt.compareSync(content, hash);
}

module.exports = {
    passport: passport,
    passportConfig: passportConf,
    sign: sign,
    hash: hash,
    compareHash: compareHash,
};
