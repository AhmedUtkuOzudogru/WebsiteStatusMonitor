import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userID) => {
    const token = jwt.sign({id: userID}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    const options = {
        httpOnly: true,
        secure:process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7*24*60*60*1000,

    };
    res.cookie('token', token, options);
    return token;
};