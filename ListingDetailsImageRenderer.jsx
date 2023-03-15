import React from 'react';

function ListingDetailsImageRenderer(imageArrayLength, imagesForMapper) {
  if (imageArrayLength === 1) {
    return (
      <div className="row">
        <div className="col">{imagesForMapper[0]}</div>
      </div>
    );
  }
  if (imageArrayLength === 2 || imageArrayLength === 3 || imageArrayLength === 4) {
    return (
      <div className="row">
        <div className="col">{imagesForMapper[0]}</div>
        <div className="col">{imagesForMapper[1]}</div>
      </div>
    );
  }
  if (imageArrayLength >= 5) {
    return (
      <div className="row">
        <div className="col">{imagesForMapper[0]}</div>

        <div className="col">
          <div className="row">
            <div className="col mb-1">{imagesForMapper[1]}</div>
            <div className="col mb-1">{imagesForMapper[2]}</div>
          </div>

          <div className="row">
            <div className="col mt-2">{imagesForMapper[3]}</div>
            <div className="col mt-2">{imagesForMapper[4]}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ListingDetailsImageRenderer;
