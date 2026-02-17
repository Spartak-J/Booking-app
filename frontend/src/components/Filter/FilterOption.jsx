import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./FilterOption.module.css"; 

import {StateButton__Filter} from "../UI/Button/StateButton_Filter.jsx";

 const iconSizes = {
  "Wi-Fi": { w: 19, h: 15 },
  AirConditioning: { w: 24, h: 24 },
  TV: { w: 18, h: 18 },
  WorkDesk: { w: 18, h: 18 },
  PetsAllowed: { w: 18, h: 18 },
  FreeParking: { w: 18, h: 18 },
  WashingMachine: { w: 18, h: 22 },
  Iron: { w: 20, h: 14 },
  ElectricKettle: { w: 19, h: 20 },
  Balcony: { w: 18, h: 11 },
  Terrace: { w: 14, h: 16 },
  Kitchen: { w: 15, h: 16 },
  SingleBed: { w: 26, h: 20 },
  DoubleBed: { w: 26, h: 20 },
};


export const FilterOption = ({ option,className, isSelected, onClick }) => {
  const { t } = useTranslation();
  const size = iconSizes[option.iconName] || { w: 24, h: 24 };

  return (
    <label className={styles.filterOption}>
      <StateButton__Filter
        text={t(option.title)}
        iconName={option.iconName}
        sizeX={size.w}
        sizeY={size.h}
        classNameIcon="icon_param_filter"
        className={className}
        onClick={onClick}
        active={isSelected}   
      />
    </label>
  );
};

