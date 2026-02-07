import React, { useState, useContext, useRef, useEffect } from 'react';
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { ApiContext } from "../../contexts/ApiContext.jsx";
import { Text } from "../UI/Text/Text.jsx";
import { ActionButton__Primary } from "../UI/Button/ActionButton_Primary.jsx";
import { IconButtonClose } from "../../components/UI/Button/IconButton_close.jsx";
import { GoogleButton } from '../UI/Button/GoogleButton.jsx';
import { RadioGroup } from '../UI/Button/RadioGroup.jsx';

import "../../styles/globals.css";
import styles from "./RegisterModal.module.css";

const handleSearchResults = (results) => {
    console.log('Search results:', results);
};



export const RegisterModal = ({ setIsModalOpen }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { register } = useContext(AuthContext);
    const { locationApi } = useContext(ApiContext);
    const { language } = useLanguage();
    const contentRef = useRef(null);
    const [hasScroll, setHasScroll] = useState(false);
    const [displayPassword, setDisplayPassword] = useState("");
    const [countries, setCountries] = useState([]);
  
  const [activeButton, setActiveButton] = useState("owner");

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        countryId: null,
        email: "",
        birthDate: null,
        phoneNumber: "",
        roleName: ""
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log({

            password: formData.password, 
        });

        if (name === "password") {
            const newDisplay = value;
            const oldDisplay = displayPassword;
            const oldPassword = formData.password;
            let newPassword = oldPassword;

            if (newDisplay.length > oldDisplay.length) {
                const addedChar = newDisplay[newDisplay.length - 1];
                newPassword += addedChar;
            }
            
            else if (newDisplay.length < oldDisplay.length) {
                newPassword = oldPassword.slice(0, newDisplay.length);
            }

            setFormData(prev => ({ ...prev, password: newPassword }));

            if (newPassword.length === 0) {
                setDisplayPassword("");
                return;
            }
            setDisplayPassword("●".repeat(newPassword.length - 1) + newPassword.slice(-1));
            setTimeout(() => {
                setDisplayPassword("●".repeat(newPassword.length));
            }, 300);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };


    useEffect(() => {
        console.log(language)
        locationApi.getAllCountries(language)
            .then(res => {
                setCountries(res.data)
                console.log(res.data)
            })
            .catch(err => console.error("Error loading countries:", err));
    }, [language]);



    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;

        const checkScroll = () => {
            setHasScroll(el.scrollHeight > el.clientHeight);
        };

        checkScroll();
        window.addEventListener("resize", checkScroll);

        return () => window.removeEventListener("resize", checkScroll);
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ data: formData });
          console.log({ roleName: activeButton });
        try {
            const result = await register({
                username: formData.username,
                countryId: formData.countryId,
                email: formData.email,
                birthDate: new Date(formData.birthDate).toISOString(),
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                roleName: activeButton
            }
            );
            console.log("Registration success:", result);
            if (result.success) {
                navigate("/");
                setIsModalOpen(false);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Registration error:", error);
        }
    };


    return (
        <div className={styles.registerPage}>
            <IconButtonClose
                className={`closeBtn ${hasScroll ? "withScroll" : ""
                    }`}
                onClick={() => setIsModalOpen(false)}
            />
            <div
                ref={contentRef}
                className={`${styles.registerPage_content} p-25`}
            >

                <span className={`${styles.registerPage__title_wrapper} mb-30  `}>
                    <Text text={t("Auth.register.title")} type="m_700_s_48" />
                </span>
                <span className={`${styles.registerPage__subtitle_wrapper} mb-50`}  >
                    <Text text={t("Auth.register.welcome_new")} type="m_500" />
                </span>


                <form className={`${styles.registerPage__form} gap-30 mt-10`} onSubmit={handleSubmit}>
                    {/* google */}
                    <span className={`${styles.googleButton__wrapper} flex-center mt-10 mb-50`}>
                        < GoogleButton text={t("Auth.register.google")} className="btn-w-1165 btn-h-100 btn-br-r-15" />
                    </span>

                    <div className={`${styles.line_wrapper} gap-12`}>
                        <div className={`${styles.line} ${styles.left} `}>
                            <div className={styles.circle}></div>
                        </div>
                        <Text text={t("Auth.register.or")} type="text_m_500_s_40" />
                        <div className={`${styles.line} ${styles.right}`}>
                            <div className={styles.circle}></div>
                        </div>
                    </div>

                    {/* Username */}
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder={t("Auth.register.name")}
                        className={`${styles.input} btn-h-120  btn-br-r-20 p-10`}
                        required
                    />
                    {/* country */}
                    {/* Country select */}
                    <select
                        name="countryId"
                        value={formData.countryId || ""}
                        onChange={e => setFormData(prev => ({
                            ...prev,
                            countryId: Number(e.target.value)
                        }))}
                        className={`${styles.input} btn-h-120  btn-br-r-20 p-10`}
                        required
                    >
                        <option value="" disabled>{t("Auth.register.country")}</option>
                        {countries?.map(country => (
                            <option key={country.id} value={country.id}>
                                {country.title}
                            </option>
                        ))}
                    </select>

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t("Auth.register.email")}
                        className={`${styles.input} btn-h-120  btn-br-r-20 p-10`}
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        value={formData.birthDate}
                        placeholder={t("Auth.register.birthDate")}
                        className={`${styles.input} btn-h-120  btn-br-r-20 p-10`}
                        max={new Date().toISOString().split("T")[0]}
                    />
                    {/* Phone */}
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder={t("Auth.register.phone")}
                        className={`${styles.input} btn-h-120 btn-w-1165 btn-br-r-20 p-10`}
                        required
                    />

                    {/* Password */}
                    <input
                        type="text"
                        name="password"
                        value={displayPassword}
                        onChange={handleChange}
                        placeholder={t("Auth.login.password")}
                        className={`${styles.input} btn-h-120 btn-w-1165 btn-br-r-20 p-10`}
                        autoComplete="new-password"
                        required
                    />
                    <div className={styles.radioButton_wrapper}>
                        <RadioGroup 
                        activeButton ={activeButton}
                        setActiveButton={setActiveButton}
                        />
                        {/* <RadioButton text={t("Auth.register.owner")} />
                        <RadioButton text={t("Auth.register.client")} /> */}
                    </div>
                    <span className={`${styles.actionButton__wrapper} flex-center mb-30`}>
                        <ActionButton__Primary 
                         text={t("Auth.register.registerButton")}
                         type="m_600_s_36"
                          className="btn-w-1165 btn-h-100 btn-br-r-20"
                       />
                    </span>

                </form>
            </div>
        </div>
    );
};
