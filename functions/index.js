const functions = require("firebase-functions");

const cheerio = require("cheerio");
const express = require("express");
const cors = require("cors");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const request = require("request");
const { find } = require("cheerio/lib/api/traversing");
const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => res.render("index", { layout: "main" }));

app.get("/categories", async (req, res) => {
  const { tag } = req.query;

  let categories = [];

  request(
    `https://www.amazon.com.au/gp/bestsellers/?ref_=nav_cs_bestsellers_2fea4ef6cc1b4a6daef5814da3bb8ac6`,
    (err, response, html) => {
      if (response.statusCode === 200) {
        const $ = cheerio.load(html);

        $("#zg_left_col2 ul li").each((i, el) => {
          const category = $(el).find("a").text();

          let data = {
            category,
          };

          categories.push(data);
        });
      }

      res.set("Cache-Control", "public,max-age=300,s-maxage=600");
     
      res.json(categories);
      
    }
  );
});

app.get("/latestproduct", async (req, res) => {
  const { tag } = req.query;

  let products = [];

  request(
    `https://www.amazon.com.au/gp/bestsellers/${tag}/ref=zg_bs_nav_0`,
    (err, response, html) => {
      if (response.statusCode === 200) {
        const $ = cheerio.load(html);

        $(".zg-item-immersion").each((i, el) => {
          const rank = $(el).find(".zg-badge-text").text();
          const title = $(el)
            .find(".a-link-normal")
            .find("div", ".p13n-sc-truncated")
            .text();
          const link = $(el).find(".a-link-normal").attr("href");
          const feedback = $(el).find(".a-icon-alt").text();
          const totalfeedback = $(el)
            .find(".a-size-small.a-link-normal")
            .text();
          const price = $(el).find(".p13n-sc-price").text();
          const image = $(el)
            .find(".a-section.a-spacing-small")
            .find("img")
            .attr("src");
         
          let data = {
            rank,
            title,
            link,
            feedback,
            totalfeedback,
            price,
            image,
        
          };

          products.push(data);
        });
      }

      console.log(products);
      res.set("Cache-Control", "public,max-age=300,s-maxage=600");
      res.json(products);
      
    }
  );
});

app.get("/liveupdate", async (req, res) => {
  const { tag } = req.query;

  let cases = [];
  request(
    `https://www.health.nsw.gov.au/Infectious/covid-19/Pages/stats-nsw.aspx`,
    (err, response, html) => {
      if (response.statusCode === 200) {
        const $ = cheerio.load(html);

        $("#case ul li").each((i, el) => {
          const label = $(el).find(".label").text();
          const number = $(el).find(".number").text();
         
          let data = {
            label,
            number,
          };

          cases.push(data); 
        });
      }

      res.set("Cache-Control", "public,max-age=300,s-maxage=600");
      res.json(cases);
    }
  );
});

app.get("/EbaySearch", async (req, res) => {
  const { tag } = req.query;

  let sResult = [];

  request(
    `https://www.ebay.com.au/sch/i.html?_from=R40&_nkw=${tag}&_sacat=0&LH_BIN=1&LH_ItemCondition=1000&rt=nc&LH_PrefLoc=2`,
    (err, response, html) => {
      if (response.statusCode === 200) {
        const $ = cheerio.load(html);

        $(
          ".s-item"
        ).each((i, el) => {
          const title = $(el).find(".s-item__info.clearfix").find("a").find('h3').text();
          const subtitle = $(el).find(".s-item__subtitle").find("span").text();
          const price = $(el).find(".s-item__price").text();
          const postageprice = $(el).find(".s-item__shipping.s-item__logisticsCost").text();
          const link = $(el)
            .find(".s-item__image")
            .find('a')
            .attr("href");
            const image = $(el)
            .find(".s-item__image-img")
            .attr("src");

          let data = {
            title,
            subtitle,
            price,
            postageprice,
            link,
            image
          };
          

           sResult.push(data);
         });
       

      }

      res.set("Cache-Control", "public,max-age=300,s-maxage=600");
      res.json(sResult);
    }
  );
});


