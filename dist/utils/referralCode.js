import crypto from "crypto";
export const generateReferralCode = (userId) => {
    // Generate MD5 hash from user ID
    const hash = crypto.createHash("md5").update(userId).digest("hex");
    // Extract the first 8 characters of the hash
    const substring = hash.slice(0, 8);
    // Convert the substring to an integer
    const bitValue = parseInt(substring, 16);
    // Convert the integer to a base-36 string and ensure it's 4 characters long
    const base36Value = bitValue.toString(36);
    const referralCode = base36Value.slice(-4).padStart(4, '0').toUpperCase();
    return referralCode;
};
