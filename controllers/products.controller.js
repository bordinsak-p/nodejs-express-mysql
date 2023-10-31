const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

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

// insert data to database
router.post("/api/add/product", (req, res) => {
  upload(req, res, async (next) => {
    if (next instanceof multer.MulterError) {
      console.log(`error: ${JSON.stringify(next)}`);
      return res.status(500).json({ message: next });
    } else if (next) {
      console.log(`error: ${JSON.stringify(next)}`);
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

    try {
      const product = await db.Products.create(productBean);
      res.status(201).json(product);
    } catch (error) {
      res.status(201).json({ message: error.message });
    }
  });
});

router.put("/api/update/product/:id", async (req, res) => {
  try {
    // query ว่ามี ข้อมูลของ product ที่เราต้องการจะแก้
    const resultProduct = await db.Products.findOne({
      where: {
        id: req.params.id,
      },
    });

    // ถ้าไม่พบข้อมูลจะให้ 404 และหยุดการทำงาน
    if (!resultProduct) {
      return res.status(404).json({ message: "ไม่พบข้อมูลสินค้า" });
    }

    // เรียกใช้งาน updateProduct เพื่อทำการอัพเดทข้อมูล
    updateProduct(req, res, resultProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function updateProduct(req, res, resultProduct) {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.log(`error: ${JSON.stringify(err)}`);
      return res.status(500).json({ message: err });
    } else if (err) {
      console.log(`error: ${JSON.stringify(err)}`);
      return res.status(500).json({ message: err });
    }

    const productBean = {
      name: req.body.name,
      stock: req.body.stock,
      price: req.body.price,
    };

    // เช็คว่าถ้ามีการอัปโหลไฟล์เข้ามาให้ทำการลบไฟล์เก่าออกก่อน
    if (req.file) {
      // ลบไฟล์เก่า (ถ้ามี)
      if (resultProduct.image) {
        fs.unlink(
          path.join(__dirname, "../images", resultProduct.image),
          (unlinkErr) => {
            if (unlinkErr) {
              console.error("เกิดข้อผิดพลาดในการลบไฟล์เดิม", unlinkErr);
            }
          }
        );
      }

      productBean.image = req.file.filename; // ถ้ามีการอัปโหลดไฟล์ใหม่
    }

    try {
      // update เสร็จจะ return ออกมาเป็น array
      // จึงใส่ [] ให้กับตัวแปร updateProduct

      const [updateProduct] = await db.Products.update(productBean, {
        where: {
          id: resultProduct.id,
        },
      });

      // ถ้า update สำเร็จให้ไป query ตัวที่อัพเดทไป ด้วย pk
      // และนำมาส่ง respons
      if (updateProduct > 0) {
        const resultUpdateProduct = await db.Products.findByPk(
          resultProduct.id
        );
        res.status(200).json(resultUpdateProduct);
      } else {
        throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
      }
    } catch (error) {
      res.status(201).json({ message: error.message });
    }
  });
}

module.exports = router;
