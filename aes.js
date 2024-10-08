  
  // IV (initialization vector)
  let iv = window.crypto.getRandomValues(new Uint8Array(12));  // Satunnainen IV, salaus/purku
  
  // Avain salaukseen ja purkamiseen
  export async function luoAvain() {
    return await crypto.subtle.generateKey(
      {name: "AES-GCM", length: 256}, true, ["encrypt", "decrypt"]); // 'salaus' ja 'purku', exportattava avvain
  }
  
  // Avain JSONiksi ja tallennettavaksi
  async function exportAvain(key) {
    const exportedKey = await crypto.subtle.exportKey("jwk", key);
    return JSON.stringify(exportedKey);
  }
  
  // Avaimen haku ja muunto JSON-muodosta CryptoKey-muotoiseksi
  async function importAvain(exportedKey) {
    const parsedKey = JSON.parse(exportedKey);
    return await crypto.subtle.importKey("jwk", parsedKey, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
  }
  
  // Datan salaaminen
  async function salaaData(kilpailijaTiedot, key) {
    const encoder = new TextEncoder();
    const salattavaData = encoder.encode(kilpailijaTiedot);
    
    const salattuData = await crypto.subtle.encrypt(
      {name: "AES-GCM", iv: iv }, key, salattavaData); // Salauksen avain, satunnainen IV
  
    return salattuData;
  }
  
  // Datan purkaminen
  async function puraSalattuData(salattuData, key) {
    const purettuData = await crypto.subtle.decrypt(
      {name: "AES-GCM", iv: iv}, key, salattuData); // Salauksen avain, Sama IV, kuin salauksessa, Purettava data
  
    const decoder = new TextDecoder();
    return decoder.decode(purettuData);
  }
  
  // Avaa tai luo IndexedDB-tietokanta ja objectStore 'Kilpailijat'
  function avaaTietokanta() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('Kilpailijatietokanta', 1);
  
      // Tietokannan päivitys (objectStore luonti, jos ei jo ole)
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('SalaKilpailijat')) {
          db.createObjectStore('Salailpailijat', { keyPath: 'id', autoIncrement: true });
        }
        console.log('Tietokannan päivitys tehty (objectStore luotu).');
      };
  
      request.onsuccess = (event) => {
        console.log('Tietokanta avattu onnistuneesti.');
        resolve(event.target.result);
      };
  
      request.onerror = (event) => {
        console.error('Tietokannan avaaminen epäonnistui: ' + event.target.errorCode);
        reject(event.target.errorCode);
      };
    });
  }
  
  // Salattu tieto => IndexedDB:hen
  export async function salattuDataTallennus(kilpailijaTiedot) {  //export tai korvaamaan tallennaKilpailija()
    try {
      // Tietokanta auki
      const db = await avaaTietokanta(); // Turha, jos attr sisältää db:n
  
      // Avvaimen luonti
      const key = await luoAvain();
  
      // Kilpailijan salaus
      const salattuKilpailija = await salaaData(kilpailijaTiedot, key);
  
      console.log("Salattu nimi (Uint8Array): ", new Uint8Array(salattuKilpailija));
  
      // Avaimen exporttaus, tallennus JSON-muodossa
      const exportedKey = await exportAvain(key);
  
      // Tallennus IndexedDB:hen
      const transaction = db.transaction(['SalaKilpailijat'], 'readwrite');
      const objectStore = transaction.objectStore('SalaKilpailijat');
      
      const request = objectStore.add({
        kilpailija: salattuKilpailija,
        iv: Array.from(iv),  // IV taulukoksi tallennettavaksi
      });
  
      request.onsuccess = () => {
        console.log('Tiedot tallennettu onnistuneesti.');
      };
  
      request.onerror = (event) => {
        console.error('Tiedon tallentaminen epäonnistui: ', event.target.errorCode);
      };
    } catch (error) {
      console.error('Virhe salatussa tallennuksessa: ', error);
    }
  }
  
  // Haku IndexedDB:stä ja purkaminen
  async function salatunDatanHaku(id) {  //export tai korvaamaan haeKilpailija()
    try {
      // Tietokanta auki
      const db = await avaaTietokanta(); //Tämäkin turha
  
      // Tietojen haku objectStoresta
      const transaction = db.transaction(['Kilpailijat'], 'readonly');
      const objectStore = transaction.objectStore('Kilpailijat');
      const request = objectStore.get(id);
  
      request.onsuccess = async (event) => {
        const data = event.target.result;
        if (!data) {
          console.error('Kilpailijaa ei löydy id:llä:', id);
          return;
        }
  
        // Haetaan avain ja IV
        const importedKey = await importAvain(data.key);
        const ivArray = new Uint8Array(data.iv);  // Muutetaan takaisin Uint8Arrayksi
        iv = ivArray;  // IV purkamista varten
  
        // SalattuKilpailija purku
        const purettuKilpailija = await puraSalattuData(data.kilpailija, importedKey);
        
        console.log('Puretut tiedot: ', purettuKilpailija);
      };
  
      request.onerror = (event) => {
        console.error('Tietojen hakeminen epäonnistui: ', event.target.errorCode);
      };
    } catch (error) {
      console.error('Virhe tietojen purkamisessa: ', error);
    }
  }
  
  async function tallennaAvain(kilpailijaId) { // Parempi löytyy haku.js
    const db = await avaaTietokanta();
  
    const transaction = db.transaction(['Avaimet'], 'readwrite');
    const objectStore = transaction.objectStore('Avaimet');
  
    const avain = importAvain(kilpailijaId)
  
    const request = objectStore.add({
      avain: avain,
      id: kilpailijaId
    })
  
    request.onsuccess() = () => {
      console.log('Avain tallennettu')
    }
  
    request.onerror() = (event) => {
      console.log('Ei onnistunu avaimen tallennus', event.target.errorCode)
    };
  }
  
  async function haeAvain(kilpailijaId) {
    // Tietokanta auki
    const db = await avaaTietokanta();
  
    // Tietojen haku objectStoresta
    const transaction = db.transaction(['Avaimet'], 'readonly');
    const objectStore = transaction.objectStore('Avaimet');
    const request = objectStore.get(kilpailijaId);
  
    request.onsuccess = async (event) => {
      const avain = event.target.result;
      if (!avain) {
  
      }
    }
  }
  
