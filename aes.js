
// Tarkistetaan IndexedDB-tuki
if (!window.indexedDB) {
    console.error("Selaimesi ei tue IndexedDB:tä.");
  } else {
    console.log("IndexedDB-tuki löytyi.");
  }
  
  // Salauksen ja purkamisen IV (inicialization vector), sen täytyy olla satunnainen ja tallennettu erikseen:
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Avaimen generointi salaukseen ja purkamiseen
  export async function luoAvain() {
    return await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256
      },
      true,  // Avain on viety ulos, jos haluat
      ["encrypt", "decrypt"]  // Mitä operaatiota avaimella voi tehdä
    );
  }
  
  // Datan salaaminen
  export async function salaaData(kilpailijaTiedot, avain) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(kilpailijaTiedot);
    
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv  // Käytetään satunnaista vektoria
      },
      avain,  // Salauksen avain
      encodedData  // Salattava data
    );
  
    return encryptedData;
  }
  
  // Datan purkaminen
  export async function puraSalaus(encryptedData, key) {
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv  // Sama iv täytyy olla mitä salauksessa käytettiin
      },
      key,  // Salauksen avain
      encryptedData  // Purettava data
    );
  
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  }
  
  // Salatun tiedon tallentaminen IndexedDB:hen
  export async function tallennaSalattuData(uusinKayttaja) {
    try {
      // 1. Avaa tietokanta
      const db = await avaaTietokanta();
  
      // 2. Luo avain
      const key = await luoAvain();
  
      // 3. Salaa nimi ja osoite
      const salattuKilpailija = await salaaData(uusinKayttaja, key);
  
      console.log("Salattu nimi (Uint8Array): ", new Uint8Array(salattuKilpailija));
  
      // 4. Tallenna tiedot IndexedDB:hen
      const transaction = db.transaction(['Kilpailijat'], 'readwrite');
      const objectStore = transaction.objectStore('Kilpailijat');
      
      const request = objectStore.add({
        nimi: salattuKilpailija,
        iv: Array.from(iv),  // Muunna IV taulukoksi jotta se voidaan tallentaa
        key: key  // Tallennetaan avain (todellisuudessa hallitse turvallisesti)
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
  
  // Salatun tiedon hakeminen IndexedDB:stä ja purkaminen
  export async function haeJaPuraSalaus(id) {
    try {
      // 1. Avaa tietokanta
      const db = await avaaTietokanta();
  
      // 2. Hae tiedot objectStoresta
      const transaction = db.transaction(['Kilpailijat'], 'readonly');
      const objectStore = transaction.objectStore('Kilpailijat');
      const request = objectStore.get(id);
  
      request.onsuccess = async (event) => {
        const data = event.target.result;
        if (!data) {
          console.error('Tietoa ei löydy id:llä:', id);
          return;
        }
  
        // 3. Puretaan salattu data
        const key = data.key;
        const ivArray = new Uint8Array(data.iv);  // Muutetaan takaisin Uint8Arrayksi
        const purettuKilpailija = await puraSalaus(data.uusiKayttaja, key);
  
        console.log('Purettu nimi: ', purettuKilpailija);
      };
  
      request.onerror = (event) => {
        console.error('Tietojen hakeminen epäonnistui: ', event.target.errorCode);
      };
    } catch (error) {
      console.error('Virhe tietojen purkamisessa: ', error);
    }
  }
  
  /* Esimerkki käytöstä: tallennus ja haku
  (async () => {
    // Tarkistetaan IndexedDB:n tuki
    if (!window.indexedDB) {
      console.error("Selaimesi ei tue IndexedDB:tä.");
      return;
    }
  
    console.log("Käytetään IndexedDB:tä.");
  
    // Tallennetaan esimerkkitiedot
    await tallennaSalattuData('Matti Meikäläinen', 'Katutie 123, Helsinki');
  
    // Odotetaan hetki, jotta tiedot ovat varmasti tallennettu, ja sitten haetaan ne id:llä 1
    setTimeout(async () => {
      await haeJaPuraSalaus(1);  // Oletuksena käytämme ensimmäisenä tallennettua id:tä
    }, 2000);  // Viive, jotta tallennus ehtii tapahtua
  })(); */
  