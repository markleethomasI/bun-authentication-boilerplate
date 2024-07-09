import bcrypt from 'bcrypt'
import User from '../models/user.model'

type Salt = String | Error

const saltAndHashPassword = async (password: string) => {
    try {

        // Generate Hash
        const hash = await bcrypt.hash(password, 10)

        return hash

    } catch (e) {
        return e
    }

}

const comparePassword = async (email: string, password: string) => {
        // find user by email
        const user = await User.findOne({email}).exec() 

        // if no user then return false 
        if(user === null){
            return false
        }

        // User found check password
        const hashedPassword = user.password
        const isValid = await bcrypt.compare(password, hashedPassword)

        if(!isValid){
            return false
        }

        return true

}

export {
    saltAndHashPassword,
    comparePassword
}