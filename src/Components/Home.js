import React from "react";
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';

import { Fade } from "react-awesome-reveal";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

import './Styles.css';


export default function Home() {


  return (
    <div>
      <br></br>
      <Carousel data-bs-theme="dark">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-model-unselect-gallery-1-202309?wid=5120&amp;hei=2880&amp;fmt=p-jpg&amp;qlt=80&amp;.v=1692810665888"
            alt="First slide"
          />
          <Carousel.Caption>
            <h5>First slide label</h5>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-model-unselect-gallery-1-202309?wid=5120&amp;hei=2880&amp;fmt=p-jpg&amp;qlt=80&amp;.v=1692810665888"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h5>Second slide label</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-model-unselect-gallery-1-202309?wid=5120&amp;hei=2880&amp;fmt=p-jpg&amp;qlt=80&amp;.v=1692810665888"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h5>Third slide label</h5>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <div><br></br>
        <Image src="https://i.postimg.cc/D0qXJv7v/Screenshot-2023-10-09-120135.png" fluid height={'100%'} width={'100%'} />;

        <br></br>
        <Container>
          <Row>
            <Col sm lg="8" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.01))' }}><Fade right><Image src="https://images.samsung.com/us/smartphones/galaxy-z-fold5/images/galaxy-z-fold5-highlights-kv-a.jpg?imbypass=true" fluid className="img" />
            </Fade></Col>
            <Col sm lg="3 " ><p className="sub1">Galaxy Z Fold5</p><br>
            </br> <p className="sub2">Unfold an immersive entertainment experience with a massive 7.6" screen.
              Get a free storage upgrade with select Galaxy Z Fold5. Enjoy 512GB at the price of 256GB.ΩK Plus, get up to $1,200 instant trade-in credit.θ
              </p>
              <br></br><Button variant="primary" size="lg" style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }} className="custom-button">
                Buy Now
              </Button>{' '}

            </Col>
          </Row>
        </Container><br></br><br></br><br></br><br></br>

        <Container>
          <Row className="justify-content-md-center">
            <Col sm lg="5"><p className="sub1">Designed to be <br></br>durable</p><p className="sub2">
              With Corning® Gorilla® Glass Victus® 2 on the Front and Back glass and a frame forged from the most
              durable Armor Aluminum ever put on a Samsung Galaxy smartphone, this design is as functional as it is fabulous. Plus, Galaxy S23
              and S23+ come with an IP68 rating for dust and water resistance.

              *Back glass does not include camera glass. Frame does not include volume and side keys or SIM tray.
              *Galaxy S23, S23+ and S23 Ultra are rated as IP68. Based on lab test conditions for submersion in up to
              1.5 meters of freshwater for up to 30 minutes. Not advised for beach or pool use. Water and dust resistance of device
              is not permanent and may diminish over time because of normal wear and tear.
            </p></Col>
            <Col sm lg="5">  <Fade right><Image src="https://i.ibb.co/WV5NkQr/htyjyuj.png" fluid /></Fade></Col>
          </Row></Container><br></br>









        <Container><center>
          <Row>
            <Col auto={{ order: 'last' }}>
              <Card style={{ width: '15rem' }}>
              <Card.Img variant="top" src="https://i.postimg.cc/43pb87x4/Screenshot-2023-10-09-111418.png" height={'320rem'} />
              <Card.Body>
                <Card.Title>Samsung A2</Card.Title>

               <a href="producttile"> <Button variant="primary" size="lg" style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }} className="custom-button">
                  Buy Now
                </Button>{''}</a>
              </Card.Body>
            </Card></Col>
            <Col auto><Card style={{ width: '15rem', height: '20rem' }}>
              <Card.Img fluid="top" src="https://i.postimg.cc/3w4zWRRg/ergete5.png" height={'320rem'} />
              <Card.Body>
                <Card.Title>Samsung A2</Card.Title>

                <Button variant="primary" size="lg" style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }} className="custom-button">
                  Buy Now
                </Button>{' '}
              </Card.Body>
            </Card></Col>
            <Col auto={{ order: 'first' }}><Card style={{ width: '15rem' }}>
              <Card.Img variant="top" src="https://i.postimg.cc/SsN2WJXv/Screenshot-2023-10-09-111219.png" height={'320rem'} />
              <Card.Body>
                <Card.Title>Samsung A2</Card.Title>

                <Button variant="primary" size="lg" style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }} className="custom-button">
                  Buy Now
                </Button>{' '}
              </Card.Body>
            </Card></Col>
            <Col auto={{ order: 'first' }}><Card style={{ width: '15rem' }}>
              <Card.Img variant="top" src="https://i.postimg.cc/Hnr1LnmK/Screenshot-2023-10-09-111158.png" height={'320rem'} />
              <Card.Body>
                <Card.Title>Samsung A2</Card.Title>

                <Button variant="primary" size="lg" style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }} className="custom-button">
                  Buy Now
                </Button>{' '}
              </Card.Body>
            </Card></Col>
          </Row><br></br>
          <Row>
            <Col auto={{ order: 'last' }}><Card style={{ width: '15rem' }}>
              <Card.Img variant="top" src="https://i.postimg.cc/1tNLxTKh/Screenshot-2023-10-09-111348.png" height={'320rem'} />
              <Card.Body>
                <Card.Title>Samsung A2</Card.Title>

                <Button variant="primary" size="lg" style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }} className="custom-button">
                  Buy Now
                </Button>{' '}
              </Card.Body>
            </Card></Col>
            <Col auto><Card style={{ width: '15rem' }}>
              <Card.Img variant="top" src="https://i.postimg.cc/vZkhRm2T/Screenshot-2023-10-09-111329.png" height={'320rem'} />
              <Card.Body>
                <Card.Title>Samsung A2</Card.Title>

                <Button variant="primary" size="lg" style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }} className="custom-button">
                  Buy Now
                </Button>{' '}
              </Card.Body>
            </Card></Col>
            <Col auto><Card style={{ width: '15rem' }}>
              <Card.Img variant="top" src="https://i.postimg.cc/Hnr1LnmK/Screenshot-2023-10-09-111158.png" height={'320rem'} />
              <Card.Body>
                <Card.Title>Samsung A2</Card.Title>

                <Button variant="primary" size="lg" style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }} className="custom-button">
                  Buy Now
                </Button>{' '}
              </Card.Body>
            </Card></Col>
            <Col auto={{ order: 'first' }}><Card style={{ width: '15rem' }}>
              <Card.Img variant="top" src="https://i.postimg.cc/Hnr1LnmK/Screenshot-2023-10-09-111158.png" height={'320rem'} />
              <Card.Body>
                <Card.Title>Samsung A2</Card.Title>

                <Button variant="primary" size="lg" style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }} className="custom-button">
                  Buy Now
                </Button>{' '}
              </Card.Body>
            </Card></Col>
          </Row></center>
        </Container>
        <br></br>

      </div>
    </div>



  )
}




