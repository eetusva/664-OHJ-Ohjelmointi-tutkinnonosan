
//info-sivu
export function infoGDPR() {
    return`
    <nav>
        <button> <a href='index.html'>Etusivu</a></button>
    </nav>
    <h2>Toiminnot:</h2>

    
    <h3>Henkilöstä kerättävät tiedot:</h3>
    <pre style="font-weight: bolder;">
        -Nimi
        -Yhdistys
        -Summittainen ikä
        -Sukupuoli
    </pre>
    <p>
        Kaikki tiedot tallentuvat vain päätelaitteeseen,
        mitään tietoja ei lähetetä verkkoon. <br><br>
        Kaikki päätelaitteeseen tallentuvat tiedot salataan
        ennen tallentamista. <br><br>
        Kun ohjelma suljetaan, poistuvat kaikki tiedot
        myös päätelaitteelta.
    </p>
    `
};