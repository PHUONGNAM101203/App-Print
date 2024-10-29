// src/components/Footer.js
import React from 'react';
import { Container } from 'react-bootstrap';

function AppFooter() {
    return (
        <footer className="app-footer bg-dark text-white text-center py-3">
            <Container>
                <p>&copy; 2023 Document Uploader. All rights reserved.</p>
            </Container>
        </footer>
    );
}

export default AppFooter;
