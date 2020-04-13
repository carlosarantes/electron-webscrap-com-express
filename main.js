/*
O quente batimento do seu coração será sua arma
*/

// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

const express = require("express");
const path = require('path');
const puppeteer = require('puppeteer');
var bodyParser = require('body-parser');
let mainWindow;


let page = null;
(async () => {
    const browser = await puppeteer.launch({ headless: true, timeout : 45000 });
  
  
    /*
https://pptr.dev/#?product=Puppeteer&version=v2.1.1&show=api-browserbrowsercontexts



browser.isConnected() // use
browser.pages()

browser.process()
browser.target()
browser.targets()
browser.userAgent()
browser.version()
browser.waitForTarget(predicate[, options])
browser.wsEndpoint()
browserContext.on('targetchanged')


page.reload([options])

page.screenshot([options])
page.setBypassCSP(enabled)
page.setCacheEnabled([enabled])

page.setContent(html[, options])
page.setCookie(...cookies)
page.setExtraHTTPHeaders(headers)
page.setJavaScriptEnabled(enabled)
page.setRequestInterception(value)
  page.on('request', interceptedRequest => {
    if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
      interceptedRequest.abort();
    else
      interceptedRequest.continue();
  });



page.workers()
worker.url()


// intercept request
function logRequest(interceptedRequest) {
  console.log('A request was made:', interceptedRequest.url());
}

page.on('request', logRequest);
// Sometime later...
page.removeListener('request', logRequest);
page.on('frameattached')
page.on('framedetached')

page.on('framenavigated')

page.on('load')




page.on('domcontentloaded')
page.on('error')
page.on('metrics')
page.on('request')

page.setRequestInterceptio

page.on('requestfailed')

page.on('requestfinished')
page.on('response')

page.on('workercreated')
page.on('workerdestroyed')

// page.$(selector)
page.$$(selector)
page.$$eval(selector, pageFunction[, ...args])
page.$eval(selector, pageFunction[, ...args])
page.cookies([...urls]
page.deleteCookie(...cookies)
page.emulateTimezone(timezoneId)




page.isClosed()
page.metrics()




page
.addScriptTag
(options)


page
.addStyleTag
(options)

page.content()



console.log( browser.browserContexts() );

browser.createIncognitoBrowserContext();
browser.defaultBrowserContext();


    browser.on('targetchanged', () => {
      console.log('MUDOU DE URL');
    });
*/
    // console.log('aaaa - ', browser.wsEndpoint() );
   
    return await browser.newPage();
})().then( async (p) => {
    page = p;
    await page.goto("https://web.whatsapp.com/", { waitUntil: 'networkidle2' });
}).catch( (err) => {
    page = null;
});



function createWindow () {
  const mainWindow = new BrowserWindow();
  mainWindow.loadFile('views/index.html')
}

app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
});

app.on('ready', function(){




  
  var ex = express();
  ex.use(bodyParser.json());
  ex.use(bodyParser.urlencoded({ extended: true })); 

  ex.get("/getQRCode", async (req, res) => {

  // await page.goto("https://web.whatsapp.com/", { waitUntil: 'networkidle2' });
      await page.waitForSelector('.landing-main');
      const qrCode = await page.evaluate( function()  {
          console.log('buscando qr code...');
          const divQrCode = document.getElementsByClassName("_11ozL")[0].innerHTML;
          return divQrCode;
      });
      
      // document.getElementById('qr-code').innerHTML = qrCode;

      res.send( { status : true, qrCode: qrCode } );
  });





  ex.post("/sendMessage", async (req, res) => {
      const phone = req.body.phone;
      const message = req.body.message;

      page.evaluate(() => {
          let camposTexto = document.getElementsByClassName('_2S1VP copyable-text selectable-text');
          if( typeof camposTexto != "undefined" && (camposTexto.length > 0) ){
              if(camposTexto[1]){
                  camposTexto[1].textContent = '';
              }
          }
      });

      await page.goto("https://web.whatsapp.com/send?phone="+phone+"&text="+message, { waitUntil: 'networkidle2' });    
      await page.waitForSelector('._35EW6');
      const data = page.evaluate( () => {
          const btnSend = document.getElementsByClassName("_35EW6")[0];
          if(btnSend){
              btnSend.click();
          }
      });
      res.send({ status : true, message : "Mensagem enviada com sucesso!" });
  });

  ex.listen(3400);





});