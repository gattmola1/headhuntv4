export function checkAdmin(req) {
    const authHeader = req.headers.get('authorization') || req.headers['authorization'];
    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];
    return token === process.env.ADMIN_PASSWORD;
}
