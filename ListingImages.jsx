import React, { useState, useEffect } from 'react';
import * as listingDetailsService from '../../services/listingDetailsService';
import debug from "sabio-debug" 
import { useParams } from 'react-router-dom';

const _logger = debug.extend("ListingDetails")

function ListingImages() {
    let params = useParams();
    _logger("params", params)
    
    const [listingData, setListingData] = useState({
        imageComponents: [],

    })

    useEffect(() => {
        listingDetailsService.getListingDetailsById(params.id).then(onGetListingSuccess).catch(onGetListingError)
    },
        []);
    const onGetListingSuccess = (response) => {
        let listingDetails = response.item;
        setListingData((prevState) => {
            let ps = { ...prevState, ...listingDetails}
            
            let images = listingDetails.images;
            ps.imageComponents = images.map(mapImagesTest);
            return ps;
        })
    }
    const mapImagesTest = (anImage) => {
        let imageUrl = anImage.url;
        return (
            
            <div className="col">
                <a href={imageUrl}>
                    <img src={imageUrl}
                        className="rounded mx-auto mb-1 d-block"
                        alt="imagehere"
                    />
                </a>    
            </div>
            
        )
    }
    const onGetListingError = (response) => {
        return response;
    }


    _logger('array of images', listingData.imageComponents)


        return (

            <div className="container">    
                
                    {listingData.imageComponents}
                
            </div>

        );
    
}


export default (
    ListingImages
)
