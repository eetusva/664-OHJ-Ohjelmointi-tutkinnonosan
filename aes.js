async function luoAvain() {
    const avain = await crypto.subtle.generateKey(
        {
            nimi: "AES-GCM",
            pituus: 128, // Avaimen pituus
        },
        true, // exportattava avain
        ["encrypt", "decrypt"]
    );
    hashAvain(avain).then(hash => console.log(hash));
    return avain;
}

async function salattavatTiedot(tiedot) {

    const avain = await luoAvain(); // Luo AES-avain
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(tiedot);    
    
    // Initaalinen satunnainen IV (initialization vector) tarvitaan AES-GCM:ssa
    const iv = crypto.getRandomValues(new Uint8Array(12)); 
    
    const encryptedData = await crypto.subtle.encrypt(
        {
            nimi: "AES-GCM",
            iv: iv, // initial vector
        },
        avain, // CryptoKey-objekti
        encodedMessage // Salattava viesti
    );

    return { encryptedData, iv }; // Palautetaan sekä salattu data että iv
}

async function puraTiedot(avain, salattuData, iv) {
    const purettavaData = await crypto.subtle.decrypt(
        {
            nimi: "AES-GCM",
            iv: iv, // Sama iv kuin salauksessa
        },
        avain, // CryptoKey-objekti
        salattuData
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(purettavaData);
}

export async function runAES(toiminto, tiedot, avain) {
    

    if (toiminto == 'salaa') {    
        // Salaa viesti
        const { encryptedData, iv } = await salattavatTiedot(tiedot);
        console.log("Salatut tiedot:", new Uint8Array(encryptedData));
    } else if (toiminto == 'pura') {
        // Pura viesti
        const { encryptedData, iv } = await salattavatTiedot(tiedot);
        const decryptedMessage = await puraTiedot(avain, encryptedData, iv);
        console.log("Puretut tiedot:", decryptedMessage);
    }
}

async function hashAvain(avain) {
    const encoder = new TextEncoder(); // Tekstinkoodaus UTF-8 muotoon
    const data = encoder.encode(avain);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Hajautus
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Muutetaan tavut taulukoksi
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex; // Palautetaan heksadesimaalinen hajautus
}
