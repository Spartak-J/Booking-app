import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Text.module.css";

export const Breadcrumbs = ({
  country = "Украина",
  region = "Львовская область",
  city,
  district,
  hotelTitle,
  last_path = ""
}) => {
  const { t } = useTranslation();
  const parts = [
    country && country.trim() && {
      label: country,
      to: `/country/${encodeURIComponent(country)}`
    },
    region && region.trim() && {
      label: region,
      to: `/region/${encodeURIComponent(region)}`
    },
    city && city.trim() && {
      label: city,
      to: `/city/${encodeURIComponent(city)}`
    },
    district && district.trim() && {
      label: district,
      to: `/district/${encodeURIComponent(district)}`
    }
  ].filter(Boolean);

  const items = [
    { label: t("menu_home"), to: "/" },
    ...parts
  ];

  if (last_path && last_path.trim()) {
    items.push({ label: last_path, to: null });
  }

  if (hotelTitle && hotelTitle.trim()) {
    items.push({ label: hotelTitle, to: null });
  }

  return (
    <div className={styles.breadcrumbs}>
      {items.map((item, index) => (
        <div key={index} className={styles.item}>
          {item.to ? (
            <Link to={item.to} className={styles.breadcrumbs_link}>
              {item.label}
            </Link>
          ) : (
            <span className={styles.disabled}>{item.label}</span>
          )}

          {index < items.length - 1 && (
            <svg className={styles.icon} width="11" height="15">
              <use href="/img/sprite.svg#breadcrumbs_next_icon" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};
