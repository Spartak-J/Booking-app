import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";

import { StateButton_Profile } from "../../components/UI/Button/StateButton_Profile.jsx";
import { Header } from "../../components/Header/Header.jsx";
import { LoginModal } from "../../components/modals/LoginModal.jsx";
import { RegisterModal } from "../../components/modals/RegisterModal.jsx";
import { Footer } from "../../components/Footer/Footer.jsx";
import { ProfilePageMenu } from "../../components/ProfilePage_components/ProfilePage_menu.jsx";
import { MainPageBg } from "../../components/MainPage_bg/MainPage_bg.jsx";
import { Text } from "../../components/UI/Text/Text.jsx";


import styles from "./AdminDashboard.module.css";


export const AdminDashboard = () => {
  const { user, token, getMe } = useContext(AuthContext);
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
const [activeKey, setActiveKey] = useState("account");

  useEffect(() => {
    if (token) {
      getMe(language);
    }
  }, [language, token]);

  const baseButtons = [
    { key: "account", icon: "menu_btn_account", text: t("Prrofile.menu_btn_account") },
    { key: "travels", icon: "menu_btn_my_travels", text: t("Prrofile.menu_btn_my_travels") },
    { key: "payment", icon: "menu_btn_payment_info", text: t("Prrofile.menu_btn_payment_info") },
  ];

  const hostOnlyButtons = [
    { key: "housing", icon: "menu_btn_housing", text: t("Prrofile.menu_btn_my_housing") },
  ];

  const commonBottomButtons = [
    { key: "help", icon: "menu_btn_help", text: t("Prrofile.menu_btn_help") },
    { key: "privacy", icon: "menu_btn_privacy", text: t("Prrofile.menu_btn_privacy") },
    { key: "history", icon: "menu_btn_history", text: t("Prrofile.menu_btn_history") },
    { key: "logout", icon: "menu_btn_logout", text: t("Prrofile.menu_btn_logout") },
  ];
    const buttons = [
    ...baseButtons,
    ...commonBottomButtons,
  ];

  const renderRightPanel = (key) => {
    // switch (key) {
    //   case "account": return <AccountPanel user={user} />;
    //   case "travels": return <MyTravelsPanel isActivePanel={true} />;
    //   case "payment": return <PaymentInfoPanel />;
    //   case "help": return <HelpPanel />;
    //   case "housing": return <HousingPanel />;
    //   case "privacy": return <PrivacyPanel />;
    //   case "history": return <HistoryPanel isHistoryPanel={true} />;
    //   case "message": return <MessagePanel />;
    //   default: return null;
    // }
  };

  const handleButtonClick = async (key) => {
      setActiveKey(key);
  };

  return (
    <div className={styles.adminDashboard}>
      <Header isLoginModalOpen={isLoginModalOpen} setIsLoginModalOpen={setIsLoginModalOpen} />

      <MainPageBg />
      <main >
        <div className={styles.adminDashboard__container}>
            <div className={styles.adminDashboard__columns}>
              <div className={styles.adminDashboard__column_left}>
                {buttons.map(btn => (
                  <StateButton_Profile
                    key={btn.key}
                    text={btn.text}
                    icon_name={btn.icon}
                    className={`btn-w-425 btn-h-60 btn-br-r-20 ${styles.menu_btn}`}
                    isActive={activeKey === btn.key}
                    onClick={() => handleButtonClick(btn.key)}
                  />
                ))}
              </div>
              <div className={styles.adminDashboard__column_right}>
                {renderRightPanel(activeKey)}
              </div>
            </div>
          </div>

        {/* {user ? (
          <AdminPageMenu user={user} />
        ) : (
          <div className="spinner-wrapper">
            <div className="spinner" />
            <span>Загрузка...</span>
          </div>
        )} */}


      </main>
      <Footer />
    </div>
  );
};