// Iteroidaan tietueet ja puretaan salaus
async function puraKaikkiTiedot() {
  try {
    // Tietokanta auki
    const db = await avaaTietokanta();

    // Tietueitten haku (sync)
    const transaction = db.transaction(['Kilpailijat'], 'readonly');
    const objectStore = transaction.objectStore('Kilpailijat');
    const request = objectStore.openCursor();
    const haettuTieto = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const data = cursor.value;
        haettuTieto.push(data); // Tallennetaan tulokset listaan
        cursor.continue();
      } else {
        console.log('Kaikki tietueet haettu.');
        // Tietojen purku  (async)
        puraTiedot(haettuTieto);
      }
    };

    request.onerror = (event) => {
      console.error('Iterointi epäonnistui: ', event.target.errorCode);
    };
  } catch (error) {
    console.error('Virhe purkamisessa: ', error);
  }
}

// Tietojen purku
async function puraTiedot(haettuTieto) {
    console.log(haettuTieto)
    for (const data of haettuTieto) {
        //console.log(data)
        // Avain ja IV jokaiselle tietueelle
        const tuotuAvain = await importAvain(data.key);
        const ivArray = new Uint8Array(data.iv);  // Muutetaan takaisin Uint8Arrayksi
        iv = ivArray;  // Asetetaan IV purkamista varten

        // Purku: kilpailija
        const purettuKilpailija = await puraSalattuData(data.kilpailija, tuotuAvain);

        console.log(`ID: ${data.id} | Purettu nimi: ${purettuKilpailija.etunimi} | Purettu osumat: ${purettuKilpailija.tulokset.osumalista}`);
    }
}

  
  
  /* testifunktiot

  kilpailijat = {
    ['Late', 'Liukas', '[X,X,X,10,10,9,9,9,8,6]', 91]
    ['Nils-Aslak', 'Valkeapää', '[10,9,9,9,9,9,8,8,8,7]', 86]
}

(async () => {
  // Tallennetaan esimerkkitiedot
  await salattuDataTallennus(kilpailijat[0]);

  // Toimitus
  setTimeout(async () => {
    await puraKaikkiTiedot();  // Puretaan kaikki tietokannan tiedot
  }, 2000);  // Viive
})(); 
  





  


  export async function haeAvain(db, avain) {
    let transaction = db.transaction(['Avaimet'], 'readonly');
    let objectStore = transaction.objectStore('Avaimet');
    
    let request = objectStore.get(avain);

    request.onsuccess = function(event) {
        let avain = request.result;
        return avain
    }

    request.onerror = function(event) {
        console.error('Avaimen haku epäonnistui', event);
    };    
}

  */
  
  