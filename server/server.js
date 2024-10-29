const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const mammoth = require('mammoth');
const cors = require('cors');
const File = require('./models/File'); // Mô hình để lưu trữ dữ liệu file trong MongoDB
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // Đặt chính xác URL của frontend
app.use(express.json());
// Multer để tải file
const upload = multer({ dest: 'uploads/' });


// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Định tuyến để tải file
app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    let pageCount = 0;

    try {
        if (fileType === 'application/pdf') {
            // Đếm trang PDF
            const pdfBytes = require('fs').readFileSync(filePath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            pageCount = pdfDoc.getPages().length;
        } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // Đếm trang Word
            const result = await mammoth.extractRawText({ path: filePath });
            const wordCount = result.value.split(/\s+/).length;
            pageCount = Math.ceil(wordCount / 500); // Quy đổi 500 từ ≈ 1 trang
        } else {
            return res.status(400).send("File không được hỗ trợ");
        }

        // Tính chi phí in (ví dụ: 1000 VNĐ/trang)
        const printCost = pageCount * 1000;

        // Lưu dữ liệu vào MongoDB
        const newFile = new File({
            fileName: req.file.originalname,
            pageCount,
            printCost,
        });
        await newFile.save();

        res.json({ pageCount, printCost });
    } catch (error) {
        res.status(500).send('Đã xảy ra lỗi');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
