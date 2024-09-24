// AES-salauksen avaimen luonti
export async function generateKey() {
    return crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 128,
        },
        true, // Avain on exportattavissa
        ["encrypt", "decrypt"] // sekä salaus että purku
    );
}

// Salataan tiedot
export async function encryptData(key, data) {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Alustusvektori (IV)
    const encodedData = encoder.encode(JSON.stringify(data));
    
    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encodedData
    );
    
    return { encryptedData, iv };
}

// Puretaan tiedot
export async function decryptData(key, encryptedData, iv) {
    const decryptedData = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encryptedData
    );
    
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedData));
}