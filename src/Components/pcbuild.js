import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

const ComputerConfiguration = () => {
  const [processor, setProcessor] = useState('');
  const [graphicCard, setGraphicCard] = useState('');
  const [purpose, setPurpose] = useState('');
  const [screenResolution, setScreenResolution] = useState('');

  const handleSubmit = (event) => {
    // TODO: Submit the form data to the server
    event.preventDefault();
  };

  return (
   
    <Container> <br></br><br></br><br></br>
      <h1>Computer Configuration</h1>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Label htmlFor="processor">Processor</Form.Label>
            <Form.Select
              id="processor"
              required
              value={processor}
              onChange={(event) => setProcessor(event.target.value)}
            >
              <option value="">Please select processor</option>
              <option value="CORE">CORE</option>
              <option value="i5">i5</option>
              <option value="i7">i7</option>
            </Form.Select>
          </Col>

          <Col md={6}>
            <Form.Label htmlFor="graphic-card">Graphic Card</Form.Label>
            <Form.Select
              id="graphic-card"
              required
              value={graphicCard}
              onChange={(event) => setGraphicCard(event.target.value)}
            >
              <option value="">Please select graphic card</option>
              <option value="GTX 1650">GTX 1650</option>
              <option value="RTX 3050">RTX 3050</option>
              <option value="RTX 3060 Ti">RTX 3060 Ti</option>
            </Form.Select>
          </Col>
        </Row>

        <Row mt={3}>
          <Col md={6}>
            <Form.Label htmlFor="purpose">Purpose</Form.Label>
            <Form.Select
              id="purpose"
              required
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
            >
              <option value="">Please select purpose</option>
              <option value="general-tasks">General Tasks</option>
              <option value="processor-intense-tasks">Processor Intense Tasks</option>
              <option value="graphic-card-intense-tasks">Graphic Card Intense Tasks</option>
            </Form.Select>
          </Col>

          <Col md={6}>
            <Form.Label htmlFor="screen-resolution">Screen Resolution</Form.Label>
            <Form.Select
              id="screen-resolution"
              required
              value={screenResolution}
              onChange={(event) => setScreenResolution(event.target.value)}
            >
              <option value="">Please select screen resolution</option>
              <option value="1920x1080">1920x1080 (FHD (1080p))</option>
              <option value="2560x1440">2560x1440 (QHD (1440p))</option>
              <option value="3840x2160">3840x2160 (4K (UHD))</option>
            </Form.Select>
          </Col>
        </Row>
<br></br>
        <Row mt={3}>
          <Col md={12}>
            <Button type="submit" className="btn-primary">
              Proceed to Calculation
            </Button>
          </Col>
          <Col md={5}><br></br>
           <input></input>
          </Col>
        </Row>
        
      </Form><br></br>
    </Container>
  );
};

export default ComputerConfiguration;
