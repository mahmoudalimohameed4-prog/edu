import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ msg: "token required" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // { id, email }

        next();
    } catch (error) {
        return res.status(401).json({ msg: "invalid token" });
    }
};