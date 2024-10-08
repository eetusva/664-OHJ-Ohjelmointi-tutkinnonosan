
document.addEventListener('DOMContentLoaded', () => {

    let kontti = document.createElement('div')
    kontti.className = 'kontti'

    let etusivuBtn = document.createElement('button');
    etusivuBtn.textContent = 'Etusivu';
    kontti.appendChild(etusivuBtn);
    etusivuBtn.onclick = () => {location.href = 'index.html'}

    let kilpailuTiedot = document.createElement('div');
    kontti.appendChild(kilpailuTiedot);
    kilpailuTiedot.textContent = 'Kilpailun tiedot';

    let poyta = document.createElement('table');
    poyta.className = 'tulokset';
    kontti.appendChild(poyta);

    let otsikot = document.createElement('thead');
    poyta.appendChild(otsikot);

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
    runko.id = 'runko';
    poyta.appendChild(runko);

    let btnKontti = document.createElement('div');
    btnKontti.id = 'btnKontti'
    kontti.appendChild(btnKontti);

    let Kaikki = document.createElement('button');
    Kaikki.textContent = 'Kaikki';
    let H = document.createElement('button');
    H.textContent = 'H';
    let H50 = document.createElement('button');
    H50.textContent = 'H50';

    Kaikki.onclick = () => haeSarjoittain('all');
    H.onclick = () => haeSarjoittain('yleinen');
    H50.onclick = () => haeSarjoittain('senior');

    btnKontti.appendChild(Kaikki);
    btnKontti.appendChild(H)
    btnKontti.appendChild(H50);
    
    document.body.appendChild(kontti);   


    // rivinlisäysfunktio
    function lisaaRivi(nimi, osumat, tulos) {

        const tableBody = document.querySelector('tbody');
        const rivi = document.createElement('tr');
        const linkki = document.createElement('a');      
        
        const nimisarake = document.createElement('td');
        nimisarake.textContent = nimi;
        
        const osumaSarake = document.createElement('td');
        osumaSarake.appendChild(linkki);
        linkki.textContent = osumat;
        
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
                
    
                // Hakee kaikkien tiedot objectStoresta
                const requestAll = objectStore.openCursor();
    
                requestAll.onsuccess = function(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        kilpailijat.push(cursor.value); // Lisätään arvot listaan
                        cursor.continue(); // Siirrytään seuraavaan kilpailijaan
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

    // hae lista ja sorttaus
    // Funktio, joka hakee ja sorttaa kilpailijat sarjan mukaan
    function haeSarjoittain(sarja) {
        document.getElementById('runko').innerHTML = '';
        // Hakee lista ja sorttaa
        haeKilpailijat().then((kilpailijat) => {
            const sarjaKilpailijat = sarjoittain(kilpailijat, sarja);
            sarjaKilpailijat.forEach(item => {
                lisaaRivi(item.etunimi + ' ' + item.sukunimi, item.tulokset.osumalista, item.tulokset.pisteet);
            });
            console.log('Kilpailijat:', kilpailijat);
        }).catch((error) => {
            console.error(error);
        });
    }
    
    // Suodatin sarjan mukaan
    function sarjoittain(kilpailijat, sarja) {
        if (sarja === 'all') {
            return kilpailijat.sort((a, b) => b.tulokset.pisteet - a.tulokset.pisteet);
        } else if (sarja === 'yleinen' || sarja === 'senior') {  // Korjattu vertailu
            return kilpailijat
                .filter(kilpailija => kilpailija.luokka === sarja) // Suodatetaan kilpailijat sarjan mukaan
                .sort((a, b) => b.tulokset.pisteet - a.tulokset.pisteet);
        } else {
            return [];
        }
    }
haeSarjoittain('all')
});