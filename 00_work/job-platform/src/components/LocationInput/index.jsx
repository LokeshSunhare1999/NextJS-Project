"use client";
import { useEffect, useRef, useState } from "react";
import CrossIcon from "@/assets/icons/common/crossIcon.svg";
import Svg from "../Svg";
import ErrorField from "@/app/(internalLayout)/_components/ErrorField";

let autoComplete;

const loadScript = (url, callback) => {
  const script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

const LocationInput = ({
  locationData,
  onLocationSelect,
  onLocationRemove,
  isMandatory = true,
  error,
  isDisabled = false,
  placeholder = "Search Places ...",
  inputBg = "#FFF",
}) => {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);

  const handleScriptLoad = (updateQuery, autoCompleteRef) => {
    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      {
        fields: ["address_components", "formatted_address", "geometry"],
        componentRestrictions: { country: "IN" },
      }
    );

    autoComplete.addListener("place_changed", () => {
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
    setQuery("");
  };

  const getAddressComponent = (components, type) => {
    const component = components?.find((comp) => comp.types.includes(type));
    return component ? component.long_name : "";
  };

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_PLACES_API}&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, []);

  return (
    <div className="flex gap-0 w-full flex-col relative">
      <div
        className={`flex w-full items-center rounded-md ${
          error ? "border border-red-500" : "border border-[#d9d9d9] "
        }`}
      >
        {Object.keys(locationData)?.length !== 0 && (
          <div className="my-1 ml-2 flex items-start gap-2 flex-shrink-0">
            <div className=" flex items-center justify-between gap-1 px-4 py-2 rounded-xl text-sm font-poppins border transition-all duration-300 cursor-pointer text-[#586276] border-[#e9e9e9]">
              <span>
                {getAddressComponent(
                  locationData?.address_components || locationData?.metaData,
                  "sublocality_level_1"
                )
                  ? `${getAddressComponent(
                      locationData?.address_components ||
                        locationData?.metaData,
                      "sublocality_level_1"
                    )}, `
                  : ""}
                {getAddressComponent(
                  locationData?.address_components || locationData?.metaData,
                  "locality"
                ) ||
                  getAddressComponent(
                    locationData?.address_components || locationData?.metaData,
                    "administrative_area_level_1"
                  )}
              </span>
              {!isDisabled && (
                <Svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  icon={<CrossIcon />}
                  className="w-4 h-4 cursor-pointer hover:border-[#004ff3] flex-shrink-0"
                  onClick={() => onLocationRemove()}
                />
              )}
            </div>
          </div>
        )}
        <input
          ref={autoCompleteRef}
          type="text"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          placeholder={placeholder}
          value={query}
          disabled={isDisabled || Object.keys(locationData)?.length !== 0}
          className={`w-full bg-[${inputBg}] h-10 shadow-tiny text-[#585858] font-normal rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:ring-[#d9d9d9] focus:border-[#d9d9d9]
            ${Object.keys(locationData)?.length !== 0 ? "hidden" : "block"}
            `}
        />
      </div>
      {error ? <ErrorField errorText={error} /> : null}
    </div>
  );
};

export default LocationInput;
