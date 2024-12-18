import PropTypes from "prop-types";
import cn from "classnames";
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { getOrderByAccountId } from "../../State/Order/Action";
// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Order(props) {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { order } = useSelector((store) => store.order);
  const [currentOrder, setCurrentOrder] = useState({});
  const [visible, setVisible] = useState(false);

  console.log(order);

  useEffect(() => {
    const accountId = JSON.parse(localStorage.getItem("accountinfo"))?.account
      ?.accountId;
    console.log("accountid is:" + accountId);
    dispatch(getOrderByAccountId(accountId));
  }, []);

  return (
    <section
      className={cn(styles.checkoutSection, props.className, "order1")}
      style={{
        "--src": `url(${"/assets/76ba15bb1dab00bdcf93f82d34a0a7a0.png"})`,
      }}
    >
      {/* The main section containing the checkout information. */}

      <div className={styles.flex_col}>
        <div className={styles.flex_col1}>
          <h1 className={styles.checkoutPageTitle}>
            {/* Title of the checkout page. */}
            Đơn hàng của tôi
          </h1>
          <p className={styles.shippingAddressLabel}>
            {/* Label indicating the shipping address section. */}
            Nhấn để xem thông tin chi tiết
          </p>
        </div>

        <div className={styles.flex_row}>
          <div className={styles.flex_col2}>
            {order?.map((orderItem, index) => (
              <div
                className={styles.content_box}
                key={`order#${index}`}
                onClick={() => {
                  setVisible(true);
                  setCurrentOrder(orderItem);
                }}
              >
                <div className={styles.flex_col3}>
                  <p className={styles.shippingAddressText}>
                    Đơn hàng #{orderItem?.orderId}
                  </p>

                  <div className={styles.flex_row1}>
                    <img
                      className={styles.shippingAddressImage}
                      src={"/assets/88b4d829d13c5bf4e278032ae8014749.png"}
                      alt={orderItem.imageAlt || "alt text"}
                    />
                    {/* Image representing the shipping address. */}

                    <div className={styles.shippingAddressDetails}>
                      {/* Details related to the shipping address. */}

                      <div className={styles.flex_row2}>
                        <p className={styles.shippingAddressDetail1}>
                          Tổng tiền: {orderItem.totalPrice}
                        </p>
                        <p className={styles.shippingAddressDetail2}>
                          Tổng tiền(đã qua giảm giá): {orderItem.totalPrice}
                        </p>
                      </div>

                      <p className={styles.shippingAddressDetail3}>
                        Trạng thái đơn hàng: {orderItem.orderStatus}
                      </p>
                      <p className={styles.shippingAddressDetail4}>
                        Ngày đặt: {orderItem.dateCreated}
                      </p>
                      <p className={styles.shippingAddressDetail5}>
                        Địa chỉ giao hàng:{" "}
                        {`${orderItem.address.street_Address}, ${orderItem.address.ward}, ${orderItem.address.province}, ${orderItem.address.city}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visible && (
            <div className={styles.content_box3}>
              <div className={styles.orderSummarySection}>
                {/* Section displaying the order summary. */}

                <div className={styles.content_box2}>
                  <p className={styles.orderItemCount}>
                    {/* Count of items in the order. */}(
                    {currentOrder?.orderItems?.reduce((total, item) => {
                      return total + item.quantity;
                    }, 0)}
                    )
                  </p>
                </div>

                <div className={styles.flex_col6}>
                  <p className={styles.orderTitle}>
                    {/* Title for the order summary. */}
                    CHI TIẾT ĐƠN HÀNG
                  </p>

                  <div className={styles.flex_col7}>
                    {currentOrder?.orderItems?.map((item, index) => (
                      <div
                        className={styles.flex_row5}
                        key={`orderItemNum#${index}`}
                      >
                        <img
                          className={styles.orderItemImage1}
                          src={item.variant.image}
                          alt={"alt text"}
                        />
                        {/* Image of the order item. */}

                        <div className={styles.flex_col8}>
                          <div className={styles.flex_col9}>
                            <p className={styles.orderItemDescription2}>
                              {/* Description of the order item. */}
                              {item.productName}
                            </p>
                            <p className={styles.orderItemVariant1}>
                              {/* Variant details of the order item. */}
                              {item.variant.variant_Name}
                            </p>
                          </div>

                          <div className={styles.flex_row2}>
                            <p className={styles.orderItemCount1}>
                              {/* Quantity of the order item. */}(
                              {item.quantity})
                            </p>
                            <p className={styles.orderItemPrice1}>
                              {/* Price of the order item. */}${item.unitPrice}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.flex_col11}>
                    <div className={styles.flex_col12}>
                      <img
                        className={styles.subtotalSeparator}
                        src={"/assets/361b766db969832312f06f938953923e.svg"}
                        alt="alt text"
                      />
                      {/* Line separator for subtotal display. */}

                      <div className={styles.flex_row1}>
                        <p className={styles.subtotalLabel}>
                          {/* Label displaying the subtotal amount. */}
                          Tổng tiền(tạm tính):
                        </p>
                        <p className={styles.subtotalAmount}>
                          {currentOrder?.totalPrice}
                        </p>
                      </div>
                    </div>

                    <div className={styles.flex_col13}>
                      <img
                        className={styles.totalSeparator}
                        src={"/assets/361b766db969832312f06f938953923e.svg"}
                        alt="alt text"
                      />
                      {/* Line separator for total display. */}

                      <div className={styles.flex_row1}>
                        <p className={styles.totalLabel}>
                          {/* Label displaying the total amount. */}
                          Tổng tiền(đã qua giảm giá):
                        </p>
                        <p className={styles.totalAmount}>
                          {currentOrder?.totalDiscountedPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

Order.propTypes = {
  className: PropTypes.string,
};

export default Order;
