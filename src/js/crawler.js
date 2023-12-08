const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeWebpageForLinks(url, limiteur = '') {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Naviguer vers l'URL spécifiée
        await page.goto(url);

        // Attendre que la page soit chargée
        await page.waitForTimeout(1000);

        // Extraire tous les liens de la page
        const links = await page.evaluate((url, limiteur) => {
            const anchors = Array.from(document.querySelectorAll('a'));
            let links = anchors.map(anchor => anchor.href);

            // Filtrer les liens externes si le limiteur n'est pas vide
            if (limiteur) {
                links = links.filter(link => link.startsWith(limiteur));
            }

            return links;
        }, url, limiteur);

        // Supprimer les doublons
        const uniqueLinks = [...new Set(links)];

        return uniqueLinks;
    } catch (error) {
        console.error('Erreur lors du scraping de liens :', error);
        return [];
    } finally {
        // Fermer le navigateur
        await browser.close();
    }
}

async function remplirChampDeRecherche(url, searchTerm) {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        try {
            // Intercepter la navigation pour obtenir l'URL après la soumission du formulaire
            page.on('response', async (response) => {
                const responseUrl = response.url();
                if (responseUrl.startsWith('https://www.wikidata.org/w/index.php?search')) {
                    console.log('URL filtrée :', responseUrl);
                    resolve(responseUrl);
                }
            });

            // Naviguer vers l'URL spécifiée
            await page.goto(url);

            // Attendre que l'élément de recherche soit présent
            await page.waitForSelector('#searchInput');

            // Sélectionner l'élément de recherche par son ID
            const inputElement = await page.$('#searchInput');

            // Entrer la valeur dans le champ
            await inputElement.type(searchTerm);

            // Soumettre le formulaire (peut nécessiter des ajustements en fonction de la structure de la page)
            await page.keyboard.press('Enter');

            // Attendre un peu (facultatif, pour voir le résultat)
            await page.waitForTimeout(2000);

            console.log('Champ de recherche rempli avec succès');
            reject('Aucune URL filtrée trouvée'); // Si l'URL n'est pas trouvée
        } catch (error) {
            console.error('Erreur lors du remplissage du champ de recherche :', error);
            reject(error);
        } finally {
            // Fermer le navigateur
            await browser.close();
        }
    });
}

// Exemple d'utilisation



module.exports = {
    scrapeWebpageForLinks,
    remplirChampDeRecherche
};


