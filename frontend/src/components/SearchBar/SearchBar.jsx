import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "../../contexts/ApiContext.jsx";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import { AddGuestModal } from "../modals/AddGuestModal.jsx";
import { CitySelector } from "./CitySelector.jsx";
import { DateRangeInput } from "./DateRangeInput";
import { IconSvg } from "../UI/Image/IconSvg.jsx";
import { IconButton_Search } from "../UI/Button/IconButton_Search.jsx";

import styles from "./SearchBar.module.css";

export const SearchBar = ({
  onSearch,
  params,
  classNameWidth = "btn-w-960",
  classNameHeight = "btn-h-50",
  className
}) => {
  const { t } = useTranslation();
  const { offerApi } = useContext(ApiContext);
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const cityId = searchParams.get("cityId") || localStorage.getItem("locationId") || null;
  const cityName = localStorage.getItem("city") || "";
  const startDateStr = searchParams.get("startDate") || localStorage.getItem("startDate") || new Date().toISOString();
  const endDateStr = searchParams.get("endDate") || localStorage.getItem("endDate") || new Date(Date.now() + 86400000).toISOString();
  const adults = Number(searchParams.get("adults") || localStorage.getItem("adults") || 1);
  const children = Number(searchParams.get("children") || localStorage.getItem("children") || 0);
  const rooms = Number(searchParams.get("rooms") || localStorage.getItem("rooms") || 1);

  const [dateRange, setDateRange] = useState({
    start: startDateStr ? new Date(startDateStr) : null,
    end: endDateStr ? new Date(endDateStr) : null,
  });


  const [location, setLocation] = useState(cityName);
  const [locationId, setLocationId] = useState(null);
  const [hotels, setHotels] = useState([]);


  useEffect(() => {
    if (cityId) {
      setLocationId(cityId); // устанавливаем ID города
      // Можно найти название города, если нужно обновить location
      const storedCityName = localStorage.getItem("city");
      if (storedCityName) setLocation(storedCityName);
    }
  }, [cityId]);



  const [guests, setGuests] = useState({
    rooms: rooms,
    adults: adults,
    children: children,
  });

  const [isGuestOpen, setIsGuestOpen] = useState(false);

  const handleSearch = () => {
    if (!locationId) {
      alert("Пожалуйста, выберите город");
      return;
    }

    if (!dateRange.start || !dateRange.end) {
      alert("Пожалуйста, выберите даты");
      return;
    }

    const combinedParams = {
      cityId: locationId,
      startDate: dateRange.start.toISOString(),
      endDate: dateRange.end.toISOString(),
      adults: guests.adults,
      children: guests.children,
      rooms: guests.rooms,
      params: Object.entries(params)
        .map(([key, val]) => `${key}:${val}`)
        .join(","),
    };

    const searchParams = new URLSearchParams(combinedParams);
    navigate(`/search?${searchParams.toString()}`);

  };


  const setLocationInfo = (cityName, cityId) => {
    setLocation(cityName);
    setLocationId(cityId);
  };

  return (
    <div
      className={`${styles.searchBar} ${styles.searchBar_bg_color_dark}   ${styles.searchBar_txt} ${className} flex-between btn-br-r-20 ${classNameWidth} ${classNameHeight}`}
    >
      <div className={`${styles.searchBar__container} gap-20 flex-center`}>
        <div
          className={`${styles.searchBar__wrapper} btn-br-r-10 btn-h-35 btn-w-276 flex-center`}
        >
          <CitySelector
            value={location}
            onChange={setLocationInfo}
            placeholder={t("Search.city")}
          />
        </div>

        <DateRangeInput
          dateRange={dateRange}
          setDateRange={setDateRange}
          icon_title="calendar"
          icon_size={18}
        />


        <div
          style={{ position: "relative" }}
          className={`${styles.searchBar__wrapper} btn-br-r-10 btn-h-35 btn-w-276 flex-center`}
        >
          <IconSvg
            name="people"
            size={18}
            className={styles.input_icon}
          />

          <button
            onClick={() => setIsGuestOpen(!isGuestOpen)}
            className={`${styles.input_guest} ${styles.input_guest_txt}`}
          >
            {`${guests.adults + guests.children} ${t("Search.guests")}`}
          </button>

          {isGuestOpen && (
            <div className="modalOverlay">
              <AddGuestModal
                guests={guests}
                setGuests={setGuests}
                setIsModalOpen={setIsGuestOpen}
              />
            </div>
          )}
        </div>

        <IconButton_Search onClick={handleSearch} icon_name="search" />
      </div>
    </div>
  );
};
