

export function teeOtsikko() {
    let otsikko = document.createElement('header');
    let h1 = document.createElement('h1');
    h1.textContent = 'RessuKisaLaskuri'; // otsikko
    otsikko.appendChild(h1);
    return otsikko;
}

function teeNavigointi() {
    let ladattavaSivu;
    let nav = document.createElement('nav');
    let lista = document.createElement('ul');

    let sivut = ['Kisan Luonti', 'Kilpailijan Luonti', 'Tulokset'];
    
    sivut.forEach(function(sivu) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        ladattavaSivu = `${sivu.toLowerCase().replace(/\s+/g, '')}.js`; //a.href
        console.log(ladattavaSivu);
        a.textContent = sivu; // Linkin teksti
        li.appendChild(a);
        lista.appendChild(li);
    });

    nav.appendChild(lista);
    return nav;
}




function lataaSisalto(ladattavaSivu) {  // lisäys
    const script = document.createElement('script');  
    script.src = ladattavaSivu;
    script.type = 'module'; //vaiko 'module'?
    
    const sisaltoElementti = document.getElementById('app');
    sisaltoElementti.innerHTML = '';
    
    sisaltoElementti.appendChild(script);
  }



function teePaasivu() {
    let section = document.createElement('section');

    let nappi = document.createElement('button');
    let gdpr_nappi = document.createElement('button');
    gdpr_nappi.textContent = 'GDPR';
    nappi.textContent = 'Tyhjennä tietokanta'; // Tyhjennysnappi
    nappi.onclick = function() {
        if (confirm('Haluatko varmasti tyhjentää tietokannan?')) {            
            indexedDB.deleteDatabase('Kilpailijatietokanta');
            // koodisto tietokannan tyhjentämiseksi
            console.log('Tietokanta tyhjennetty');
        }
    };

    gdpr_nappi.onclick = () => {
        infoGDPR();

    }
    section.appendChild(nappi);
    section.appendChild(gdpr_nappi);
    return section;
}

document.getElementById('header').appendChild(teeOtsikko());
document.getElementById('navigation').appendChild(teeNavigointi());
document.getElementById('main-content').appendChild(teePaasivu());

function infoGDPR() {
    const infomsg = `
    
    <h2>Toiminnot:</h2>
    
    <h3>Henkilöstä kerättävät tiedot:</h3>
    <pre>
    -Nimi
    -Yhdistys
    -Summittainen ikä
    </pre>
    <p>
        Kaikki tiedot tallentuvat vain päätelaitteeseen,
        mitään tietoja ei lähetetä verkkoon. <br><br>
        
        Kilpailutietojen tietokannan tyhjentäminen on mahdollista 
        etusivulla 'Tyhjennä tietokanta'-painikkeella.
    </p>`;

    document.getElementById('modalInfo').innerHTML = infomsg;
    document.getElementById('gdprModal').style.display = 'block'; 
}

document.getElementById('gdprModal').addEventListener('click', () => 
    {document.getElementById('gdprModal').style.display = 'none';});

//function closeModal() {
//    document.getElementById('gdprModal').style.display = 'none'; 
//}

window.onclick = function(event) {
    const modal = document.getElementById('gdprModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

document.querySelectorAll('li')[0].addEventListener('click', function() {
    lataaSisalto('luokilpailu.js');
});

document.querySelectorAll('li')[1].addEventListener('click', function() {
    lataaSisalto('app.js');
});

document.querySelectorAll('li')[2].addEventListener('click', function() {
    lataaSisalto('tulokset.js');
});