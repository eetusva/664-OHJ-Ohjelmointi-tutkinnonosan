export function avaaTietokanta() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open('Kilpailijatietokanta', 1);
        
        request.onupgradeneeded = (event) => {
            let db = event.target.result;
            db.createObjectStore('Kilpailijat', { keyPath: 'id', autoIncrement: true });
        };
        
        request.onsuccess = (event) => {
            let db = event.target.result;
            console.log("Tietokanta on avattu onnistuneesti!");
            resolve(db);
        };

        request.onerror = (event) => {
            console.error("Tietokannan avaaminen epäonnistui", event);
            reject(event);
        };
    });
}