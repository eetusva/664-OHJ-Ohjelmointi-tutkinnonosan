



document.addEventListener('DOMContentLoaded',() => {
    // kontti
    let loginContainer = document.createElement('div');
    loginContainer.className = 'login-container';

    // --- Lomake 1: Lisää kilpailija ---
    let form = document.createElement('form');
    form.id = 'login-form';
    form.setAttribute('action', '');

    let h1 = document.createElement('h1');
    h1.textContent = 'Lisää kilpailija';

    // Etunimi
    let etunimiLabel = document.createElement('label');
    etunimiLabel.setAttribute('for', 'etunimi');
    etunimiLabel.textContent = 'Etunimi';

    let etunimiInput = document.createElement('input');
    etunimiInput.setAttribute('type', 'text');
    etunimiInput.setAttribute('name', 'etunimi');
    etunimiInput.id = 'etunimi';
    etunimiInput.required = true;

    // Sukunimi
    let sukunimiLabel = document.createElement('label');
    sukunimiLabel.setAttribute('for', 'sukunimi');
    sukunimiLabel.textContent = 'Sukunimi';

    let sukunimiInput = document.createElement('input');
    sukunimiInput.setAttribute('type', 'text');
    sukunimiInput.setAttribute('name', 'sukunimi');
    sukunimiInput.id = 'sukunimi';
    sukunimiInput.required = true;

    // Seura
    let seuraLabel = document.createElement('label');
    seuraLabel.setAttribute('for', 'seura');
    seuraLabel.textContent = 'Yhdistys, seura';

    let seuraInput = document.createElement('input');
    seuraInput.setAttribute('type', 'text');
    seuraInput.setAttribute('name', 'seura');
    seuraInput.id = 'seura';
    seuraInput.required = true;

    // Radio- ja checkbox-valinnat
    let radioDiv = document.createElement('div');
    radioDiv.className = 'radiot';

    
    let juniorRadio = document.createElement('input');
    juniorRadio.setAttribute('type', 'radio');
    juniorRadio.setAttribute('name', 'luokka');
    juniorRadio.id = 'junior';

    let juniorLabel = document.createElement('label');
    juniorLabel.setAttribute('for', 'junior');
    juniorLabel.textContent = 'Junior';

    
    let yleinenRadio = document.createElement('input');
    yleinenRadio.setAttribute('type', 'radio');
    yleinenRadio.setAttribute('name', 'luokka');
    yleinenRadio.id = 'yleinen';

    let yleinenLabel = document.createElement('label');
    yleinenLabel.setAttribute('for', 'yleinen');
    yleinenLabel.textContent = 'Yleinen';

    
    let seniorRadio = document.createElement('input');
    seniorRadio.setAttribute('type', 'radio');
    seniorRadio.setAttribute('name', 'luokka');
    seniorRadio.id = 'senior';

    let seniorLabel = document.createElement('label');
    seniorLabel.setAttribute('for', 'senior');
    seniorLabel.textContent = 'Senior';

    
    let ladyCheckbox = document.createElement('input');
    ladyCheckbox.setAttribute('type', 'checkbox');
    ladyCheckbox.setAttribute('name', 'luokka');
    ladyCheckbox.id = 'lady';

    let ladyLabel = document.createElement('label');
    ladyLabel.setAttribute('for', 'lady');
    ladyLabel.textContent = 'Lady';

    // Lisää radiot ja checkboxit radioDiviin
    radioDiv.appendChild(juniorRadio);
    radioDiv.appendChild(juniorLabel);
    radioDiv.appendChild(yleinenRadio);
    radioDiv.appendChild(yleinenLabel);
    radioDiv.appendChild(seniorRadio);
    radioDiv.appendChild(seniorLabel);
    radioDiv.appendChild(ladyCheckbox);
    radioDiv.appendChild(ladyLabel);

    // Lähetä-painike
    let submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Lisää kilpailija';

    // lisää kilpailija -lomake
    form.appendChild(h1);
    form.appendChild(etunimiLabel);
    form.appendChild(etunimiInput);
    form.appendChild(sukunimiLabel);
    form.appendChild(sukunimiInput);
    form.appendChild(seuraLabel);
    form.appendChild(seuraInput);
    form.appendChild(radioDiv);
    form.appendChild(submitButton);

    // --- Lomake 2: Hae kilpailija ---
    let searchForm = document.createElement('form');
    searchForm.id = 'search-form';

    let h2 = document.createElement('h2');
    h2.textContent = 'Hae kilpailija';

    
    let hakuEtunimi = document.createElement('input');
    hakuEtunimi.id = 'haku-etunimi';
    hakuEtunimi.setAttribute('type', 'text');
    hakuEtunimi.setAttribute('placeholder', 'Hae etunimellä');
    hakuEtunimi.required = true;

    
    let hakuSukunimi = document.createElement('input');
    hakuSukunimi.id = 'haku-sukunimi';
    hakuSukunimi.setAttribute('type', 'text');
    hakuSukunimi.setAttribute('placeholder', 'Hae sukunimellä');
    hakuSukunimi.required = true;

   
    let searchButton = document.createElement('button');
    searchButton.setAttribute('type', 'submit');
    searchButton.textContent = 'Hae kilpailija';

    // haku-lomake
    searchForm.appendChild(h2);
    searchForm.appendChild(hakuEtunimi);
    searchForm.appendChild(hakuSukunimi);
    searchForm.appendChild(searchButton);

    // tulos
    let tulos_naytto = document.createElement('h1');
    tulos_naytto.id = 'search-result';

    // --- Lomake 3: Hae kilpailija ID:llä ---
    let searchIdForm = document.createElement('form');
    searchIdForm.id = 'search-id-form';

    let searchIdInput = document.createElement('input');
    searchIdInput.id = 'search-id';
    searchIdInput.setAttribute('type', 'number');
    searchIdInput.setAttribute('placeholder', 'Hae ID:llä');
    searchIdInput.required = true;

    let searchIdButton = document.createElement('button');
    searchIdButton.setAttribute('type', 'submit');
    searchIdButton.textContent = 'Hae kilpailija ID:llä';

    // Rakennetaan ID-hakulomake
    searchIdForm.appendChild(searchIdInput);
    searchIdForm.appendChild(searchIdButton);

    // --- Palaa etusivulle -painike ---
    let backButton = document.createElement('button');
    backButton.textContent = 'Palaa etusivulle';

   
    loginContainer.appendChild(form);
    loginContainer.appendChild(searchForm);
    loginContainer.appendChild(tulos_naytto);
    loginContainer.appendChild(searchIdForm);
    loginContainer.appendChild(backButton);

    // Lopuksi lisätään koko kontaineri sivulle
    document.body.appendChild(loginContainer);


})