app.get("/AmazonSearch", async (req, res) => {
  const { tag } = req.query;

  let sResult = [];

  request(
    `https://www.amazon.com.au/s?k=${tag}&ref=nb_sb_noss_2`,
    (err, response, html) => {
      if (response.statusCode === 200) {
        const $ = cheerio.load(html);

        $(
          ".sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20"
        ).each((i, el) => {
          const title = $(el).find("h2").find("a").text();
          const star = $(el).find(".a-icon-alt").text();
          const price = $(el).find(".a-offscreen").text();
          const availableDate = $(el).find(".a-text-bold").text();
          const link = $(el)
            .find(".a-link-normal.s-no-outline")
            .attr("href");
            const image = $(el)
            .find(".s-image")
            .attr("src");

          let data = {
            title,
            star,
            price,
            availableDate,
            link,
            image
          };

          sResult.push(data);
        });
      }

      res.set("Cache-Control", "public,max-age=300,s-maxage=600");
      res.json(sResult);
    }
  );
});

app.get("/search", async (req, res) => {
  const { tag } = req.query;

  let datas = [];

  request(
    `https://news.google.com/search?q=${tag}&hl=en-AU&gl=AU&ceid=AU%3Aen`,
    (err, response, html) => {
      if (response.statusCode === 200) {
        const $ = cheerio.load(html);

        $(".NiLAwe.y6IFtc.R7GTQ.keNKEd.j7vNaf.nID9nc").each((i, el) => {
          const title = $(el).find("h3").find("a").text();
          const article = $(el).find("a").attr("href");
          const date = $(el).find(".WW6dff.uQIVzc.Sksgp").text();
          const image = $(el).find(".tvs3Id.QwxBBf").attr("src");
          const Postby = $(el).find(".SVJrMe").find("a").text();

          let data = {
            title,
            article,
            date,
            image,
            Postby,
          };

          datas.push(data);
        });
      }

      res.set("Cache-Control", "public,max-age=300,s-maxage=600");
      
      res.json(datas);
    }
  );
});
app.get("/ExchangeRate", async (req, res) => {
  const { tag } = req.query;

  let datas = [];

  request(
    `https://www.worldremit.com/en/au?transfer=bnk&selectto=np&amountfrom=100&currencyto=npr&currencyfrom=aud`,
    (err, response, html) => {
      if (response.statusCode === 200) {
        const $ = cheerio.load(html);

        const rate = $('.MuiTypography-root-167.jss284.jss286.jss283.jss285.MuiTypography-h5-176').text();
        // $(".NiLAwe.y6IFtc.R7GTQ.keNKEd.j7vNaf.nID9nc").each((i, el) => {
        //   const title = $(el).find("h3").find("a").text();
        //   const article = $(el).find("a").attr("href");
        //   const date = $(el).find(".WW6dff.uQIVzc.Sksgp").text();
        //   const image = $(el).find(".tvs3Id.QwxBBf").attr("src");
        //   const Postby = $(el).find(".SVJrMe").find("a").text();

        //   let data = {
        //     title,
        //     article,
        //     date,
        //     image,
        //     Postby,
        //   };

        //   datas.push(data);
        // });
        res.set("Cache-Control", "public,max-age=300,s-maxage=600");
      
      res.json(rate);
      }

      
    }
  );
});
app.get("/weather", async (req, res) => {
  const { tag } = req.query;

  let datas = [];

  request(
    `https://www.google.com/search?q=todays+weather+sydney&oq=Todays+weather&aqs=chrome.0.0i20i263i512j69i57j0i402j0i512l7.4723j1j7&sourceid=chrome&ie=UTF-8`,
    (err, response, html) => {
      if (response.statusCode === 200) {
        const $ = cheerio.load(html);

        // $(".JJZKK.yLWA8b").each((i, el) => {
        //   const title = $(el).find("h3").find("a").text();
        //   const article = $(el).find("a").attr("href");
        //   const date = $(el).find(".WW6dff.uQIVzc.Sksgp").text();
        //   const image = $(el).find(".tvs3Id.QwxBBf").attr("src");
        //   const Postby = $(el).find(".SVJrMe").find("a").text();

        //   let data = {
        //     title,
        //     article,
        //     date,
        //     image,
        //     Postby,
        //   };

        //   datas.push(data);
        // });
        const weather = $('span','.wob_t.TVtOme').text();
        const summary = $('.wtsRwe').text();
        let data={weather,summary};
        datas.push(data);
      }

      res.set("Cache-Control", "public,max-age=300,s-maxage=600");
      
      res.json(datas);
    }
  );
});

exports.app = functions.https.onRequest(app);
