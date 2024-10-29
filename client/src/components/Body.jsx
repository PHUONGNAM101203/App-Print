// src/components/Body.js
import React, { useState } from 'react';
import axios from 'axios';
import mammoth from 'mammoth';
import { Container, Row, Col, Button} from 'react-bootstrap';
import { FaUpload } from 'react-icons/fa';


function AppBody() {
    const [file, setFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [result, setResult] = useState(null);
    const [step, setStep] = useState(1);
    const [fileName, setFileName] = useState(null);
    const [wordSummary, setWordSummary] = useState(null);
    const [account, setAccount] = useState("");

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile.name);

        // Reset state khi chọn file mới
        setResult(null);
        setStep(1);
        setAccount("");
        setPreviewURL(null);
        setWordSummary(null);

        if (selectedFile && selectedFile.type === "application/pdf") {
            setPreviewURL(URL.createObjectURL(selectedFile));
        } else if (selectedFile && selectedFile.name.endsWith(".docx")) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const arrayBuffer = event.target.result;
                const { value } = await mammoth.extractRawText({ arrayBuffer });
                const words = value.split(/\s+/).slice(0, 100).join(' ');
                setWordSummary(words);
            };
            reader.readAsArrayBuffer(selectedFile);
        } else {
            alert("Định dạng file không được hỗ trợ.");
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(response.data);
            setStep(2);
        } catch (error) {
            console.error("Error uploading file", error);
        }
    };

    const handlePayment = () => {
        if (account) {
            alert(`Thanh toán từ tài khoản ${account} thành công!`);
        } else {
            alert("Vui lòng nhập tài khoản thanh toán.");
        }
    };

    return (
        <Container fluid className="app-body">
            <Row className="main-section">
                <Col md={6} className="upload-section d-flex flex-column align-items-center justify-content-center">
                    <h2>Tải lên Tài liệu</h2>
                    <div className="upload-box">
                        <label htmlFor="file-upload" className="upload-label">
                            <FaUpload size={40} color="#007bff" />
                            <p>Nhấp vào đây để chọn file</p>
                        </label>
                        <input id="file-upload" type="file" onChange={handleFileChange} className="file-input" accept=".pdf,.docx" />
                        {fileName && <p className="file-name">Tên file: {fileName}</p>}
                    </div>
                    <Button variant="primary" onClick={handleUpload} className="mt-3">Tính Số Trang</Button>
                </Col>

                <Col md={6} className="preview-section d-flex flex-column align-items-center justify-content-center">
                    {previewURL && (
                        <div className="preview-container mb-4">
                            <iframe src={previewURL} title="PDF Preview" className="pdf-preview" />
                        </div>
                    )}

                    {wordSummary && (
                        <div className="summary-container mb-4">
                            <h5>Bản tóm tắt tài liệu Word:</h5>
                            <p>{wordSummary}...</p>
                        </div>
                    )}
                </Col>
            </Row>

            {step === 2 && result && (
                <Row className="result-section d-flex flex-column align-items-center justify-content-center">
                    <Col md={8} className="result-container text-center">
                        <h2>Kết quả Tính Toán</h2>
                        <p><strong>Số trang:</strong> {result.pageCount}</p>
                        <p><strong>Chi phí in:</strong> {result.printCost.toLocaleString()} VNĐ</p>
                    </Col>
                    <Col md={8} className="payment-form">
                        
                        <Button variant="success" onClick={handlePayment} className="mt-3">Thanh Toán</Button>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default AppBody;
