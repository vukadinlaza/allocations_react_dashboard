import React, { useState, useEffect } from "react";
import PlacesAutocomplete, {
  geocodeByPlaceId
} from "react-places-autocomplete";

const AutoFill = () => {
  // state for autoComplete
  const [address, setAddress] = useState('');
  const [placeId, setPlaceId] = useState('');

  // address state
  const [addressComponents, setAddressComponents] = useState('')
  const [streetNumber, setStreetNumber] = useState('');
  const [route, setRoute] = useState('');
  const [city, setCity] = useState('');
  const [postalTown, setPostalTown] = useState('');
  const [stateOrProvince, setStateOrProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');


  const handleSelect = (address, placeId) => {
    setAddress(address);
    setPlaceId(placeId);
  };

  useEffect(() => {
    geocodeByPlaceId(placeId)
    .then(results => setAddressComponents(results[0].address_components))
    .catch(error => console.error(error));
  }, [placeId])

 
  useEffect(() => {
    // finds and sets street number
    const streetNumberInfo = (e) => {
      try {
        setStreetNumber(addressComponents === '' ? '' : addressComponents.filter((i) => i.types[0] === "street_number")[0].long_name);
      } catch {
        console.log("ERROR==> missing street number", e);
        setStreetNumber('');
      }
    }
    streetNumberInfo();

    // finds and sets route or street address
    const routeInfo = (e) => {
      try {
        setRoute(addressComponents === '' ? '' : addressComponents.filter((i) => i.types[0] === "route")[0].long_name);
      } catch {
        console.log("ERROR==> missing route", e);
        setRoute('');
      }
    }
    routeInfo();

    // set city info
    const cityInfo = (e) => {
      try {
        setCity(addressComponents === '' ? '' : addressComponents.filter((i) => i.types[0] === "locality")[0].long_name);
      } catch {
        console.log("ERROR==> missing city", e);
        setCity('');
      }
    }
    cityInfo();

    // set city info for U.K. (uses a different google types term)
    const postalTownInfo = (e) => {
      try {
        setPostalTown(addressComponents === '' ? '' : addressComponents.filter((i) => i.types[0] === "postal_town")[0].long_name);
      } catch {
        console.log("ERROR==> postal town", e);
        setPostalTown('');
      }
    }
    postalTownInfo();

  // sets the State or Province info
    const stateInfo = (e) => {
      try {
        setStateOrProvince(addressComponents === '' ? '' : addressComponents.filter((i) => i.types[0] === "administrative_area_level_1")[0].long_name);
      } catch {
        console.log("ERROR==> missing State or rovince", e);
        setStateOrProvince('');
      }
    }
    stateInfo();

    // sets zip code or postal code
    const postalCodeInfo = (e) => {
      try {
        setPostalCode(addressComponents === '' ? '' : addressComponents.filter((i) => i.types[0] === "postal_code")[0].long_name);
      } catch {
        console.log("ERROR==> missing postal code", e);
        setPostalCode('');
      }
    }
    postalCodeInfo();

    // sets the country
    const countryInfo = (e) => {
      try {
        setCountry(addressComponents === '' ? '' : addressComponents.filter((i) => i.types[0] === "country")[0].long_name);
      } catch {
        console.log("ERROR==> missing Country", e);
        setCountry('');
      }
    }
    countryInfo();


    console.log('AddrressComps:::', addressComponents);
console.log('streetNumber:::', streetNumber);
console.log('route:::', route);
console.log('City work:::', city);
console.log('state work:::', stateOrProvince);
console.log('postalCode work:::', postalCode);
console.log('country work:::', country);
    
}, [city, streetNumber, route, postalTown, stateOrProvince, postalCode, country, addressComponents]);


  return (
    <div>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
        >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input {...getInputProps({ placeholder: "Type Address" })} />

            <div>
              {loading ? <div>...loading</div> : null}
              {suggestions.map((suggestion) => {
                console.log(suggestion);
                const style = suggestion.active
                  ? { backgroundColor: "#054a66", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };

                return (
                  <div key={suggestion.placeId} {...getSuggestionItemProps(suggestion, { style })}>
                    {suggestion.description}
                  </div>
                
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <div>{streetNumber} {route}</div>
      <div>{city} {postalTown} {stateOrProvince} {country} {postalCode}</div>
    </div>
  );
};

export default AutoFill;
