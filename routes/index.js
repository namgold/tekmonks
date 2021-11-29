const https = require('https');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getTimeStories', function(req, res, next) {
  https.get('https://time.com/', (fetchRes) => {
    let rawData = '';
    fetchRes.on('data', (chunk) => { rawData += chunk; });
    fetchRes.on('end', () => {
        const storyOl = rawData.match(/<ol.+?<\/ol>/s);
        if (storyOl[0]) {
          const stories = [...storyOl[0].matchAll(/<a href=(?<link>[^>]+)>(?<title>[^<]+)<\/a>/gs)];
          res.json(stories.map(story => story.groups));
        } else res.json({ error: 'Error when parsing' });
    });
  }).on('error', (error) => {
    res.json({ error: 'Can not get https://time.com' });
  });

});

module.exports = router;
