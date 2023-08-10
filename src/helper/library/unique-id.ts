
import crypto from 'crypto';

export const uniqueId = (num = 16) => {
    const id = crypto.randomBytes(num).toString("hex");
    return id;
}
