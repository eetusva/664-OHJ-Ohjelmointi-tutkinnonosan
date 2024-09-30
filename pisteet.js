

export function paivitaPisteet(db, kilpailijaId, osumat, pisteet, napakympit) {
    return new Promise((resolve, reject) => {
        
        let transaction = db.transaction(['Kilpailijat'], 'readwrite');
        let objectStore = transaction.objectStore('Kilpailijat');
        
        // kilpailija ID:n perusteella
        let request = objectStore.get(kilpailijaId);
        
        request.onsuccess = function(event) {
            let kilpailija = request.result;
            
            if (!kilpailija) {
                reject(`Kilpailijaa ID:llä ${kilpailijaId} ei löytynyt.`);
                return;
            }
            
            // päivitetään pisteet
            kilpailija.osumat = (kilpailija.osumat || 0) + osumat;
            kilpailija.pisteet = (kilpailija.pisteet || 0) + pisteet;
            kilpailija.napakympit = (kilpailija.napakympit || 0) + napakympit;
            kilpailija.ammuttu = true;

            console.log('pisteet kilpailijalle:', kilpailija);
            
            // Tallenna päivitetyt pisteet
            let updateRequest = objectStore.put(kilpailija);
            
            updateRequest.onsuccess = function(event) {
                resolve(`Kilpailijan ${kilpailija.etunimi} ${kilpailija.sukunimi} pisteet ${pisteet} päivitetty!`);
            };
            
            updateRequest.onerror = function(event) {
                console.error("Pisteiden tallennus epäonnistui", event);
                reject('Pisteiden tallennus epäonnistui');
            };
        };
        
        request.onerror = function(event) {
            console.error("Kilpailijan haku epäonnistui", event);
            reject('Kilpailijan haku epäonnistui');
        };
    });
}