const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const status = console.log;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '', 
        pass: ''
    }
});

let mailOptions = {
    from: '',
    to: '',
    subject: 'Stock AVAILABLE!',
    text: 'The store has been updated and there is some in stock. Check it here: https://www.hollisterco.com/shop/eu/p/wrap-triangle-bikini-top-40494319?seq=01&fbclid=IwAR2CJxeRopkMZxM2H3ZcHosQKGp4RkC_AKMbeviB9tcef5U0FIIN41D2MaY'
};

async function scrapeProduct(url){
    const browser = await puppeteer.launch({headless: false});


    try {
        const page = await browser.newPage();
        await page.goto(url);
        
        //Choose color (for=the id of color)
        const color = await page.$('[for="radio_swatch_KIC_311-2600-0862-900_39663398"]')
        await color.click();
        await page.waitForSelector('[src="https://anf.scene7.com/is/image/anf/KIC_311-2600-0862-900_prod1?$product-hol-v1$&wid=800&hei=1000"]');
        //await page.waitFor(2000);


      
        const available = await page.evaluate(() => {
          //Choose size (id of size)
          console.log('TEST');
          return document.getElementById('radio_size_primary_S_39663398').disabled;
          });
        
        
          console.log('Available: '+!available);


          if(available==false){
            transporter.sendMail(mailOptions, (err, data) => {
              if (err) {
                  return staus('Error occurs');
              }
              return staus('Email sent');
          });
          }
} 
catch (err) {
    console.error(err.message);
  } 
finally {
  
  await browser.close();
  }

}


scrapeProduct('https://www.hollisterco.com/shop/eu/p/wrap-triangle-bikini-top-40494319?seq=01&fbclid=IwAR2CJxeRopkMZxM2H3ZcHosQKGp4RkC_AKMbeviB9tcef5U0FIIN41D2MaY')
