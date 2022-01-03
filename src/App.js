import React, { useState, useRef, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/app.css'
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Navbar,
  Alert,
  Modal,
  OverlayTrigger,
  Popover,
  Table
} from 'react-bootstrap'
import imageCompression from "browser-image-compression";
import placeholder from './assets/img/placeholder.webp'
import logo from './assets/img/logo.png'
import { FaInfoCircle } from 'react-icons/fa'


export default function App() {
  const [compressedLink, setCompressedLink] = useState(placeholder)
  const [originalImage, setOriginalImage] = useState('')
  const [originalLink, setOriginalLink] = useState('')
  const [originalFileSize, setOriginalFileSize] = useState('')
  const [originalHeight, setOriginalHeight] = useState()
  const [originalWidth, setOriginalWidth] = useState()
  const [outputFileName, setOutputFileName] = useState('')
  const [compressedFileSize, setCompressedFileSize] = useState('')
  const [compressedHeight, setCompressedHeight] = useState()
  const [compressedWidth, setCompressedWidth] = useState()
  const [compressed, setCompressed] = useState(false)
  const [uploadImage, setUploadImage] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const fileRef = useRef()




  useEffect(() => {
    originalImageSize(originalLink)
  }, [originalLink])

  const handleUpload = (e) => {
    const imageFile = e.target.files[0];
    setOriginalLink(URL.createObjectURL(imageFile))
    setOriginalImage(imageFile)
    setOutputFileName(imageFile.name)
    setOriginalFileSize(formatBytes(imageFile.size, 2))
    setUploadImage(true)
    originalImageSize(originalLink)
    setShowAlert(false)
    setCompressed(false)
    setCompressedLink(placeholder)
    setCompressedFileSize('')
    setCompressedHeight()
    setCompressedWidth()
  }

  function originalImageSize(url) {
    const img = document.createElement("img");

    img.onload = () => {
      setOriginalHeight(img.naturalHeight)
      setOriginalWidth(img.naturalWidth)
    };

    img.src = url;
  }

  function compressedImageSize(url) {
    const img = document.createElement("img");

    img.onload = () => {
      setCompressedHeight(img.naturalHeight)
      setCompressedWidth(img.naturalWidth)
    };

    img.src = url;
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const handleCompress = (e) => {
    e.preventDefault();

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 500,
      useWebWorker: true
    };

    if (options.maxSizeMB >= originalImage.size / 1024) {
      setShowAlert(true)
      return 0;
    }

    let output;
    imageCompression(originalImage, options).then(x => {
      output = x;

      const downloadLink = URL.createObjectURL(output);
      setCompressedLink(downloadLink)
      setCompressedFileSize(formatBytes(output.size, 2))
      compressedImageSize(downloadLink)
    });



    setCompressed(true)
    return 1;
  }

  const ImageTooSmallError = () => {
    if (showAlert) {
      return (
        <Alert variant='danger' style={{ textAlign: 'center' }} onClose={() => setShowAlert(false)} dismissible>
          <Alert.Heading>Your image is too small</Alert.Heading>
          <p>
            The image you uploaded is too small to be compressed. Please upload a bigger image and try again.
          </p>
        </Alert>
      );
    }
    else {
      return null;
    }
  }

  const reset = () => {
    setCompressedLink(placeholder)
    setOriginalImage('')
    setOriginalLink('')
    setOriginalFileSize('')
    setOriginalHeight()
    setOriginalWidth()
    setOutputFileName('')
    setCompressedFileSize('')
    setCompressedHeight()
    setCompressedWidth()
    setCompressed(false)
    setUploadImage(false)
    setShowAlert(false)
    fileRef.current.value = null;
  }

  const compare = () => {
    return (
      <div>
        <Table bordered striped variant="dark" className='mx-auto table-max-500 shadow'>
          <thead>
            <tr>
              <th className='w-15'></th>
              <th className='text-white w-25 text-center'>
                Original
              </th>
              <th className='text-white w-25 text-center'>
                Compressed
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className='text-white'>File Size</th>
              <td className='text-white text-center'>{originalFileSize}</td>
              <td className='text-white text-center'>{compressedFileSize}</td>
            </tr>
            <tr>
              <th className='text-white'>Width</th>
              <td className='text-white text-center'>{originalWidth}</td>
              <td className='text-white text-center'>{compressedWidth}</td>
            </tr>
            <tr>
              <th className='text-white'>Height</th>
              <td className='text-white text-center'>{originalHeight}</td>
              <td className='text-white text-center'>{compressedHeight}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }


  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top" >
        <Container fluid>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top me-4"
            />
            Image Compressor
          </Navbar.Brand>
          <Button
            variant='primary'
            style={{ background: '#00bcef' }}
            onClick={() => handleShowModal()}
          >
            How to Use
          </Button>
        </Container>
      </Navbar>
      <div className='margin'>
        <ImageTooSmallError />
        <Container fluid>
          <Row className='mb-4'>
            <Col md={true}>
              <Card className='shadow m-4'>
                {uploadImage ? (
                  <div>
                    <Card.Img variant="top" src={originalLink} />
                  </div>
                ) : (
                  <div>
                    <Card.Img variant="top" src={placeholder} />
                  </div>
                )}
                <Card.Body>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      ref={fileRef}
                      onChange={(e) => { handleUpload(e) }}
                    />
                  </Form.Group>
                  <div className='d-flex align-items-center justify-content-between'>
                    <Button
                      disabled={!uploadImage}
                      variant='dark'
                      onClick={handleCompress}
                    >
                      Compress
                    </Button>
                    <OverlayTrigger
                      trigger="click"
                      rootClose
                      placement={'top'}
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">Image info</Popover.Header>
                          <Popover.Body>
                            <strong>File size</strong> {originalFileSize}<br></br>
                            <strong>Width</strong> {originalWidth}px<br></br>
                            <strong>Height</strong> {originalHeight}px
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <Button
                        disabled={!uploadImage}
                        variant='dark'
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <FaInfoCircle />
                      </Button>
                    </OverlayTrigger>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <div className="vr p-0"></div>
            <Col md={true}>
              <Card className='shadow m-4'>
                <Card.Img variant="top" src={compressedLink} />
                <Card.Body
                  className='d-flex align-items-center justify-content-between'
                  style={{ marginTop: '53px' }}
                >
                  <a
                    href={compressedLink}
                    download={outputFileName}
                  >
                    <Button
                      variant='dark'
                      disabled={!compressed}
                    >
                      Download
                    </Button>
                  </a>
                  <OverlayTrigger
                    trigger="click"
                    rootClose
                    placement={'top'}
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">Image info</Popover.Header>
                        <Popover.Body>
                          <strong>File size</strong> {compressedFileSize}<br></br>
                          <strong>Width</strong> {compressedWidth}px<br></br>
                          <strong>Height</strong> {compressedHeight}px
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <Button
                      disabled={!compressed}
                      variant='dark'
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <FaInfoCircle />
                    </Button>
                  </OverlayTrigger>

                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className='mb-5'>
            <Container fluid>
              <div className='d-flex justify-content-center'>
                <Button
                  variant="dark"
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </div>
            </Container>
          </Row>
          <Row>
            <Container>
              <Col>
                {compressed && compare()}
              </Col>
            </Container>
          </Row>
        </Container>

        <Modal className='mt-5' show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>How to Use</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='d-inline-block'>
              <span>To compress an image: </span>
              <ul className='mt-2'>
                <li>Click the 'Browse...' button and select an image file</li>
                <li>Click the 'Compress' button</li>
                <li>Once the compression is finished, click the 'Download' button</li>
              </ul>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>

  )
}
