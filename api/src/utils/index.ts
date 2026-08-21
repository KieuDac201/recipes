import bcrypt from "bcrypt"

const salt = 10

const hashPassword = async (plainTextPassword: string) => {
  try {
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt)
    return hashedPassword
  } catch (error) {
    console.error("Error hashing password:", error)
    throw error
  }
}

const comparePassword = async (plainTextPassword: string, hash: string) => {
  try {
    const match = await bcrypt.compare(plainTextPassword, hash)
    return match
  } catch (error) {
    console.error("Error comparing passwords:", error)
    throw error
  }
}

export { hashPassword, comparePassword }
