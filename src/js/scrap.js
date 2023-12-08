/*
Pour installer le plugin puppeteer

yarn add puppeteer puppeteer-extra puppeteer-extra-plugin-stealth
# - or -
npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth
 */

const puppeteer = require('puppeteer-extra')
const { scrapeWebpageForLinks } = require('./crawler');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// import la fonction remplirChampDeRecherche from crawler.js
const { remplirChampDeRecherche } = require('./crawler');



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
    const confidence = 100 - 20*(distance / Math.max(str.length, element.length));
    return { presence: distance === 0, confidence: confidence };
}
function removeExtraSpaces(str) {
    return str.replace(/ {2,}/g, ' ');
}

async function scrapeWebpage(url, searchTerm) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Naviguer vers l'URL spécifiée
        await page.goto(url);

        // Attendre que la page soit chargée (vous pouvez ajuster le temps d'attente en fonction de la page)
        await page.waitForTimeout(2000);

        // Extraire toutes les balises <p> contenant le terme spécifié
        const matchingParagraphs = await page.evaluate((searchTerm) => {
            const paragraphs = Array.from(document.querySelectorAll('p'));
            const matchingParagraphs = [];

            paragraphs.forEach((p) => {
                if (p.textContent.includes(searchTerm)) {
                    matchingParagraphs.push(p.outerHTML);
                }
            });

            return matchingParagraphs;
        }, searchTerm);

        // Calculer la distance de levenshtein entre le terme recherché et le contenu de la page
        const result = checkPresenceAndConfidence(searchTerm, matchingParagraphs.join(' '));

        // Calculer le score de confiance en fonction de la distance de Hamming
        const confidenceScore = result.confidence;

        // Fermer le navigateur
        await browser.close();

        // Retourner toutes les balises <p> contenant le terme spécifié
        return { content: monsieurPropre(matchingParagraphs.join(' ')), confidence: confidenceScore };
    } catch (error) {
        console.error('Erreur lors du scraping de la page :', error);
        return { content: '', confidence: 0 };
    }
}


function monsieurPropre(htmlString) {
    return htmlString.replace(/<[^>]*>/g, '');
}

async function e2pz(url, searchTerm) {
    try {
        const scrapper = await scrapeWebpageForLinks(url, url);

        // Utilisation de Promise.all pour paralléliser les appels à scrapeWebpage
        const results = await Promise.all(scrapper.map(element => scrapeWebpage(element, searchTerm).content));

        // Utilisation de join pour concaténer les résultats
        const maChaine = results.join(' \n\n');

        // Vous pouvez faire quelque chose avec maChaine ici, ou la retourner si nécessaire
        return maChaine;
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        throw error; // Propagez l'erreur pour que le code appelant puisse la gérer
    }
}

console.log(e2pz('https://www.ademe.fr/', 'climat'));

// utilisation
const url = 'https://www.ademe.fr/';
const element = 'climat';
/*
scrapeWebpage(url, element)
    .then((result) => {
        console.log('Contenu de la page:', monsieurPropre(result.content));
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
*/


async function checkImageDescriptions(images, keyword) {
    let res;
    let confiance = 0;
    // Parcourir chaque image
    for (let image of images) {
        // Appliquer checkPresenceAndConfidence sur la description de l'image
        const result = checkPresenceAndConfidence(image.description, keyword);
        if (image.description.toLowerCase().includes(keyword.toLowerCase())) {
            // Si le score de confiance est supérieur à 50, afficher l'image et le score de confiance
            if (result.confidence > 50) {
                if (images.description !== '' || images.description !== 'Cookies (fenêtre modale)') {
                    console.log('Image:', image.url);
                    console.log('Description:', image.description);
                    console.log('Score de confiance:', result.confidence);
                    if (result.confidence > confiance) {
                        confiance = result.confidence;
                        res = {image : image.url, description : image.description, score : result.confidence};
                    }
                }
            }
        }
    }
    return res;
}
/*
const keyword = 'liberté';
scrapeWebpageForImages(url)
    .then((images) => {
        checkImageDescriptions(images, keyword);
    })
    .catch((error) => {
        console.error('Erreur lors du scraping:', error);
    });
*/

async function chercheImage(url1, keyword) {
    //let url = await remplirChampDeRecherche(url1, keyword);
    let images = await scrapeWebpageForImages(url1);
    return checkImageDescriptions(images, keyword);
}

module.exports = {
    scrapeWebpage,
    scrapeWebpageForImages,
    chercheImage,
};



console.log(chercheImage('https://commons.wikimedia.org/wiki/Main_Page', 'climate change'));