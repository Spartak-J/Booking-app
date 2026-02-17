import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import { Header_Full } from "../../components/Header/Header_Full.jsx";
import { Footer } from "../../components/Footer/Footer.jsx";
import { PlaceCard_carousel } from "../../components/PlacesCard/PlaceCard_carousel.jsx"

import { ApiContext } from "../../contexts/ApiContext.jsx";
import { useLanguage } from "../../contexts/LanguageContext";

import styles from "./AttractionCarouselPage.module.css";


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

const attractionList = [
  {
    id: 1,
    slug: 'opera-theatre',
    title: 'Театр опери та балету ім. Соломії Крушельницької',
    imageSrc: '/img/attractions/SolomiyaKrushelnytska.jpg'
  },
  {
    id: 2,
    slug: 'latin-cathedral',
    title: 'Латинський кафедральний собор',
    imageSrc: '/img/attractions/beer.jpg'
  },
  {
    id: 3,
    slug: 'ivano-frankivsk-museum',
    title: 'Музей Івана Франка',
    imageSrc: '/img/attractions/block_203281.jpg'
  },
  {
    id: 4,
    slug: 'high-castle',
    title: 'Високий Замок',
    imageSrc: '/img/attractions/ElżbietaChurch.jpg'
  },
  {
    id: 5,
    slug: 'italian-courtyard',
    title: 'Італійський дворик',
    imageSrc: '/img/attractions/ItalianCourtyard.jpg'
  },
  {
    id: 6,
    slug: 'latin-cathedral',
    title: 'Латинський кафедральний собор',
    imageSrc: '/img/attractions/lviv-opera.jpg'
  },
  {
    id: 7,
    slug: 'ivano-frankivsk-museum',
    title: 'Музей Івана Франка',
    imageSrc: '/img/attractions/opera1.jpg'
  },
];



export const AttractionCarouselPage = () => {
  const { paramsCategoryApi } = useContext(ApiContext);
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [openCityFilterMenu, setOpenCityFilterMenu] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(true);

  const lat = 48.8566;
  const lng = 2.3522;
const { t } = useTranslation();

  return (
    <div className={styles.cityPage}>
      <Header_Full titleBtn="city" title ={Attraction.title} showFilterBtn={false} openFilterMenu={openCityFilterMenu} setOpenFilterMenu={setOpenCityFilterMenu} />

      <main className={styles.hotel_page__content}>
        {/* <AttractionGallery images={Attraction.images} />
        <div className={styles.description_container}>
          <div className={styles.text_column}>
            <p>{Attraction.description}</p>
          </div>
          <div className={styles.map_column}>
            <div className={`${styles.card_map} flex-left btn-w-full`} >
              {lat && lng ? (
                <HotelMap lat={lat} lng={lng} minHeight="280"/>
              ) : (
                <div className={styles.mapPlaceholder}>Координаты отсутствуют</div>
              )}
            </div>
            <div className={`flex-center btn-w-full ${styles.btn_container}`}>
              <ActionButton__Primary text ={t("Attraction.find_housing")} className='btn-w-573  btn-h-59 btn-br-r-20'/>
            </div>
          </div>
        </div> */}
         <PlaceCard_carousel list={attractionList} />
      </main >
      <Footer />


    </div >
  );
};

