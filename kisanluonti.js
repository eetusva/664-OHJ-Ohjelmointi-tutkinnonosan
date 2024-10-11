let request = indexedDB.open('KisadataDB', 1);

request.onupgradeneeded = function(event) {
    let db = event.target.result;

    // object store 'Kilpailut' luonti
    if (!db.objectStoreNames.contains('Kilpailut')) {
        db.createObjectStore('Kilpailut', { keyPath: 'id', autoIncrement: true });
    }
};

request.onsuccess = function(event) {
    let db = event.target.result;

    document.getElementById("kisan-lomake").addEventListener("submit", function(event) {
        event.preventDefault();

        // syötettyjen tietojen haku
        const yhdistys = document.getElementById("yhdistys").value;
        const paikka = document.getElementById("paikka").value;
        const ajankohta = document.getElementById("ajankohta").value;
        const laukausmaara = document.getElementById("laukausmaara").value;

        if (yhdistys && paikka && ajankohta && laukausmaara) {
            // tietojen tallennus indexdb:seen
            let transaction = db.transaction(['Kilpailut'], 'readwrite');
            let store = transaction.objectStore('Kilpailut');
            let kilpailu = {
                yhdistys: yhdistys,
                paikka: paikka,
                ajankohta: ajankohta,
                laukausmaara: laukausmaara
            };

            let addRequest = store.add(kilpailu);

            addRequest.onsuccess = function(event) {
                let kilpailuId = event.target.result;
                console.log('Kilpailu tallennettu onnistuneesti!');

                // näytetään kilpailun tiedot
                document.getElementById("kilpailun-tiedot").innerHTML = `
                    <p><strong>Järjestävä yhdistys:</strong> ${yhdistys}</p>
                    <p><strong>Kilpailupaikka:</strong> ${paikka}</p>
                    <p><strong>Kilpailun ajankohta:</strong> ${ajankohta}</p>
                    <p><strong>Laukausmäärä:</strong> ${laukausmaara}</p>
                    <button id="muokkaa-btn" class="btn-small-red">Muokkaa</button>
                    <button id="poista-btn" class="btn-small-red">Poista</button>
                `;

                // muokkaa-painike
                document.getElementById("muokkaa-btn").addEventListener("click", function() {
                    document.getElementById("yhdistys").value = yhdistys;
                    document.getElementById("paikka").value = paikka;
                    document.getElementById("ajankohta").value = ajankohta;
                    document.getElementById("laukausmaara").value = laukausmaara;
                });

                // poista-painike
                document.getElementById("poista-btn").addEventListener("click", function() {
                    let transaction = db.transaction(['Kilpailut'], 'readwrite');
                    let store = transaction.objectStore('Kilpailut');
                    let deleteRequest = store.delete(kilpailuId);

                    deleteRequest.onsuccess = function() {
                        console.log('Kilpailu poistettu onnistuneesti!');
                        document.getElementById("kilpailun-tiedot").innerHTML = `<p>Ei luotuja kilpailuja</p>`;
                    };

                    deleteRequest.onerror = function(event) {
                        console.error('Kilpailun poisto epäonnistui:', event.target.error);
                    };
                });

                // lomakkeen resetointi
                document.getElementById("kisan-lomake").reset();
            };

            addRequest.onerror = function(event) {
                console.error('Kilpailun tallennus epäonnistui:', event.target.error);
            };
        } else {
            alert("Täytä kaikki kentät ennen kilpailun luomista.");
        }
    });
};

request.onerror = function(event) {
    console.error('IndexedDB-avaus epäonnistui:', event.target.errorCode);
};
