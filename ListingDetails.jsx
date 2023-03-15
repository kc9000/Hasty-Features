import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Modal, Carousel, Card } from 'react-bootstrap';
import { GoogleMap, LoadScript, StreetViewService, Marker } from '@react-google-maps/api';
import * as listingDetailsService from '../../services/listingDetailsService';
import * as userService from '../../services/userService'
import * as dateFormatter from "../../utils/dateFormater"
import toastr from "toastr"
import { validateAvatarUrl } from '../../utils/validateAvatarUrl';
import './listingdetails.css';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import Header from '../../components/elements/Header';
import ListingDetailsImageRenderer from './ListingDetailsImageRenderer';

const API_GOOGLE_MAPS = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function ListingDetails(props) {
  const navigate = useNavigate();
  const params = useParams();
  const prevIconRef = useRef();
  const nextIconRef = useRef();
  const [carouselDefaultIndex, setCarouselDefaultIndex] = useState(0);

  const [landlordData, setLandlordData] = useState({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    isConfirmed: false,
    statusId: 0,
    dateCreated: '',
    dateModified: '',
    mi: '',
    avatarUrl: '',
  });

  const [listingData, setListingData] = useState({
    listingId: 53,
    accessType: {
      id: 0,
      name: '',
    },
    baths: 0,
    bedRooms: 0,
    checkInTime: '12:00:00',
    checkOutTime: '12:00:00',
    costPerNight: 0,
    costPerWeek: 0,
    createdBy: 0,
    dateCreated: '2023-02-04T18:20:32.8833333',
    dateModified: '2023-02-04T18:20:32.8833333',
    daysAvailable: 0,
    description: '',
    guestCapacity: 0,
    hasVerifiedOwnerShip: false,
    housingType: {
      id: 0,
      name: '',
    },
    id: 0,
    internalName: '',
    isActive: false,
    listingAmenities: null,
    listingServices: null,
    location: {
      city: '',
      id: 0,
      latitude: 0,
      lineOne: '',
      lineTwo: '',
      locationType: {
        id: 0,
        name: null,
      },
      longitude: 0,
      state: {
        code: null,
        id: 0,
        name: '',
      },
      zip: '',
    },
    shortDescription: '',
    title: '',

    amenityComponents: [],
    serviceComponents: [],
    imageComponents: [],
    imageComponentsCarousel: [],
    imageLarge: [],
    imagesSmall: [],
  });

  const [modalImages, setModalImages] = useState(false);

  const toggleModalImages = () => {
    setModalImages(!modalImages);
  };

  const [modalAmenities, setModalAmenities] = useState(false);
  const toggleModalAmenitiesServices = () => {
    setModalAmenities(!modalAmenities);
  };

  const onListingImgClicked = (e) => {
    const imageIndex = Number(e.target.id.split('-')[1]);
    setCarouselDefaultIndex(imageIndex);
    toggleModalImages();
  };

  const arrowEvent = (e) => {
    if (e.key === 'ArrowRight') {
      nextIconRef.current.click();
    } else if (e.key === 'ArrowLeft') {
      prevIconRef.current.click();
    }
  };

  useEffect(() => {
    if (modalImages) {
      window.addEventListener('keydown', arrowEvent, false);
    }

    return () => {
      window.removeEventListener('keydown', arrowEvent, false);
    };
  }, [modalImages]);

  useEffect(() => {
    listingDetailsService.getListingDetailsById(params.id).then(onGetListingSuccess).catch(onGetListingError);
  }, []);

  const onGetListingSuccess = (response) => {
    let listingDetails = response.item;
    setListingData((prevState) => {
      let ps = { ...prevState, ...listingDetails };

      let amenities = listingDetails.listingAmenities;
      ps.amenityComponents = amenities.map(mapAmenities);

      let services = listingDetails.listingServices;
      ps.serviceComponents = services.map(mapServices);

      let images = listingDetails.images;
      ps.imageComponents = images.map(mapImages);

      ps.imageComponentsCarousel = images.map(mapImagesCarousel);

      return ps;
    });

    userService.userById(listingDetails.createdBy).then(onGetUserByIdSuccess).catch(onGetUserByIdError);
  };

  const onGetUserByIdSuccess = (response) => {
    let landlord = response.item;
    setLandlordData((prevState) => {
      return { ...prevState, ...landlord };
    });
  };

  const onGetUserByIdError = (error) => {
    toastr.error(error);
  };

    const onContactHostClicked = () =>{
        let state = {type: "LANDLORD_DATA", payload: {...landlordData}}
        navigate('/apps/chat', {state})
    };

  const mapServices = (services) => {
    let serviceName = services.name;
    return <p>{serviceName}</p>;
  };

  const mapAmenities = (amenities) => {
    let amenityName = ' ' + amenities.name;
    let amenityId = amenities.id;
    let icon;

    switch (amenityId) {
      case 1:
      case 2:
      case 3:
      case 4:
        icon = 'mdi mdi-car-hatchback';
        break;
      case 5:
        icon = 'mdi mdi-pool';
        break;
      case 6:
        icon = 'mdi mdi-hot-tub';
        break;
      case 7:
        icon = 'mdi mdi-wifi';
        break;
      case 8:
        icon = 'mdi mdi-paw';
        break;
      case 9:
        icon = 'mdi mdi-cigar';
        break;
      case 10:
        icon = 'mdi mdi-baby-bottle-outline';
        break;
      case 11:
        icon = 'mdi mdi-baby-carriage';
        break;
      case 12:
        icon = 'mdi mdi-table-column';
        break;
      default:
        icon = '';
    }
    return <p className={`${icon}`}> {amenityName}</p>;
  };

  const mapImages = (anImage, index) => {
    let imageUrl = anImage.url;
    return (
      <div className="ratio ratio-4x3">
        <img
          id={`LinkImg-${index}`}
          src={imageUrl}
          className="img-fluid listing-details-cover listing-details-image:hover listing-image rounded"
          alt="imagehere"
          onClick={onListingImgClicked}
        />
      </div>
    );
  };
  const mapImagesCarousel = (anImage) => {
    let imageUrl = anImage.url;
    return (
      <Carousel.Item>
        <img src={imageUrl} className="img-fluid listing-details-image-center rounded" alt="imagehere" />
      </Carousel.Item>
    );
  };
  const onGetListingError = (error) => {
    toastr.error(error);
  };

  const containerStyle = {
    height: '400px',
  };

  const center = {
    lat: listingData.location.latitude,
    lng: listingData.location.longitude,
  };

  const nextIcon = () => {
    return <span ref={nextIconRef} aria-hidden="true" className="carousel-control-next-icon" />;
  };

  const prevIcon = () => {
    return <span ref={prevIconRef} aria-hidden="true" className="carousel-control-prev-icon" />;
  };

  const ModalImages = () => {
    return (
      <Col>
        <Modal show={modalImages} onHide={toggleModalImages} size="lg">
          <Modal.Header onHide={toggleModalImages} closeButton>
            <h4 className="modal-title">Images</h4>
          </Modal.Header>

          <Modal.Body>
            <Carousel
              data-slide="prev next"
              defaultActiveIndex={carouselDefaultIndex}
              nextIcon={nextIcon()}
              prevIcon={prevIcon()}>
              {listingData.imageComponentsCarousel}
            </Carousel>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="light" onClick={toggleModalImages}>
              Close
            </Button>{' '}
          </Modal.Footer>
        </Modal>
      </Col>
    );
  };
  const ModalAmenitiesServices = () => {
    return (
      <Col>
        <Button variant="primary" onClick={toggleModalAmenitiesServices}>
          View All
        </Button>

        <Modal show={modalAmenities} onHide={toggleModalAmenitiesServices}>
          <Modal.Header onHide={toggleModalAmenitiesServices} closeButton>
            <h4 className="modal-title">Amenities and Services</h4>{' '}
          </Modal.Header>

          <Modal.Body>
            <Row className="ps-2 pt-1" lg={2}>
              {listingData.amenityComponents}
              {listingData.serviceComponents}
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="light" onClick={toggleModalAmenitiesServices}>
              Close
            </Button>{' '}
          </Modal.Footer>
        </Modal>
      </Col>
    );
  };

  const imageArrayLength = listingData.imageComponents.length;
  const imagesForMapper = listingData.imageComponents;

  const mapThreeAmenities = (anAmenity) => {
    return <div className="mb-3 mt-3">{anAmenity}</div>;
  };
  const firstThreeAmenities = listingData.amenityComponents.slice(0, 3);
  const firstThreeAmenitiesMapped = firstThreeAmenities.map(mapThreeAmenities);

  const crumbs = [
    {
      name: 'Listings',
      path: '/listings',
    },
    {
      name: 'Listing Details',
    },
  ];
  if (listingData !== null) {
    return (
      <div className="container">
        <Row>
          <Col>
            <Header title="Listing Details" crumbs={crumbs} />
          </Col>
        </Row>

        <Col>
          <ModalImages />
        </Col>
        {ListingDetailsImageRenderer(imageArrayLength, imagesForMapper)}

        <Card className="border my-3 px-3 py-2">
          <Row>
            <div className="listing-details-col-sm-60p">
              <h3 className="mb-3">{listingData.shortDescription}</h3>
              <div className="row">
                <h4 className="mb-3 mt-2">
                  {listingData.location.lineOne}
                  {listingData.location.lineTwo}, {listingData.location.city}, {listingData.location.state.name}{' '}
                  {listingData.location.zip}
                </h4>
              </div>
              <div className="row">
                <Col>
                  <p className="h4 mt-2 mb-2">
                    {listingData.guestCapacity} guests, {listingData.bedRooms} bedrooms, {listingData.baths} baths
                  </p>
                </Col>
                <Col>
                  <p className="h4 mt-2 mb-2 d-flex justify-content-end me-3">${listingData.costPerWeek}/week</p>
                </Col>
              </div>

              <hr className="listing-details-line mb-4 mt-3"></hr>
              <h3 className="mb-2 mt-2">About This Home:</h3>
              <p className="mb-2 mt-2">{listingData.description}</p>

              <hr className="listing-details-line mb-4 mt-4"></hr>
              <div className="row">
                <h3 className="mb-2">Facts and Features</h3>
              </div>

              <Row>
                <Col>
                  <h5>Home</h5>
                  <div className="col d-flex justify-content-between mb-3 mt-3 me-2">
                    <div className="uil uil-home-alt"> Property Type:</div>
                    <div>{listingData.housingType.name}</div>
                  </div>
                  <div className="col d-flex justify-content-between mb-3 mt-3 me-2">
                    <div className="uil uil-panorama-h"> Your access:</div>
                    <div>{listingData.accessType.name}</div>
                  </div>
                  <div className="col d-flex justify-content-between mb-3 mt-3 me-2">
                    <div className="uil uil-arrow-resize-diagonal"> Lot Size:</div>
                    <div>{listingData.id}</div>
                  </div>
                  <div className="col d-flex justify-content-between mb-3 mt-3 me-2">
                    <div className="mdi mdi-clock-check-outline"> Check In Time:</div>
                    <div>{listingData.checkInTime}</div>
                  </div>
                  <div className="col d-flex justify-content-between mb-3 mt-3 me-2">
                    <div className="mdi mdi-clock-check"> Check Out Time:</div>
                    <div>{listingData.checkOutTime}</div>
                  </div>
                </Col>
                <Col>
                  <h5>Amenities and Services</h5>
                  <div className="col mb-3 mt-3">
                    {firstThreeAmenitiesMapped}
                    <ModalAmenitiesServices />
                  </div>
                </Col>
              </Row>

              <hr className="listing-details-line mb-4 mt-3"></hr>

              <Row>
                <Col>
                  <Row>
                    <Col className="col-auto">
                      <img
                        src={validateAvatarUrl(landlordData.avatarUrl)}
                        alt="Landlord-Avatar"
                        className="avatar-md rounded-circle listing-details-cover"
                      />
                    </Col>

                    <Col>
                      <div className="my-auto">
                        <h4>Hosted by {landlordData.firstName}</h4>
                        <span className="text-muted">
                          Joined in {dateFormatter.formatDate(landlordData.dateCreated)}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col>
                  <button onClick={onContactHostClicked} className="btn btn-primary mt-2" type="button">
                    Contact Host
                  </button>
                </Col>
              </Row>

              <Row>
                <Col>
                  <div className="d-flex my-2">
                    <div className="pe-2">
                      <i className="mdi mdi-star"></i>
                      <span className="ps-1">1 Review</span>
                    </div>
                    <div className="pe-2">
                      <i className="mdi mdi-shield-check"></i>
                      <span className="ps-1">Identity Verified</span>
                    </div>
                    <div className="pe-2">
                      <i className="mdi mdi-medal"></i>
                      <span className="ps-1">Awesome Host</span>
                    </div>
                  </div>
                  <div>
                    <span className="fw-bold">Host Profile here</span>
                  </div>
                </Col>
                <Col>
                  <div className="my-2">
                    <p>Response Rate: 100%</p>
                    <p>Response Time: Within an Hour</p>
                  </div>
                </Col>
              </Row>
            </div>

            <Col>
              <Row>
                <div className="col">
                  <AppointmentForm {...props} />
                </div>
              </Row>

              <hr className="listing-details-line mb-4 mt-3"></hr>

              <div className="col mb-4">
                <LoadScript googleMapsApiKey={API_GOOGLE_MAPS}>
                  <GoogleMap id="circle-example" mapContainerStyle={containerStyle} center={center} zoom={12}>
                    <Marker position={center} />
                    <StreetViewService />
                  </GoogleMap>
                </LoadScript>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default ListingDetails;
