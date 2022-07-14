import passport from "passport";
import local from 'passport-local'
import { users } from './models/User.js'
import { createHash, isValidPassword } from './utils.js'

const LocalStrategy = local.Strategy

export const initializePassport = () => {
    passport.use(
        'register',
        new LocalStrategy(
            { passReqToCallback: true },
            async (req, username, password, done) => {
                try {
                    let user = await users.findOne({ username })
                    if (user) return done(null, false)
                    const newUser = {
                        username,
                        password: createHash(password),
                        email: req.body.email,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        address: req.body.address,
                        age: req.body.age
                    }
                    try {
                        let result = await users.create(newUser)
                        return done(null, result)
                    } catch(err) {
                        // console.log(err)
                        done(err)
                    }
                } catch(err) {
                    // console.log(err)
                    done(err)
                }
            }
        )
    )

    passport.use(
        'login',
        new LocalStrategy(
            async(username, password, done) => {
                try {
                    let user = await users.findOne({ username })
                    if (!user) return done(null, false, { message: "User does not exists"})
                    if (!isValidPassword(user, password)) return done(null, false, {message: "Invalid password"})
                    return done(null, user)
                } catch(err) {
                    done(err)
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
        users.findById(id, done)
    })
}