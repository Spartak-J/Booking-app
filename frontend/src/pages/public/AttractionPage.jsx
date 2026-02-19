import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Header_Full } from "../../components/Header/Header_Full.jsx";
import { Footer } from "../../components/Footer/Footer.jsx";
import { IconButton_Search } from "../../components/UI/Button/IconButton_Search.jsx";
import { ApiContext } from "../../contexts/ApiContext.jsx";
import { useLanguage } from "../../contexts/LanguageContext";

import styles from "./AttractionPage.module.css";


const Attraction = {
  id: 1,
  slug: 'opera-theatre',
  title: 'Театр опери та балету імені Соломії Крушельницької',
  description: `Львівський оперний театр входить до списку обов’язкового відвідування усіх туристів та гостей міста. Якщо не послухати оперу чи подивитись балет, то точно хоча б оглянути фасад будівлі.
Це один із найгарніших театрів не тільки Львова, а й всієї Європи. До слова, ця будівля була збудована всього лише за три роки і вже у 1900 році в ній було презентовано першу виставу. Ще більше вражає ця дата, якщо уточнити, що для будівництва театру спеціально змінювали природний хід річки Полтви. Тепер вона тече під львівською бруківкою.
Окрім візуальної краси у Львівському оперному театрі можна насолоджуватись високоякісними постановками опер, оперет, балетів: чистим звучанням голосів акторів та довершеними й відточеними рухами балерин та балерунів.
Репертуар театру складають кращі зразки українського та європейського музичного мистецтва: опери «Аїда», «Травіата» Джузеппе Верді, «Кармен» Жоржа Бізе, «Мадам Баттерфляй» Джакомо Пуччіні, «Орфей і Еврідіка» Крістофа Віллібальда Глюка, українська опера «Запорожець за Дунаєм» Семена Гулака – Артемовського; балет «Лебедине озеро» Петра Чайковського, «Жізель» та «Корсар» Адольфа Адана, «Дон Кіхот» Людвіга Мінкуса, «Ромео і Джульєтта» Сергія Прокоф’єва…`,
  images: [
    '/img/city/Kyiv.svg',
    '/img/city/Kyiv.svg',
    '/img/city/Kyiv.svg',
    '/img/city/Kyiv.svg',
    '/img/city/Kyiv.svg',
  ],
};



export const AttractionPage = () => {
  const { paramsCategoryApi } = useContext(ApiContext);
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [openCityFilterMenu, setOpenCityFilterMenu] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(true);

  const lat = 48.8566;
  const lng = 2.3522;
  const { t } = useTranslation();


   const handleSearchClick = () => {
    navigate("/attractionByCity"); 
  };
  return (
    <div className={styles.attraction_page}>
      <Header_Full titleBtn="city" title={Attraction.title} showFilterBtn={false} openFilterMenu={openCityFilterMenu} setOpenFilterMenu={setOpenCityFilterMenu} />

      <main className={styles.attraction_page__content}>
        <section className="container-fluid my-5">
          <div className="row align-items-start g-4">


            <div className="col-lg-5">
              <div
                className="  rounded-4 w-100 d-flex flex-column"
                style={{ gap: "55px" }}
              >
                <div className="mb-3">
                  <div className="mb-3">
                    <div className="input-group" style={{ border: '1px solid #ced4da', borderRadius: '0.375rem', overflow: 'hidden' }}>
                      <input
                        type="text"
                        className="form-control border-0"
                        placeholder="Місто"
                        aria-label="Місто"
                        style={{ boxShadow: 'none' }}
                      />
                      <button
                        className="btn btn-outline-secondary border-0"
                        type="button"
                        aria-label="search"
                        style={{
                          pointerEvents: 'auto',
                          backgroundColor: 'transparent',
                          boxShadow: 'none',
                          borderLeft: '1px solid #ced4da',
                        }}
                          onClick={handleSearchClick}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'transparent'}  // отключаем hover
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <IconButton_Search icon_name="search" />
                      </button>
                    </div>
                  </div>

                </div>
                <p className="mb-4">
                  Відкривай для себе нові незабутні локації! Пізнавай разом з нами
                  багату історію України та всього світу, подорожуй у кращі місця
                  та знаходь найкраще житло у визначних локаціях.
                </p>

              </div>
            </div>
            <div className="col-lg-7">
              <div style={{
                height: "454px",
                width: "100%",
                overflow: "hidden",
                borderRadius: "20px"
              }}>
                <img
                  src="img/attractions/default.svg"
                  alt="Атракція"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </div>
            </div>

          </div>
        </section>
      </main >
      <Footer />


    </div >
  );
};

