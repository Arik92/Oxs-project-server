const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("./models/user.js").User;
const cfg = require("./config.js");
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
    secretOrKey: cfg.jwtSecret,
    // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer")    
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}; // passport strategy receives 2 params: our jwt secret from config file, and the jwt token sent with request header

module.exports = () => {
    const strategy = new Strategy(params, (payload, done) => {
        try {
            User.findById(payload.id, (err, result) => {
                if (result) {
                    //success! User was found by the jwt id encoded with our secret, so he is authenticated
                    return done(null, {
                        userId: result._id
                    });                
                } else {
                    console.log('strategy error', err);
                    return done(new Error("User unauthorized"), null);
                }
            });
            
        } catch(userError) {
            console.log('strategy error? ', userError);
            return done(new Error(userError), null);
        }
       
    });
    passport.use(strategy);
    return {
        initialize: () => {
            return passport.initialize();
        },
        authenticate: () => {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};