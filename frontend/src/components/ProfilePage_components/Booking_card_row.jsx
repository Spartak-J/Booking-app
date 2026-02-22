import React from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "../UI/Text/Text.jsx";
import { Link } from "../UI/Text/Link.jsx";
import { ActionButton__Primary } from "../UI/Button/ActionButton_Primary.jsx";
import { IconSvg } from "../UI/Image/IconSvg.jsx";
import { useTranslation } from "react-i18next";

import styles from "./BookingComponent.module.css";

const paramList = [
    "1 кімната",
    "1 двоспальне ліжко",
    "ванна кімната"
];
export const Booking_card_row = ({
    offer,
    order,
    startDate,
    endDate,
    adults,
    children
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    if (!offer) return null;

    return (


        <div className={styles.card_row}>
            <div className={styles.colApartment}>
                <Link text={offer.title} type="m_600_s_20" />
                <Text text={t("hotel_info.max_guest")} type="m_500_s_16" />
                <Text text={order.adults + order.children} type="m_400_s_14" />

                <Text text={t("hotel_info.price")} type="m_500_s_16" />
                <Text text={order.orderPrice} type="m_400_s_14" />

                <Text text={t("Host.booking.Date")} type="m_500_s_16" />
                <Text
  text={`${order.startDate.slice(0, 10)} - ${order.endDate.slice(0, 10)}`}
  type="m_400_s_14"
/>

            </div>
            <div className={styles.colApartment}>
                <div className={styles.guestsIcons}>
                    <Text text={order.adults + order.children} type="m_400_s_14" />
                </div>
            </div>

            <div className={styles.colApartment}>
                <div className={styles.colApartment_container}>
                    <div className={styles.old_price}>
                        <span className="diagonalStrike">
                            <Text text={order.status} type="m_400_s_14" />
                        </span>
                    </div>
                </div>
            </div>
            <div className={`${styles.colApartment} ${styles.colBtn}`}>
                <div className={styles.col_btn_container}>
                    <ActionButton__Primary
                     text={t("hotel_info.more_btn")}
                     type="m_500_s_16"
                     className={`light_color_btn btn-w-full btn-h-39 btn-br-r-10`}
                      onClick={() => { }} />
                    <ActionButton__Primary
                        text={t("Host.booking.confirm_order")}
                         type="m_500_s_16"
                        className="btn-w-full btn-h-39 btn-br-r-10"
                        // onClick={() =>
                        //     navigate(
                        //         `/booking/${hotel.id}?startDate=${startDate}&endDate=${endDate}&adults=${adults}&children=${children}&price=${hotel.totalPrice}`
                        //     )
                        // }
                    />
                </div>
            </div>

        </div>



    );
};
