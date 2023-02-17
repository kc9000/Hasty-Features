# Hasty-Listing-Details
This is some of my code for the private repo Hasty, a platform/project I am working on through my coding bootcamp. 

I am uploading my code to be able to show some of the work I've done. 

The primary component I've worked on is the ListingDetails.jsx page. 
This page is the primary listing page you would go to if you were looking at information for a house/listing much like you would on Airbnb or Redfin, etc.

I've included a screen recording at the below link to show some of the current functionality (as of 17 Feb 2023).

https://www.loom.com/share/4725e404345540a2b6ae5905e8f498d8


Some of the problems I encountered and how I solved them so far:
-I wanted a user to be able to go directly to the listing page, so the Url is coded using the ListingId that I am grabbing using 'useParams' from React Router. This way users can easily share the Url with others to look at a listing.
-I wanted a way to quickly load images once clicked on so I built a modal to display them that pops up. This optimizes performance and reduces the number of calls to the database.
-In the modal, I wanted an easy way for users to scroll through images, so I built an image carousel with arrows on the sides and a bottom index component.
-My database returns a lot of properties for a listing to include JSON objects for amenities, services, and images. I am using mapping functions to map these objects to their own arrays in my State. 
-I am mapping Images into a format useable for my image Carousel.
-I want to display icons next to certain Amenities or Services (like a hot tub icon for jacuzzi amenity or a car for parking), so I am using 'Switch' functionality to be able to match the AmenityId and service to its appropriate icon. 
-I incorporate the Google Maps API because it's always nice to see where the listing actually is on a map. I want to know where I'm living and what roads are around me.
-Things like Amenities and Services are very variable - one house may have only 5 while another has 40. I built and am still working to improve using a 'Show More' button to collapse extra Amenities and Services so that they don't all need to display immediately on the page. Eventually I want to use a modal sort of like how Airbnb does. This would also automatically place the correct icon next to the amenity or service.
