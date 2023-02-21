import React, { useState, useEffect } from 'react';
import * as listingDetailsService from '../../services/listingDetailsService';
import debug from 'sabio-debug';
import { useParams, Link } from 'react-router-dom';
import './listingdetails.css';
import { Row, Col, Button, Modal, Carousel, Card } from 'react-bootstrap';
import { GoogleMap, LoadScript, StreetViewService, Marker } from '@react-google-maps/api';

const _logger = debug.extend('ListingDetails');

function ListingDetails() {
    const params = useParams();
    _logger('params', params);

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
    });

    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    };

    const [modal2, setModal2] = useState(false);
    const toggleModal2 = () => {
        setModal2(!modal2);
    };

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
    };
    const mapServices = (services) => {
        let serviceName = services.name;
        return (
            <div className="col mb-3 mt-3">
                <p>{serviceName}</p>
            </div>
        );
    };
    const mapAmenities = (amenities) => {
        let amenityName = amenities.name;
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
        return (
            <div className="col">
                <p className={`mt-3 mb-3 ${icon}`}> {amenityName}</p>
            </div>
        );
    };
    const mapImages = (anImage) => {
        let imageUrl = anImage.url;
        return <img src={imageUrl} className="img-fluid image rounded" alt="imagehere" />;
    };

    const mapImagesCarousel = (anImage) => {
        let imageUrl = anImage.url;
        return (
            <Carousel.Item>
                <img src={imageUrl} className="img-fluid img-center rounded" alt="imagehere" />
            </Carousel.Item>
        );
    };

    const onGetListingError = (response) => {
        return response;
    };
    _logger('listingData:', listingData);
    _logger('array of images', listingData.imageComponents);

    const containerStyle = {
        //width: '1000px',
        height: '400px',
    };
    const center = {
        lat: listingData.location.latitude,
        lng: listingData.location.longitude,
    };
    const onLoad = (streetViewService) => {
        streetViewService.getPanorama(
            {
                location: center,
                radius: 50,
            },
            (data, status) => _logger('StreetViewService results', { data, status })
        );
    };
    const onLoad2 = (marker) => {
        _logger('marker: ', marker);
    };
    _logger('image test', listingData.imageComponents[30]);

    const ModalImages = () => {
        return (
            <Col>
                <Modal show={modal} onHide={toggleModal} size="lg">
                    <Modal.Header onHide={toggleModal} closeButton>
                        <h4 className="modal-title">Images</h4>
                    </Modal.Header>

                    <Modal.Body>
                        <Carousel>{listingData.imageComponentsCarousel}</Carousel>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="light" onClick={toggleModal}>
                            Close
                        </Button>{' '}
                    </Modal.Footer>
                </Modal>
            </Col>
        );
    };

    const ModalAmenities = () => {
        return (
            <Col>
                <Button variant="primary" onClick={toggleModal2}>
                    View All
                </Button>

                <Modal show={modal2} onHide={toggleModal2} size="sm">
                    <Modal.Header onHide={toggleModal2} closeButton>
                        <h4 className="modal-title">Amenities and Services</h4>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="m-2">
                            <h5>Amenities: </h5>
                            {listingData.amenityComponents}
                            <h5>Services: </h5>
                            {listingData.serviceComponents}
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="light" onClick={toggleModal2}>
                            Close
                        </Button>{' '}
                    </Modal.Footer>
                </Modal>
            </Col>
        );
    };

    if (listingData !== null) {
        return (
            <div className="container">
                <hr className="new1 mb-4 mt-4"></hr>
                <h3>{listingData.shortDescription}</h3>
                <div className="row">
                    <h4 className="mb-2 mt-2">
                        {listingData.location.lineOne}
                        {listingData.location.lineTwo}, {listingData.location.city}, {listingData.location.state.name}{' '}
                        {listingData.location.zip}
                    </h4>
                </div>
                <hr className="new1 mb-4 mt-3"></hr>

                <Col>
                    <ModalImages />
                </Col>

                <div className="row">
                    <div className="col img:hover">
                        <Link onClick={toggleModal}>{listingData.imageComponents[0]}</Link>
                    </div>

                    <div className="col">
                        <div className="row">
                            <div className="col mb-1">
                                <Link onClick={toggleModal}>{listingData.imageComponents[1]}</Link>
                            </div>
                            <div className="col mb-1">
                                <Link onClick={toggleModal}>{listingData.imageComponents[2]}</Link>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col mt-2">
                                <Link onClick={toggleModal}>{listingData.imageComponents[3]}</Link>
                            </div>
                            <div className="col mt-2">
                                <Link onClick={toggleModal}>{listingData.imageComponents[4]}</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <Row>
                    <div className="col-sm-60p mt-3">
                        <div className="row">
                            <Col>
                                <p className="h4 mt-2 mb-2">
                                    {listingData.guestCapacity} guests, {listingData.bedRooms} bedrooms,{' '}
                                    {listingData.baths} baths
                                </p>
                            </Col>
                            <Col>
                                <p className="h3 mt-2 mb-2 d-flex justify-content-end me-3">
                                    ${listingData.costPerWeek}/week
                                </p>
                            </Col>
                        </div>

                        <hr className="new1 mb-4 mt-3"></hr>
                        <h3 className="mb-2 mt-2">About This Home:</h3>
                        <p className="mb-2 mt-2">{listingData.description}</p>

                        <hr className="new1 mb-4 mt-4"></hr>
                        <div className="row">
                            <h3 className="mb-2">Facts and Features</h3>
                        </div>

                        <Row>
                            <Col>
                                <h5>Home</h5>

                                <div className="col d-flex justify-content-between mb-3 mt-3 me-2">
                                    <div className="uil uil-check-square"> Status:</div>
                                    <div>{listingData.isActive}</div>
                                </div>
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
                                    {listingData.amenityComponents[0]}
                                    {listingData.amenityComponents[1]}
                                    {listingData.amenityComponents[2]}
                                    {listingData.amenityComponents[3]}
                                    {listingData.amenityComponents[4]}
                                    <ModalAmenities />
                                </div>
                            </Col>
                        </Row>

                        <hr className="new1 mb-4 mt-3"></hr>
                        <div className="col mb-4">
                            <LoadScript googleMapsApiKey="AIzaSyDRdcn6_5L37-p7Jnf51k3sVZC_fZkILEc">
                                <GoogleMap
                                    id="circle-example"
                                    mapContainerStyle={containerStyle}
                                    center={center}
                                    zoom={12}>
                                    <Marker onLoad={onLoad2} position={center} />
                                    <StreetViewService onLoad={onLoad} />
                                </GoogleMap>
                            </LoadScript>
                        </div>
                    </div>

                    <div className="col mt-3">
                        <Card>
                            <p className="display-6 m-3">
                                Placeholder for an eventual scheduler/date picker/contact form
                            </p>
                            <img
                                src="https://nestrs.com/wp-content/uploads/2020/08/rate-change.png"
                                className="img-fluid img-center rounded"
                                alt="imagehere"
                            />
                        </Card>
                    </div>
                </Row>
            </div>
        );
    }
}

export default ListingDetails;
