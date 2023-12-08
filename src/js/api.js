const express = require('express');
const app = express();
const port = 3000; // Choisissez le port que vous souhaitez utiliser

const { scrapeWebpageForLinks, remplirChampDeRecherche } = require('./crawler');
const { scrapeWebpageForImages, scrapeWebpage, chercheImage } = require('./scrap');

// Exemple d'une route GET
app.get('/', (req, res) => {
    res.send('Bienvenue sur votre API !');
});

app.use(express.json());
app.post('/api/scrape', async (req, res) => {
    try {
        const urlToScrape = req.body.url;

        // Votre logique de scraping ici
        const browser = await scrapeWebpageForLinks(urlToScrape, urlToScrape);


        res.json({ success: true, title: browser });
    } catch (error) {
        console.error('Erreur de scraping :', error);
        res.status(500).json({ success: false, error: 'Erreur de scraping' });
    }
});


app.post('/api/fillSearchField', async (req, res) => {
    try {
        const url = req.body.url;
        const searchTerm = req.body.searchTerm;

        // Votre logique pour remplir le champ de recherche ici
        const browser = await remplirChampDeRecherche(url, searchTerm);


        res.json({ success: true, message: browser.content });
    } catch (error) {
        console.error('Erreur lors du remplissage du champ de recherche :', error);
        res.status(500).json({ success: false, error: 'Erreur lors du remplissage du champ de recherche' });
    }
});

app.post('/api/scrapeWebpage', async (req, res) => {
    try {
        const url = req.body.url;
        const searchTerm = req.body.searchTerm;

        // Votre logique pour remplir le champ de recherche ici
        const browser = await scrapeWebpage(url, searchTerm);


        res.json({ success: true, message: browser });
    } catch (error) {
        console.error('Erreur lors du remplissage du champ de recherche :', error);
        res.status(500).json({ success: false, error: 'Erreur lors du remplissage du champ de recherche' });
    }
});


app.post('/api/searchimage', async (req, res) => {
    try {
        const url = req.body.url;
        const searchTerm = req.body.searchTerm;

        // Votre logique pour remplir le champ de recherche ici
        const browser = await chercheImage(url, searchTerm);


        res.json({ success: true, message: browser });
    } catch (error) {
        console.error('Erreur lors du remplissage du champ de recherche :', error);
        res.status(500).json({ success: false, error: 'Erreur lors du remplissage du champ de recherche' });
    }
});

// Écoute du serveur sur le port spécifié
app.listen(port, () => {
    console.log(`L'API est disponible sur http://localhost:${port}`);
});
