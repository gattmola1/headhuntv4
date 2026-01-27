export function checkAdmin(req) {
    // req.headers is a plain object in Node/Express/Vercel functions
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];
    return token === process.env.ADMIN_PASSWORD;
}
