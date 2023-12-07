const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeWebpageForLinks(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Naviguer vers l'URL spécifiée
    await page.goto(url);

    // Attendre que la page soit chargée
    await page.waitForTimeout(2000);

    // Extraire tous les liens de la page
    const links = await page.evaluate((url) => {
        const anchors = Array.from(document.querySelectorAll('a'));
        let links = anchors.map(anchor => anchor.href);
        // Filtrer les liens externes
        links = links.filter(link => link.startsWith(url));
        return links;
    }, url);

    // Supprimer les doublons
    const uniqueLinks = [...new Set(links)];

    // Fermer le navigateur
    await browser.close();

    return uniqueLinks;
}

// utilisation
const url = 'https://data.ademe.fr/';
scrapeWebpageForLinks(url)
    .then((links) => {
        console.log('Liens internes:', links);
    })
    .catch((error) => {
        console.error('Erreur lors du scraping:', error);
    });



// bard code
const bardapi = require('@xelcior/bard-api');

const _bard = new bardapi("[SESSION TOKEN HERE]");

(async () => {
    const answer = await _bard.getAnswer('What is Google Bard?');
    console.log(answer); //use response
})();