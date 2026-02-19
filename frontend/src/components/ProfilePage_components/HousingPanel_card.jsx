import styles from "./HousingPanel_card.module.css";
import { Text } from "../UI/Text/Text.jsx";

import { useNavigate } from "react-router-dom";

export const HousingPanel_card = ({
  id,
  imgSrc,
  title,
  onClick,
  tripId,
  setShowForm,
  setShowHostelList,
  setShowHostelId
}) => {
  const navigate = useNavigate();



  return (
    <div
      className={styles.hotelCard}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <img src={imgSrc} alt={title} />
      <div className={styles.text}>
        <Text text={title} type="m_600_s_20" />
      </div>
    </div>
  );
};
