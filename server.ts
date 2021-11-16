import {buildSite} from './builder/builder';
import express from 'express';
import { scrapSite } from './scrapper/scrapper';
const app = express()
const port = 3000

app.use(express.json());

app.get('/scrap/:url', async (req, res) => {
    const {url} = req.params;
    console.log("url --------> " + url);
    const scrapeResponse = await scrapSite(url);
    res.send(scrapeResponse);
})

app.post('/build', async (req, res) => {
    const elements = await buildSite(req.body);
    res.send(elements);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


