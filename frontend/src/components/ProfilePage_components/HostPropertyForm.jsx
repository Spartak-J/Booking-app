import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ApiContext } from "../../contexts/ApiContext.jsx";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import { ThemeContext } from "../../contexts/ThemeContext";

import styles from './HostPropertyForm.module.css';

import { Text } from "../UI/Text/Text.jsx";
import { ActionButton__Secondary } from "../UI/Button/ActionButton_Secondary.jsx";
import { ActionButton__Primary } from "../UI/Button/ActionButton_Primary.jsx";
import { IconButtonArrow } from '../UI/Button/IconButton_arrow.jsx';
import { CounterButton } from "../UI/Button/CounterButton.jsx";

export const HostPropertyForm = ({ hotel }) => {
    const { t } = useTranslation();
    const { locationApi, offerApi, paramsCategoryApi } = useContext(ApiContext);
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { darkMode } = useContext(ThemeContext);

    const fileRef = useRef(null);
    const [offset, setOffset] = useState(0);
    const [categoriesParams, setCategoriesParams] = useState([]);

    // Стиль стрелок в зависимости от темы
    const classNameArrowLeft = darkMode ? "btn_arrow_left_dark" : "btn_arrow_left_light";
    const classNameArrowRight = darkMode ? "btn_arrow_right_dark" : "btn_arrow_right_light";
    const [countries, setCountries] = useState([]);
    const [allRegions, setAllRegions] = useState([]);
    const [allCities, setAllCities] = useState([]);
    const [allDistricts, setAllDistricts] = useState([]);



        useEffect(() => {
        console.log(language)
        locationApi.getFullCountries(language)
            .then(res => {
                setCountries(res.data)
                console.log({Countries:res.data})
            })
            .catch(err => console.error("Error loading countries:", err));
    }, [language]);

    // useEffect(() => {
    //     console.log(language)
    //     locationApi.getAllRegions(language)
    //         .then(res => {
    //             setAllRegions(res.data)
    //             console.log({AllRegions:res.data})
    //         })
    //         .catch(err => console.error("Error loading countries:", err));
    // }, [language]);
    
    //     useEffect(() => {
    //     console.log(language)
    //     locationApi.getAllCities(language)
    //         .then(res => {
    //             setAllCities(res.data)
    //             console.log({AllCities:res.data})
    //         })
    //         .catch(err => console.error("Error loading countries:", err));
    // }, [language]);

    //      useEffect(() => {
    //     console.log(language)
    //     locationApi.getAllDistricts(language)
    //         .then(res => {
    //             setAllDistricts(res.data)
    //             console.log({Districts:res.data})
    //         })
    //         .catch(err => console.error("Error loading countries:", err));
    // }, [language]);

    // useEffect(() => {
    //     Promise.all([
    //         locationApi.getAllCountries(language),
    //         locationApi.getAllRegions(language),
    //         locationApi.getAllCities(language),
    //         locationApi.getAllDistricts(language)
    //     ])
    //         .then(([countriesRes, regionsRes, citiesRes, districtsRes]) => {
    //             setCountries(countriesRes.data);
    //             setAllRegions(regionsRes.data);
    //             setAllCities(citiesRes.data);
    //             setAllDistricts(districtsRes.data);
    //         })
    //         .catch(console.error);
    // }, [language]);



const handleCountryChange = (e) => {
    const countryId = Number(e.target.value);

    setForm(prev => ({
        ...prev,
        rentObj: {
            ...prev.rentObj,
            countryId,
            regionId: null,
            cityId: null,
            districtId: null
        }
    }));
};

const handleRegionChange = (e) => {
    const regionId = Number(e.target.value);

    setForm(prev => ({
        ...prev,
        rentObj: {
            ...prev.rentObj,
            regionId,
            cityId: null,
            districtId: null
        }
    }));
};

const handleCityChange = (e) => {
    const cityId = Number(e.target.value);

    setForm(prev => ({
        ...prev,
        rentObj: {
            ...prev.rentObj,
            cityId,
            districtId: null
        }
    }));
};

const handleDistrictChange = (e) => {
    const districtId = Number(e.target.value);

    setForm(prev => ({
        ...prev,
        rentObj: {
            ...prev.rentObj,
            districtId
        }
    }));
};


    // Инициализация формы
    const [form, setForm] = useState({
        offer: {
            id: -1,
            title: "",
            description: "",
            titleInfo: "",
            pricePerDay: "",
            pricePerWeek: "",
            pricePerMonth: "",
            tax: null,
            minRentDays: 1,
            allowPets: false,
            allowSmoking: false,
            allowChildren: false,
            allowParties: false,
            maxGuests: 1,
            checkInTime: "11:00:00",
            checkOutTime: "15:00:00",
            ownerId: null,
            rentObjId: null
        },
        rentObj: {
            id: -1,
            countryId: null,
            regionId: null,
            cityId: null,
            districtId: null,
            countryTitle: "",
            cityTitle: "",
            latitude: null,
            longitude: null,
            street: "",
            houseNumber: "",
            postcode: "7900",
            roomCount: 0,
            livingRoomCount: 0,
            bathroomCount: 0,
            area: 0,
            totalBedsCount: 0,
            singleBedsCount: 0,
            doubleBedsCount: 0,
            hasBabyCrib: false,
            paramValues: [],
            images: [],
            newImages: []
        }
    });
const selectedCountry = countries.find(c => c.id === form.rentObj.countryId);
const regions = selectedCountry ? selectedCountry.regions : [];


const selectedRegion = regions.find(r => r.id === form.rentObj.regionId);
const cities = selectedRegion ? selectedRegion.cities : [];

const selectedCity = cities.find(c => c.id === form.rentObj.cityId);
const districts = selectedCity ? selectedCity.districts : [];

    
    // const regions = allRegions.filter(
    //     r => r.countryId === form.rentObj.countryId
    // );

    // const cities = allCities.filter(
    //     c => c.regionId === form.rentObj.regionId
    // );

    // const districts = allDistricts.filter(
    //     d => d.cityId === form.rentObj.cityId
    // );


    // Загрузка категорий параметров
    useEffect(() => {
        paramsCategoryApi.getAllCategories(language)
            .then(res => setCategoriesParams(res.data))
            .catch(err => console.error("Error loading categories:", err));
    }, [language]);

    // Если есть hotel — заполняем форму
    useEffect(() => {
        if (!hotel) return;

        const ro = hotel.rentObj?.[0] || {};
        setForm(prev => ({
            offer: {
                ...prev.offer,
                id: hotel.id,
                title: hotel.title || "",
                description: hotel.description || "",
                pricePerDay: hotel.pricePerDay || "",
                pricePerWeek: hotel.pricePerWeek || "",
                pricePerMonth: hotel.pricePerMonth || "",
                tax: hotel.tax || 0,
                allowPets: hotel.allowPets || false,
                allowSmoking: hotel.allowSmoking || false,
                allowChildren: hotel.allowChildren || false,
                allowParties: hotel.allowParties || false,
                maxGuests: hotel.maxGuests || 1
            },
            rentObj: {
                ...prev.rentObj,
                id: ro.id || -1,
                countryId: ro.countryId || null,
                regionId: ro.regionId || null,
                cityId: ro.cityId || null,
                districtId: ro.districtId || null,
                street: ro.street || "",
                houseNumber: ro.houseNumber || "",
                postcode: ro.postcode || "7900",
                latitude: ro.latitude || null,
                longitude: ro.longitude || null,
                roomCount: ro.roomCount || 0,
                livingRoomCount: ro.livingRoomCount || 0,
                bathroomCount: ro.bathroomCount || 0,
                area: ro.area || 0,
                totalBedsCount: ro.totalBedsCount || 0,
                singleBedsCount: ro.singleBedsCount || 0,
                doubleBedsCount: ro.doubleBedsCount || 0,
                hasBabyCrib: ro.hasBabyCrib || false,
                paramValues: ro.paramValues || [],
                images: ro.images || [],
                newImages: []
            }
        }));
    }, [hotel]);

    // Обработчики изменения полей
    const handleOfferChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            offer: { ...prev.offer, [name]: type === "checkbox" ? checked : value }
        }));
    };

    const handleRentObjChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            rentObj: { ...prev.rentObj, [name]: type === "checkbox" ? checked : (type === "number" ? Number(value) : value) }
        }));
    };

    // Переключение boolean полей
    const toggleOfferField = (field) => setForm(prev => ({
        ...prev,
        offer: { ...prev.offer, [field]: !prev.offer[field] }
    }));

    const toggleRentObjField = (field) => setForm(prev => ({
        ...prev,
        rentObj: { ...prev.rentObj, [field]: !prev.rentObj[field] }
    }));

    // Проверка выбранных параметров
    const isChecked = (paramItemId) => form.rentObj.paramValues.some(p => p.paramItemId === paramItemId && p.valueBool === true);

    const toggleParamValue = (paramItemId) => {
        setForm(prev => {
            const exists = prev.rentObj.paramValues.find(p => p.paramItemId === paramItemId);
            let newValues;

            if (exists) {
                newValues = prev.rentObj.paramValues.map(p =>
                    p.paramItemId === paramItemId ? { ...p, valueBool: !p.valueBool } : p
                );
            } else {
                newValues = [...prev.rentObj.paramValues, { id: -1, rentObjId: prev.rentObj.id, paramItemId, valueBool: true }];
            }

            return { ...prev, rentObj: { ...prev.rentObj, paramValues: newValues } };
        });
    };

    // Работа с изображениями
    const handleAddImages = (e) => {
        const files = Array.from(e.target.files);
        setForm(prev => ({
            ...prev,
            rentObj: { ...prev.rentObj, newImages: [...prev.rentObj.newImages, ...files] }
        }));
    };

    const removeExistingImage = (id) => {
        setForm(prev => ({
            ...prev,
            rentObj: { ...prev.rentObj, images: prev.rentObj.images.filter(img => img.id !== id) }
        }));
    };

    // Формирование FormData для API
    const buildFormData = () => {
        const fd = new FormData();

        // Offer
        Object.entries(form.offer).forEach(([key, value]) => {
            if (value !== null && value !== undefined) fd.append(`offer.${key}`, value);
        });

        // RentObj
        Object.entries(form.rentObj).forEach(([key, value]) => {
            if (key === "images" || key === "newImages" || key === "paramValues") return;
            if (value !== null && value !== undefined) fd.append(`rentObj.${key}`, value);
        });

        // Images
        form.rentObj.images.forEach(img => fd.append("rentObj.imagesIds", img.id));
        form.rentObj.newImages.forEach(file => fd.append("rentObj.images", file));

        // ParamValues
        form.rentObj.paramValues.forEach((p, i) => {
            fd.append(`rentObj.paramValues[${i}].id`, p.id);
            fd.append(`rentObj.paramValues[${i}].rentObjId`, p.rentObjId);
            fd.append(`rentObj.paramValues[${i}].paramItemId`, p.paramItemId);
            fd.append(`rentObj.paramValues[${i}].valueBool`, p.valueBool);
            if (p.valueInt !== undefined) fd.append(`rentObj.paramValues[${i}].valueInt`, p.valueInt);
            if (p.valueString !== undefined) fd.append(`rentObj.paramValues[${i}].valueString`, p.valueString);
        });

        return fd;
    };

    // Сохранение
    const handleSave = async () => {
        const fd = buildFormData();
        if (form.offer.id && form.offer.id !== -1) {
            await offerApi.updateOffer(form.offer.id, fd);
        } else {
            await offerApi.createOffer(fd);
        }
        navigate("/host/offers"); // после сохранения можно редиректить
    };

    return (
        <section className={styles.container}>
            {/* Заголовок */}
            <div className={`${styles.title} flex-center btn-w-full`}>
                <Text text={t("Host.propertyForm.title")} type="m_600_s_36" />
            </div>

            <div className="flex-left gap-5">
                <span className={styles.required_fields}>*</span>
                <Text text={t("Booking.required_fields_note")} type="m_400_s_14" />
            </div>

            {/* Основная информация */}
            <div className={styles.block}>
                <div className={styles.block_title}>
                    <Text text={t("Host.aboutHousing.title")} type="m_600_s_32" />
                </div>

                <fieldset className={styles.fieldset}>
                    <label className={styles.label}>
                        <div className="flex-left gap-5">
                            <Text text={t("Host.aboutHousing.housing.name")} type="m_400_s_16" />
                            <span className={styles.required_fields}>*</span>
                        </div>
                    </label>
                    <input
                        className={styles.input}
                        name="title"
                        value={form.offer.title}
                        onChange={handleOfferChange}
                    />
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <label className={styles.label}>
                        <Text text={t("Host.aboutHousing.housing.address")} type="m_400_s_16" />
                        <span className={styles.required_fields}>*</span>
                    </label>

                    <div className={`${styles.input} flex-left ${styles.input_address}`}>
                        <select
                            className={styles.input_street}
                            value={form.rentObj.countryId ?? ""}
                            onChange={handleCountryChange}
                        >
                            <option value="">{t("Host.aboutHousing.housing.country")}</option>
                            {countries.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>

                        <select
                            className={styles.input_house}
                            value={form.rentObj.regionId ?? ""}
                            onChange={handleRegionChange}
                            disabled={!form.rentObj.countryId}
                        >
                            <option value="">{t("Host.aboutHousing.housing.region")}</option>
                            {regions.map(r => (
                                <option key={r.id} value={r.id}>{r.title}</option>
                            ))}
                        </select>
                    </div>
                </fieldset>


                <fieldset className={styles.fieldset}>
                    <label className={styles.label}>
                        <Text text={t("Host.aboutHousing.housing.address")} type="m_400_s_16" />
                        <span className={styles.required_fields}>*</span>
                    </label>

                    <div className={`${styles.input} flex-left ${styles.input_address}`}>
                        <select
                            className={styles.input_street}
                            value={form.rentObj.cityId ?? ""}
                            onChange={handleCityChange}
                            disabled={!form.rentObj.regionId}
                        >
                            <option value="">{t("Host.aboutHousing.housing.city")}</option>
                            {cities.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>

                        <select
                            className={styles.input_house}
                            value={form.rentObj.districtId ?? ""}
                            onChange={handleDistrictChange}
                            disabled={!form.rentObj.cityId}
                        >
                            <option value="">
                                {t("Host.aboutHousing.housing.district")}
                            </option>
                            {districts.map(d => (
                                <option key={d.id} value={d.id}>{d.title}</option>
                            ))}
                        </select>
                    </div>
                </fieldset>




                <fieldset className={styles.fieldset}>
                    <label className={styles.label}>
                        <div className="flex-left gap-5">
                            <Text text={t("Host.aboutHousing.housing.address")} type="m_400_s_16" />
                            <span className={styles.required_fields}>*</span>
                        </div>
                    </label>

                    <div className={`${styles.input} flex-left ${styles.input_address}`}>
                        <input
                            className={styles.input_street}
                            name="street"
                            placeholder={t("Host.aboutHousing.housing.street")}
                            value={form.rentObj.street}
                            onChange={handleRentObjChange}
                        />
                        <input
                            className={styles.input_house}
                            name="houseNumber"
                            placeholder={t("Host.aboutHousing.housing.number")}
                            value={form.rentObj.houseNumber}
                            onChange={handleRentObjChange}
                        />
                    </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <label className={styles.label}>
                        <div className="flex-left gap-5">
                            <Text text={t("Host.aboutHousing.housing.description")} type="m_400_s_16" />
                            <span className={styles.required_fields}>*</span>
                        </div>
                    </label>
                    <textarea
                        className={styles.textarea}
                        name="description"
                        value={form.offer.description}
                        onChange={handleOfferChange}
                    />
                </fieldset>
            </div>

            {/* Фото */}
            <div className={styles.block}>
                <div className={styles.label}>
                    <Text text={t("Host.propertyForm.owner.photo")} type="m_400_s_16" />
                </div>
                <div className={styles.photosWrapper}>
                    <div className={styles.photosViewport}>
                        <div
                            className={styles.photos__container}
                            style={{ transform: `translateX(${offset}px)` }}
                        >
                            {form.rentObj.images.length > 0 ? (
                                form.rentObj.images.map(img => (
                                    <img key={img.id} src={img.url} alt="" className={styles.previewImage} />
                                ))
                            ) : (
                                <div className={styles.emptyImages}>Нет изображений</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.btn_container}>
                    <IconButtonArrow
                        onClick={() => setOffset(o => Math.min(o + 300, 0))}
                        className={classNameArrowLeft}
                    />
                    <div className={` ${styles.btn__wrapper} flex-center btn-w-full`}>
                        <input
                            ref={fileRef}
                            type="file"
                            multiple
                            hidden
                            onChange={handleAddImages}
                        />
                        <ActionButton__Secondary
                            onClick={() => fileRef.current.click()}
                            className={`btn-br-r-20 ${styles.btn_add_photo}`}
                            text={t("Prrofile.HousingPanel.menu_btn_add_housing")}
                        />
                    </div>
                    <IconButtonArrow
                        onClick={() =>
                            setOffset(o =>
                                Math.max(o - 300, -Math.max(0, (form.rentObj.images.length * 140) - 420))
                            )
                        }
                        className={classNameArrowRight}
                    />
                </div>
            </div>

            {/* Параметры / Удобства */}
            <div className={styles.block}>
                <div className={styles.block_title}>
                    <Text text={t("Host.amenities.title")} type="m_600_s_32" />
                </div>
                <div className={styles.fieldset}>
                    {categoriesParams.map(category => {
                        if (category.id === 5) return null; // пропускаем категорию 5
                        const visibleItems = category.items.filter(item => item.title && item.title.trim() !== "");
                        if (!visibleItems.length) return null;

                        return (
                            <div key={category.id} className={styles.checkbox__container}>
                                <div className={styles.block_title}>
                                    <Text type="m_600_s_24" text={category.title} />
                                </div>
                                <div className={styles.checkboxGrid}>
                                    {visibleItems.map(item => (
                                        <label key={item.id} className={styles.checkbox}>
                                            <Text type="m_400_s_16" text={item.title} />
                                            <input
                                                type="checkbox"
                                                className={styles.checkboxInput}
                                                checked={isChecked(item.id)}
                                                onChange={() => toggleParamValue(item.id)}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Данные об объекте */}
            <div className={`${styles.block} ${styles.block_with_border}`}>
                <div className={styles.block_with_border_title}>
                    <Text text={t("Host.dataHousing.title")} type="m_600_s_32" />
                </div>

                <div className={styles.block_with_border__row}>
                    <Text text={t("Host.dataHousing.guestCount")} type="m_700_s_20" />
                    <CounterButton value={form.offer.maxGuests} onChange={val => setForm(prev => ({ ...prev, offer: { ...prev.offer, maxGuests: val } }))} />
                </div>
                <div className={styles.block_with_border__row}>
                    <Text text={t("Host.dataHousing.roomCount")} type="m_700_s_20" />
                    <CounterButton value={form.rentObj.roomCount} onChange={val => setForm(prev => ({ ...prev, rentObj: { ...prev.rentObj, roomCount: val } }))} />
                </div>
                <div className={styles.block_with_border__row}>
                    <Text text={t("Host.dataHousing.singleBedsCount")} type="m_700_s_20" />
                    <CounterButton value={form.rentObj.singleBedsCount} onChange={val => setForm(prev => ({ ...prev, rentObj: { ...prev.rentObj, singleBedsCount: val } }))} />
                </div>
                <div className={styles.block_with_border__row}>
                    <Text text={t("Host.dataHousing.doubleBedsCount")} type="m_700_s_20" />
                    <CounterButton value={form.rentObj.doubleBedsCount} onChange={val => setForm(prev => ({ ...prev, rentObj: { ...prev.rentObj, doubleBedsCount: val } }))} />
                </div>
            </div>

            {/* Цена */}
            <div className={styles.block_price}>
                <div className={styles.block_price__row}>
                    <div className={styles.block_with_border_title}>
                        <Text text={t("Host.dataHousing.pricePerDay")} type="m_600_s_32" />
                    </div>
                    <input
                        type="number"
                        className={styles.input_price}
                        name="pricePerDay"
                        value={form.offer.pricePerDay}
                        onChange={handleOfferChange}
                    />
                </div>
                <div className={styles.block_price__row}>
                    <div className={styles.block_price_title}>
                        <Text text={t("Host.dataHousing.pricePerWeek")} type="m_600_s_32" />
                    </div>
                    <input
                        type="number"
                        className={styles.input_price}
                        name="pricePerWeek"
                        value={form.offer.pricePerWeek}
                        onChange={handleOfferChange}
                    />
                </div>


            </div>

            {/* Actions */}
            <div className={styles.actions}>
                {/* <ActionButton__Secondary
                    className="btn-br-r-20 btn-w-340 btn-h-60"
                    text={t("Host.btn_add")}
                    type="m_500"
                /> */}
                <ActionButton__Primary
                    className="btn-br-r-20 btn-w-340 btn-h-60"
                    text={t("Host.btn_save")}
                    type="m_500"
                />
            </div>
        </section>
    );
};
