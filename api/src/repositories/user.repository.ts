import { query } from "../config/db";
import { CreateUserSchemaType } from "../schemas/user.schema";
import { User } from "../types/user.type";

const findUserByEmail = async (email: string): Promise<User | null> => {
    const getUserSql = `
        SELECT * FROM users WHERE email = $1
    `
    const users = await query(getUserSql, [email])
    return users.rows[0] || null
}

const createUser = async (user: CreateUserSchemaType) => {
    /*sql*/
    const insertUserSql = `
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING email, role, created_at
    `

    const result = await query(insertUserSql, [user.email, user.password])
    return result.rows[0]

}

const loginUser = async (user: CreateUserSchemaType): Promise<User> => {
    const getUserSql = `
        SELECT email, role, password_hash FROM users WHERE email = $1
    `
    const users = await query(getUserSql, [user.email])

    return users.rows[0] || null


}

export const userRepository = {
    createUser,
    findUserByEmail
}
