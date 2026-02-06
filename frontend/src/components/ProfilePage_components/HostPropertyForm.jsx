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
    const { offerApi } = useContext(ApiContext);
    const { paramsCategoryApi } = useContext(ApiContext);
    const navigate = useNavigate();
    const { language } = useLanguage();
    const fileRef = useRef(null);
    const [offset, setOffset] = useState(0);
    const { darkMode } = useContext(ThemeContext);
    const [categoriesParams, setCategoriesParams] = useState([]);

    const classNameArrowLeft = darkMode
        ? "btn_arrow_left_dark"
        : "btn_arrow_left_light";

    const classNameArrowRight = darkMode
        ? "btn_arrow_right_dark"
        : "btn_arrow_right_light";

    useEffect(() => {
        console.log(language)
        paramsCategoryApi.getAllCategories(language)
            .then(res => {
                setCategoriesParams(res.data)
                console.log({ categoriesParams: res.data })
            })
            .catch(err => console.error("Error loading countries:", err));
    }, [language]);

    const amenitiesKeys = [
        "Host.amenities.wifi",
        "Host.amenities.bath",
        "Host.amenities.kitchen",
        "Host.amenities.ac",
        "Host.amenities.tv",
        "Host.amenities.washingMachine",
        "Host.amenities.iron",
        "Host.amenities.electricKettle",
        "Host.amenities.windowView",
        "Host.amenities.coffeeTea",
        "Host.amenities.workDesk",
        "Host.amenities.petsAllowed"
    ];


    const [form, setForm] = useState({
        id: null,
        title: "",
        description: "",
        pricePerDay: "",
        pricePerWeek: "",
        pricePerMonth: "",
        tax: 0,

        allowPets: false,
        allowSmoking: false,
        allowChildren: false,
        allowParties: false,
        maxGuests: 1,

        rentObj: {
            id: null,
            countryId: null,
            regionId: null,
            cityId: null,
            districtId: null,
            street: "",
            houseNumber: "",
            postcode: "",
            latitude: null,
            longitude: null,
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
        }
    });

    useEffect(() => {
        if (!hotel) return;

        const ro = hotel.rentObj?.[0] || {};

        setForm({
            id: hotel.id,
            title: hotel.title || "",
            description: hotel.description || "",
            pricePerDay: hotel.pricePerDay || "",
            pricePerWeek: hotel.pricePerWeek || "",
            pricePerMonth: hotel.pricePerMonth || "",
            tax: hotel.tax || 0,

            allowPets: hotel.allowPets,
            allowSmoking: hotel.allowSmoking,
            allowChildren: hotel.allowChildren,
            allowParties: hotel.allowParties,
            maxGuests: hotel.maxGuests || 1,

            rentObj: {
                id: ro.id,
                countryId: ro.countryId,
                regionId: ro.regionId,
                cityId: ro.cityId,
                districtId: ro.districtId,
                street: ro.street || "",
                houseNumber: ro.houseNumber || "",
                postcode: ro.postcode || "",
                latitude: ro.latitude,
                longitude: ro.longitude,
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
        });
    }, [hotel]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleRentObjChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            rentObj: {
                ...prev.rentObj,
                [name]: value
            }
        }));
    };
    const toggleField = (field) => {
        setForm(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const isChecked = (id) =>
        form.rentObj.paramValues?.some(
            p => p.paramItemId === id && p.valueBool
        );


    const toggleParam = (item) => {
        setForm(prev => {
            const exists = prev.rentObj.paramValues.find(
                p => p.paramItemId === item.id
            );

            return {
                ...prev,
                rentObj: {
                    ...prev.rentObj,
                    paramValues: exists
                        ? prev.rentObj.paramValues.map(p =>
                            p.paramItemId === item.id
                                ? { ...p, valueBool: !p.valueBool }
                                : p
                        )
                        : [
                            ...prev.rentObj.paramValues,
                            {
                                paramItemId: item.id,
                                valueBool: true
                            }
                        ]
                }
            };
        });
    };

    const handleAddImages = (e) => {
        const files = Array.from(e.target.files);
        setForm(prev => ({
            ...prev,
            rentObj: {
                ...prev.rentObj,
                newImages: [...prev.rentObj.newImages, ...files]
            }
        }));
    };
    const removeExistingImage = (id) => {
        setForm(prev => ({
            ...prev,
            rentObj: {
                ...prev.rentObj,
                images: prev.rentObj.images.filter(img => img.id !== id)
            }
        }));
    };

    const buildFormData = () => {
        const fd = new FormData();

        // Offer
        fd.append("id", form.id);
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("pricePerDay", form.pricePerDay);
        fd.append("pricePerWeek", form.pricePerWeek);
        fd.append("pricePerMonth", form.pricePerMonth);
        fd.append("tax", form.tax);

        fd.append("allowPets", form.allowPets);
        fd.append("allowSmoking", form.allowSmoking);
        fd.append("allowChildren", form.allowChildren);
        fd.append("allowParties", form.allowParties);
        fd.append("maxGuests", form.maxGuests);


        Object.entries(form.rentObj).forEach(([key, value]) => {
            if (key === "images" || key === "newImages") return;
            fd.append(`rentObj.${key}`, value);
        });

        form.rentObj.images.forEach(img => {
            fd.append("rentObj.imagesIds", img.id);
        });


        form.rentObj.newImages.forEach(file => {
            fd.append("rentObj.images", file);
        });

        return fd;
    };
    const handleSave = async () => {
        const fd = buildFormData();
        await offerApi.updateOffer(form.id, fd);
    };



    return (
        <section className={`${styles.container} `}>
            <div className={`${styles.title} flex-center btn-w-full`}>
                <Text
                    text={t("Host.propertyForm.title")}
                    type="m_600_s_36" />
            </div>


            <div className="flex-left gap-5">
                <span className={styles.required_fields}>*</span>
                <Text text={t("Booking.required_fields_note")} type="m_400_s_14" />
            </div>






            {/* Address */}

            <div className={styles.block}>
                <div className={styles.block_title}>
                    <Text
                        text={t("Host.aboutHousing.title")}
                        type="m_600_s_32" />
                </div>
                <fieldset className={styles.fieldset}>
                    <label className={styles.label}>
                        <div className="flex-left gap-5">
                            <Text
                                text={t("Host.aboutHousing.housing.name")}
                                type="m_400_s_16" />
                            <span className={styles.required_fields}>*</span>
                        </div>
                    </label>
                    <input
                        className={styles.input}
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                    />

                </fieldset>
                <fieldset className={styles.fieldset}>
                    <label className={styles.label}>
                        <div className="flex-left gap-5">

                            <Text
                                text={t("Host.aboutHousing.housing.address")}
                                type="m_400_s_16" />
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
                            type="text"
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

                            <Text
                                text={t("Host.aboutHousing.housing.description")}
                                type="m_400_s_16" />
                            <span className={styles.required_fields}>*</span>
                        </div>
                    </label>
                    <textarea
                        className={styles.textarea}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />

                </fieldset>
            </div>

            {/* Photos */}
            <div className={styles.block}>
                <div className={styles.label}>
                    <Text
                        text={t("Host.propertyForm.owner.photo")}
                        type="m_400_s_16" />
                </div>
                <div className={styles.photosWrapper}>
                    <div className={styles.photosViewport}>
                        <div
                            className={styles.photos__container}
                            style={{ transform: `translateX(${offset}px)` }}
                        >
                            {form.rentObj.images.map(img => (
                                <img
                                    key={img.id}
                                    src={img.url}
                                    alt=""
                                    className={styles.previewImage}
                                />
                            ))}
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
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                setForm(prev => ({
                                    ...prev,
                                    rentObj: {
                                        ...prev.rentObj,
                                        newImages: [...prev.rentObj.newImages, ...files]
                                    }
                                }));
                            }}
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
                                Math.max(o - 300, -((form.rentObj.images.length * 140) - 420))
                            )
                        }
                        className={classNameArrowRight}
                    />
                </div>
            </div>

            {/* Amenities */}
            <div className={styles.block}>
                <div className={styles.block_title}>
                    <Text
                        text={t("Host.amenities.title")}
                        type="m_600_s_32" />
                </div>
                <div className={styles.fieldset}>
                    {categoriesParams.map(category => {
                        if (category.id === 5) return null;
                        const visibleItems = category.items.filter(
                            item => item.title && item.title.trim() !== ""
                        );

                        if (!visibleItems.length) return null;

                        return (
                            <div key={category.id} className={styles.checkbox__container}>

                                {/* TITLE */}
                                <div className={styles.block_title}>
                                    <Text
                                        type="m_600_s_24"
                                        text={category.title}
                                    />
                                </div>

                                {/* ITEMS */}
                                <div className={styles.checkboxGrid}>
                                    {visibleItems.map(item => (
                                        <label key={item.id} className={styles.checkbox}>
                                            <Text
                                                type="m_400_s_16"
                                                text={item.title}
                                            />

                                            <input
                                                type="checkbox"
                                                className={styles.checkboxInput}
                                                checked={isChecked(item.id)}
                                                onChange={() => toggleParam(item)}
                                            />
                                        </label>
                                    ))}
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>

            {/* Data */}
            <div className={`${styles.block} ${styles.block_with_border}`}>
                <div className={styles.block_with_border_title}>
                    <Text
                        text={t("Host.dataHousing.title")}
                        type="m_600_s_32" />
                </div>
                <div className={styles.block_with_border__row}>
                    <Text
                        text={t("Host.dataHousing.guestCount")}
                        type="m_700_s_20" />
                    <CounterButton />
                </div>
                <div className={styles.block_with_border__row}>
                    <Text
                        text={t("Host.dataHousing.roomCount")}
                        type="m_700_s_20" />
                    <CounterButton />
                </div>
                <div className={styles.block_with_border__row}>
                    <Text
                        text={t("Host.dataHousing.singleBedsCount")}
                        type="m_700_s_20" />
                    <CounterButton />
                </div>
                <div className={styles.block_with_border__row}>
                    <Text
                        text={t("Host.dataHousing.doubleBedsCount")}
                        type="m_700_s_20" />
                    <CounterButton />
                </div>
            </div>

            {/* Price */}
            <div className={styles.block_price}>
                <div className={styles.block_price__row}>
                    <div className={styles.block_with_border_title}>
                        <Text
                            text={t("Host.dataHousing.pricePerDay")}
                            type="m_600_s_32" />
                    </div>
                    <input
                        type="text"
                        className={styles.input_price}
                        name="houseNumber"
                        placeholder={t("Host.aboutHousing.housing.number")}
                        value={form.rentObj.houseNumber}
                        onChange={handleRentObjChange}
                    />
                </div>
                <div className={styles.block_price__row}>
                    <div className={styles.block_with_border_title}>
                        <Text
                            text={t("Host.dataHousing.pricePerWeek")}
                            type="m_600_s_32" />
                    </div>
                    <input
                        type="text"
                        className={styles.input_price}
                        name="houseNumber"
                        placeholder={t("Host.aboutHousing.housing.number")}
                        value={form.rentObj.houseNumber}
                        onChange={handleRentObjChange}
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
