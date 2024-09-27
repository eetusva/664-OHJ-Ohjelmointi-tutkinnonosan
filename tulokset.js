
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

    function kaikkiKilpailijat(){
        let request = indexedDB.open('KilpailuDB');        

        request.onsuccess = function(event) {
            let db = event.target.result;
            let transaction = db.transaction(['kilpailijat'], 'readonly');
            let objectStore = transaction.objectStore('kilpailijat');
            
            let getAllRequest = objectStore.getAll();

            getAllRequest.onsuccess = function(event) {
                console.log(event.target.result); // Tulostaa kaikki tietueet konsoliin
            };
            
            getAllRequest.onerror = function(event) {
                console.error("Tietojen hakeminen epäonnistui.");
            };
        };
    }    

    // esim avain/arvo-pareista (tähän tietokannan tiedot)
    const data = [
        { nimi: 'Leila '+'K', osumat: ['X','X','X',10,10,10,9,9,9,8], tulos: 95 },
        { nimi: 'Marilyn '+'Manson', osumat: 'X,X,10,10,10,10,9,9,9,8', tulos: 95 },
        { nimi: 'Unski '+'', osumat: ('X,X,X,X,X,10,10,10,9,6'), tulos: 95 },
        { nimi: 'Norman '+'Bates', osumat: ['X','X','X',10,10,10,9,9,9,8], tulos: 95 },
        { nimi: 'Volvo '+'Markkanen', osumat: 'X,X,10,10,10,10,9,9,9,8', tulos: 95 },
        { nimi: 'Juhan '+'af Grahn', osumat: ('X,X,X,X,X,10,10,10,9,6'), tulos: 95 },
        { nimi: 'Edgar '+'Burroughs', osumat: ['X','X','X',10,10,10,9,9,9,8], tulos: 95 },
        { nimi: 'Viki '+'', osumat: 'X,X,10,10,10,10,9,9,9,8', tulos: 95 },
        { nimi: 'Köpi '+'', osumat: ('X,X,X,X,X,10,10,10,9,6'), tulos: 95 },
        { nimi: 'Pii '+'Ketvel', osumat: ['X','X','X',10,10,10,9,9,9,8], tulos: 95 },
        { nimi: 'Roo '+'Ketvel', osumat: 'X,X,10,10,10,10,9,9,9,8', tulos: 95 },
        { nimi: 'Isaac '+'Asimov', osumat: ('X,X,X,X,X,10,10,10,9,6'), tulos: 95 },
        { nimi: 'Jana '+'Exposito', osumat: ['X','X','X',10,10,10,9,9,9,8], tulos: 95 },
        { nimi: 'Keke '+'Rosberg', osumat: 'X,X,10,10,10,10,9,9,9,8', tulos: 95 },
        { nimi: 'Bro '+'Alien', osumat: ('X,X,X,X,X,10,10,10,9,6'), tulos: 95 },
        { nimi: 'Master '+'', osumat: ['X','X','X',10,10,10,9,9,9,8], tulos: 95 },
        { nimi: 'Blaster '+'', osumat: 'X,X,10,10,10,10,9,9,9,8', tulos: 95 },
        { nimi: 'Humangus '+'', osumat: ('X,X,X,X,X,10,10,10,9,6'), tulos: 95 }
    ];

    // datan läpikäynti + rivinlisäys
    data.forEach(item => {
        lisaaRivi(item.nimi, item.osumat, item.tulos);
    });

});