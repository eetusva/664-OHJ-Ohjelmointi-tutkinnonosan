// Tekstin salaus Web Cryptography API (crypto.subtle)
async function salaaData(data, salasana) {
    // salasana Uint8Array-muotoon
    const enc = new TextEncoder();
    const salasanaData = enc.encode(salasana);

    // kryptinen avain
    const avain = await crypto.subtle.importKey(
        'raw',
        salasanaData,
        { nimi: 'AES-GCM' },
        false,
        ['encrypt']
    );

    //Uint8Array
    const dataPuskuri = enc.encode(data);
    //initVector + salaus
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const salattu = await crypto.subtle.encrypt(
        {nimi: 'AES-GCM',
        iv: iv},
        avain,
        dataPuskuri
    );

    return {iv:iv, salattuData: new Uint8Array(salattu)};
};

// salauksen purku
async function puraSalattuData(salattuData, salasana, iv) {
    const enc = new TextEncoder();
    const salasanaData = enc.encode(salasana);

    // kryptografinen avain
    const avain = await crypto.subtle.importKey(
        'raw',
        salasanaData,
        { nimi: 'AES-GCM' },
        false,
        ['decrypt']
    );

    // Pura kryptaus
    const purettu = await crypto.subtle.decrypt(
        { nimi: 'AES-GCM', iv: iv },
        avain,
        salattuData
    );

    // Muutetaan takaisin tekstiksi
    const dec = new TextDecoder();
    return dec.decode(purettu);
};

