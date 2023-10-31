const express = require("express");
const router = express.Router();

// จัดการส่งข้อมูลแบบ formdata
const multer = require("multer");

// image port file comfig ที่เราสร้างไว้
const multerConfig = require("../config/multer.config");
const upload = multer(multerConfig.config).single(multerConfig.keyUpload);

// import model เรียกใช้งาน การ conncect database
const db = require("../models");

// เมื่อ query จำเป็นต้องใส่ async และ await เพื่อรอการ query ใน database ให้เสร็จ
router.get("/api/products", async (req, res) => {
  try {
    // const result = await db.Products.findAll();
    const result = await db.Products.findAll({
      order: [["id", "DESC"]],
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get params
router.get("/api/products/:id", async (req, res) => {
  try {
    const result = await db.Products.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "ไม่พบข้อมูลสินค้า" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/api/add/product", (req, res) => {
  upload(req, res, async (next) => {
    if (next instanceof multer.MulterError) {
      return res.status(500).json({ message: next });
    } else if (next) {
      return res.status(500).json({ message: next });
    }

    // num1 = [1,2,3,4]
    // num2 = [1,2] -> theStructuring spilt array -> num3 = [...num1, ...num2]

    // const productBean = {
    //     ...req.body,
    //     image: req.file ? req.file.filename : undefined
    // }

    const productBean = {
      name: req.body.name,
      stock: req.body.stock,
      price: req.body.price,
      image: req.file ? req.file.filename : undefined,
    };

    const fileName = req.file ? req.file.filename : undefined;
    try {
      const product = await db.Products.create(productBean);
      res.status(201).json(product);
    } catch (error) {
        res.status(201).json({ message: error.message });
    }
  });
});

module.exports = router;
