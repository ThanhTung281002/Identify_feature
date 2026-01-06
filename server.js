const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 3000;

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= CONNECT MONGODB =================
mongoose
  .connect(
    "mongodb+srv://tungdd202_db_user:vcKOLH4n7xB5FQzN@cluster0.dti9swa.mongodb.net"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ================= SCHEMA =================
const FormSchema = new mongoose.Schema(
  {
    // STEP 1
    personal: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true }
    },

    // STEP 2
    cccd: {
      frontImage: String, // path
      backImage: String,
      fullName: String,
      number: String,
      address: String,
      issueDate: Date
    },

    // STEP 3
    signature: {
      image: String // path
    }
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", FormSchema);

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ================= SUBMIT FORM =================
app.post(
  "/submit",
  upload.fields([
    { name: "cccd.frontImage", maxCount: 1 },
    { name: "cccd.backImage", maxCount: 1 },
    { name: "signature.image", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const body = req.body;

      if (
        !body["personal.fullName"] ||
        !body["personal.phone"] ||
        !body["personal.address"]
      ) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin cá nhân"
        });
      }

      const data = {
        personal: {
          fullName: body["personal.fullName"],
          phone: body["personal.phone"],
          address: body["personal.address"]
        },
        cccd: {
          fullName: body["cccd.fullName"],
          number: body["cccd.number"],
          address: body["cccd.address"],
          issueDate: body["cccd.issueDate"]
            ? new Date(body["cccd.issueDate"])
            : null,
          frontImage: req.files?.["cccd.frontImage"]?.[0]?.path,
          backImage: req.files?.["cccd.backImage"]?.[0]?.path
        },
        signature: {
          image: req.files?.["signature.image"]?.[0]?.path
        }
      };

      await Form.create(data);

      res.status(201).json({
        success: true,
        message: "Lưu thành công"
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
);


// ================= GET ALL (TEST) =================
app.get("/forms", async (req, res) => {
  const data = await Form.find();
  res.json(data);
});

// ================= START SERVER =================
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});