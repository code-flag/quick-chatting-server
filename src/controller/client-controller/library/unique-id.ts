
import crypto from 'crypto';

export const uniqueId = () => {
    const id = crypto.randomBytes(16).toString("hex");
    return id;
}
