const express = require('express')
const app = express()
const cors = require('cors')


// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:4200',  // กำหนดโดเมนที่ได้รับอนุญาต
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // กำหนด HTTP methods ที่อนุญาต
  credentials: true, // อนุญาตการส่งค่า Cookie ร่วมกับ requests
  optionsSuccessStatus: 204, // กำหนด HTTP status code สำหรับการ preflight request
  allowedHeaders: 'Content-Type,Authorization', // กำหนด HTTP headers ที่อนุญาต
}))
app.use('/images', express.static('images')) //กำหนดชื่อ path และ เข้าถึง folder images

// router
// app.use(require('./controllers/example'))

app.use(require('./controllers/products.controller'))



const PORT = process.env.PORT || 8080
app.listen(PORT, () =>  {
    const env = `${process.env.NODE_ENV || 'development'}`
    console.log(`App listening on port ${PORT}`);
    console.log(`App listening on env ${env}`);
    console.log(`Press Ctrl+C to quit.`);
});