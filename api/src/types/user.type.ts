interface UserPayload {
    email: string;
    password: string;
}

interface User {
    email: string;
    role: string;
    password_hash: string
}

export {
    UserPayload,
    User
}