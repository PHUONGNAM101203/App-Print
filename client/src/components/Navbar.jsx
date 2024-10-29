// src/components/Navbar.js
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

function AppNavbar() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="app-navbar">
            <Container>
                <Navbar.Brand href="/">Document Uploader</Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
