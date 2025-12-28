import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';

const StyledPill = styled.div`
  color: #004ff3;
  border: 1px solid #004ff3;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  padding: 4px 8px;
  gap: 4px;
`;
const StyledImg = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

const Span = styled.span`
  color: ${(props) => (props.$color ? 'red' : '#000')};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const FlexContainer = styled.div`
  font-family: Poppins;
  width: 100%;
  display: flex;
  flex-wrap: ${(props) => (props.$flexWrap ? props.$flexWrap : 'wrap')};
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: ${(props) => (props.$gap ? props.$gap : '8px')};
  align-items: ${(props) =>
    props.$alignItems ? props.$alignItems : 'flex-start'};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
`;

const StyledInput = styled.input`
  position: ${(props) => (props.$position ? props.$position : 'relative')};
  z-index: ${(props) => (props.$zIndex ? props.$zIndex : 'auto')};
  left: ${(props) => (props.$left ? props.$left : '0')};
  top: ${(props) => (props.$top ? props.$top : '0')};
  width: ${(props) => (props.$width ? props.$width : 'calc(100% - 40px)')};
  height: 20px;
  margin-top: 10px;
  border-radius: 8px;
  color: #000000bf;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  padding: 12px 20px;
  font-family: Poppins;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25);
  border: ${(props) => (props?.$isError ? '1px solid red' : '')};
  text-align: ${(props) => (props.$textAlign ? props.$textAlign : 'left')};
  display: ${(props) => (props.$display ? 'none' : 'block')};
`;

const StyledHeader = styled.p`
  font-family: Poppins;
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
  color: ${(props) => props?.$color};
  margin: ${(props) => props?.$margin};
  width: ${(props) => (props?.$width ? props?.$width : '100%')};
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'space-between'};
  gap: ${(props) => (props.$gap ? props.$gap : '10px')};
  opacity: ${(props) => (props.$opacity ? props.$opacity : '1')};
`;

const loadScript = (url, callback) => {
  let script = document.createElement('script');
  script.type = 'text/javascript';

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
};

const LocationInput = ({
  locationData,
  onLocationSelect,
  onLocationRemove,
  isMandatory = true,
  error,
  isDisabled = false,
  showHeader = true,
  placeholderText = 'Search Places ...',
  locationQuery = '',
  setLocationQuery = () => {},
  inputId = '',
}) => {
  const [query, setQuery] = useState('');
  let autoComplete;

  const autoCompleteRef = useRef(null);

  const handleScriptLoad = (updateQuery, autoCompleteRef) => {
    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      {
        fields: ['address_components', 'formatted_address', 'geometry'],
        componentRestrictions: { country: 'IN' },
      },
    );

    autoComplete.addListener('place_changed', () => {
      handlePlaceSelect(updateQuery);
    });
  };

  const handlePlaceSelect = async (updateQuery) => {
    const addressObject = await autoComplete.getPlace();
    const locationObject = {
      ...addressObject,
      geometry: {
        location: {
          lat: addressObject?.geometry?.location?.lat(),
          lng: addressObject?.geometry?.location?.lng(),
        },
      },
    };
    const query = addressObject.formatted_address;
    updateQuery(query);
    onLocationSelect(locationObject);
    setQuery('');
  };

  const getAddressComponent = (components, type) => {
    const component = components?.find((comp) => comp.types.includes(type));
    return component ? component.long_name : '';
  };

  useEffect(() => {
    setQuery(locationQuery);
  }, [locationQuery]);

  useEffect(() => {
    // setLocationQuery(query);
    if (!query || !inputId || query === '') return;
    document?.getElementById(inputId)?.focus();
    document?.getElementById(inputId)?.click();
  }, [query]);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_PLACES_API_KEY}&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef),
    );
  }, []);

  return (
    <FlexContainer $gap="0px" $flexDirection="column">
      <FlexContainer>
        {showHeader ? (
          <StyledHeader
            $fontSize={'16px'}
            $lineHeight={'24px'}
            $color={'#000'}
            $justifyContent={'flex-start'}
            $gap={'5px'}
          >
            Job Location
            {isMandatory ? <Span style={{ color: 'red' }}>*</Span> : null}
          </StyledHeader>
        ) : null}

        <StyledInput
          id={inputId}
          ref={autoCompleteRef}
          className="form-control"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          placeholder={placeholderText}
          value={query}
          disabled={isDisabled || Object.keys(locationData)?.length !== 0}
          $isError={error}
          $display={Object.keys(locationData)?.length !== 0}
        />
        {error ? (
          <Span
            $fontSize={'14px'}
            $fontWeight={'300'}
            $lineHeight={'normal'}
            $color={'red'}
          >
            {error}
          </Span>
        ) : (
          ''
        )}
      </FlexContainer>
      <FlexContainer $marginTop="10px">
        {Object.keys(locationData)?.length !== 0 ? (
          <StyledPill>
            <span>
              {getAddressComponent(
                locationData?.address_components || locationData?.metaData,
                'sublocality_level_1',
              )
                ? `${getAddressComponent(
                    locationData?.address_components || locationData?.metaData,
                    'sublocality_level_1',
                  )}, `
                : ''}
              {getAddressComponent(
                locationData?.address_components || locationData?.metaData,
                'locality',
              ) ||
                getAddressComponent(
                  locationData?.address_components || locationData?.metaData,
                  'administrative_area_level_1',
                )}
            </span>
            {!isDisabled ? (
              <StyledImg
                onClick={() => onLocationRemove()}
                src={ICONS?.CROSS_ICON}
                width="16px"
                height="16px"
                alt={'close'}
              />
            ) : null}
          </StyledPill>
        ) : null}
      </FlexContainer>
    </FlexContainer>
  );
};

export default LocationInput;