document.addEventListener('DOMContentLoaded', async () => {
    // tietokannan avaaminen 
    const { avaaTietokanta } = await import('./db.js');
    db = await avaaTietokanta();
});

document.addEventListener('DOMContentLoaded', function() {
    // Kilpailijan tallennus lomakkeen lähetyksessä
    document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        let etunimi = document.getElementById('etunimi').value;
        let sukunimi = document.getElementById('sukunimi').value;
        let seura = document.getElementById('seura').value;
        let luokka = document.querySelector('input[name="luokka"]:checked');
        luokka = luokka ? luokka.id : null;

        let uusiKayttaja = { etunimi, sukunimi, seura, luokka };

        // tallennusfunktio 
        const { tallennaKilpailija } = await import('./tallenna.js');
        let tulos_naytto = document.getElementById('search-result');
        tallennaKilpailija(db, uusiKayttaja, tulos_naytto);
    });

    // Kilpailijan haku
    document.getElementById('search-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        let etunimi = document.getElementById('haku-etunimi').value;
        let sukunimi = document.getElementById('haku-sukunimi').value;
        
        // Ladataan hakufunktio 
        const { haeKilpailija } = await import('./haku.js');
        let tulos_naytto = document.getElementById('search-result');
        
        haeKilpailija(db, etunimi, sukunimi, tulos_naytto);
    });

   

    // Kilpailijan haku ID:n perusteella
    document.getElementById('search-id-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        let kilpailijaId = parseInt(document.getElementById('search-id').value, 10);
        let tulos_naytto = document.getElementById('search-result');

       
        const { haeKilpailijaIDlla } = await import('./haku.js');
        haeKilpailijaIDlla(db, kilpailijaId, tulos_naytto);
    });
});






