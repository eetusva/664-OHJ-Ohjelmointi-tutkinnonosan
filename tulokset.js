
document.addEventListener('DOMContentLoaded', () => {

    let kontti = document.createElement('div')
    kontti.className = 'kontti'
    

    let poyta = document.createElement('table');
    poyta.className = 'tulokset';
    kontti.appendChild(poyta);

    let otsikot = document.createElement('thead');
    poyta.appendChild(otsikot);
    otsikot.style.backgroundColor = 'cyan';

    let otsikko = document.createElement('tr');
    otsikot.appendChild(otsikko);

    let nimiOtsikko = document.createElement('th');
    let osumaOtsikko = document.createElement('th');
    let tulosOtsikko = document.createElement('th');

    nimiOtsikko.textContent = 'Nimi';
    osumaOtsikko.textContent = 'Osumat';
    tulosOtsikko.textContent = 'Tulos'

    otsikko.appendChild(nimiOtsikko);
    otsikko.appendChild(osumaOtsikko);
    otsikko.appendChild(tulosOtsikko);
    
    let runko = document.createElement('tbody');
    poyta.appendChild(runko);
    
    
    document.body.appendChild(kontti);   


    // rivinlisäysfunktio
    function lisaaRivi(nimi, osumat, tulos) {

        const tableBody = document.querySelector('tbody');
        const rivi = document.createElement('tr');
        
        const nimisarake = document.createElement('td');
        nimisarake.textContent = nimi;
        
        const osumaSarake = document.createElement('td');
        osumaSarake.textContent = osumat;
        
        const tulosSarake = document.createElement('td');
        tulosSarake.textContent = tulos;
        
        rivi.appendChild(nimisarake);
        rivi.appendChild(osumaSarake);
        rivi.appendChild(tulosSarake);
        
        tableBody.appendChild(rivi); //lisätään rivit tbodyyn
    }

    function haeKilpailijat() {
        return new Promise((resolve, reject) => {
            // Avataan tietokanta
            const request = indexedDB.open('Kilpailijatietokanta', 1);
    
            request.onerror = function(event) {
                console.error('Tietokannan avaus epäonnistui.', event);
                reject('Tietokannan avaus epäonnistui.');
            };
    
            request.onsuccess = function(event) {
                const db = event.target.result;
                const transaction = db.transaction('Kilpailijat', 'readonly');
                const objectStore = transaction.objectStore('Kilpailijat');
    
                const kilpailijat = [];
    
                // Hakee kaikki objektit (arvot) objectStoresta
                const requestAll = objectStore.openCursor();
    
                requestAll.onsuccess = function(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        kilpailijat.push(cursor.value); // Lisätään arvot listaan
                        cursor.continue(); // Siirrytään seuraavaan objektiin
                    } else {
                        // Kaikki tiedot on haettu, palautetaan arvot
                        resolve(kilpailijat);
                    }
                };
    
                requestAll.onerror = function(event) {
                    console.error('Tietojen haku epäonnistui.', event);
                    reject('Tietojen haku epäonnistui.');
                };
            };
        });
    }
    
    // Esimerkki: kutsu ja käyttö
    haeKilpailijat().then((kilpailijat) => {
        kilpailijat.forEach(item => {
            lisaaRivi(item.etunimi+' '+item.sukunimi, item.seura, item.luokka)
        })
        console.log('Kilpailijat:', kilpailijat);
    }).catch((error) => {
        console.error(error);
    });    

});