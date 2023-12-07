/*
Pour installer le plugin puppeteer

yarn add puppeteer puppeteer-extra puppeteer-extra-plugin-stealth
# - or -
npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth
 */

const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


// Fonction pour calculer la distance de Levenshtein entre deux chaînes
function levenshteinDistance(str1, str2) {
    const matrix = [];

    let i;
    for (i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    let j;
    for (j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (i = 1; i <= str2.length; i++) {
        for (j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }

    return matrix[str2.length][str1.length];
}

async function scrapeWebpageForImages(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Naviguer vers l'URL spécifiée
    await page.goto(url);

    // Attendre que la page soit chargée
    await page.waitForTimeout(2000);

    // Extraire toutes les images et leurs descriptions de la page
    const images = await page.evaluate(() => {
        const imgElements = Array.from(document.querySelectorAll('img'));
        let images = imgElements.map(img => ({url: img.src, description: img.alt}));
        return images;
    });

    // Fermer le navigateur
    await browser.close();

    return images;
}


// Fonction pour vérifier la présence d'un élément dans une chaîne et renvoyer l'indice de confiance
function checkPresenceAndConfidence(str, element) {
    const distance = levenshteinDistance(str, element);
    const confidence = 100 - distance / Math.max(str.length, element.length);
    return { presence: distance === 0, confidence: confidence };
}
function removeExtraSpaces(str) {
    return str.replace(/ {2,}/g, ' ');
}

async function scrapeWebpage(url, searchTerm) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Naviguer vers l'URL spécifiée
    await page.goto(url);

    // Attendre que la page soit chargée (vous pouvez ajuster le temps d'attente en fonction de la page)
    await page.waitForTimeout(2000);

    // Extraire le contenu de la page
    const pageContent = await page.evaluate(() => {
        return document.body.textContent;
    });
    // Calculer la distance de Hamming entre le terme recherché et le contenu de la page
    const result = checkPresenceAndConfidence(searchTerm, pageContent);

    // Calculer le score de confiance en fonction de la distance de Hamming
    const confidenceScore = result.confidence;

    console.log(removeExtraSpaces(pageContent))
    // Fermer le navigateur
    await browser.close();

    return {content: result.presence, confidence: confidenceScore};
}

// utilisation
const url = 'https://www.ademe.fr/';
const element = 'pomme';


scrapeWebpage(url, element)
    .then((result) => {
        console.log('Contenu de la page:', result.content);
        console.log('Score de confiance:', result.confidence);
    })
    .catch((error) => {
        console.error('Erreur lors du scraping:', error);
    });

scrapeWebpageForImages(url)
    .then((images) => {
        console.log('Images et descriptions:', images);
    })
    .catch((error) => {
        console.error('Erreur lors du scraping:', error);
    });

function choixImage(dicoImage, motClef) {
    let res = [];
    let confiance = 0;

    Object.entries(dicoImage).forEach(([key, value]) => {
        let tmpConfiance = checkPresenceAndConfidence(value, motClef);
        tmpConfiance = tmpConfiance.confidence;
        // Vous pouvez faire quelque chose avec tmpConfiance, par exemple l'ajouter à confiance
        if (tmpConfiance > confiance){
            confiance = tmpConfiance
            res = [key, value];
        }
    });
    if (confiance < 50){
        return null;
    }
    else {
        return res;
    }
}