const express = require('express')
const router = express.Router()

// จัดการส่งข้อมูลแบบ formdata
const multer = require('multer')

// image port file comfig ที่เราสร้างไว้
const multerConfig = require('../config/multer.config')
const upload = multer(multerConfig.config).single(multerConfig.keyUpload)

const db = require('../models')

router.get('/', (req, res) => {
    res.status(200).json(req.body)
})

// ส่ง params
router.get('/:id', (req, res) => {
    res.status(200).json(req.params.id)
})

// ส่ง query string จะต้องใช้กับ path ที่เป็น test/test?name="" path ต่อกัน
router.get('/test/api', (req, res) => {
    res.send(`${req.query.name}`)
})

// ส่งข้อมูลผ่าน body
router.post('/add/:id', (req, res) => {
    res.status(200).json(req.body)
})


// upload.none() ทำให้อ่านค่าที่ส่งมาไม่สนไฟล์
router.post('/add/upload/:id', upload, (req, res) => {
    console.log(req.body);
    res.status(200).json(req.params.id)
})


// ทำการ export router
module.exports = router