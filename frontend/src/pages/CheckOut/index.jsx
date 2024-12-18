import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import cn from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../State/Cart/Action";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import CreateOrder from "../CreateOrder";

function CheckOut(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const info = JSON.parse(localStorage.getItem("accountinfo"));
  const jwt = localStorage.getItem("jwt");
  const { cart } = useSelector((store) => store.cart);
  const [address, setAddress] = useState({});
  const [addressList, setAddressList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);

  console.log(cart);

  useEffect(() => {
    const accountId = info?.account?.accountId;
    console.log("accountid is:" + accountId);
    dispatch(getCart(accountId));

    handleGetAddress();
  }, []);

  const handleGetAddress = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const response = await axios.get(
        `https://localhost:7121/api/Address/${info?.account?.accountId}`,
        config
      );

      const result = response.data.address;

      console.log(result);

      const defaultAddressId = info?.account?.defaultAddressId;

      const defaultAddress = result.find(
        (addr) => addr.address_Id === defaultAddressId
      );

      console.log(defaultAddress);

      setAddressList(response.data.address);
      setAddress({
        addressId: defaultAddressId,
        fullAddress: `${defaultAddress.street_Address}, ${defaultAddress.ward}, ${defaultAddress.province}, ${defaultAddress.city}`,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedAddressObj = addressList.find(
      (address) => address.address_Id === parseInt(selectedId)
    );

    console.log(selectedAddressObj);

    if (selectedAddressObj) {
      setAddress({
        addressId: selectedId,
        fullAddress: `${selectedAddressObj.street_Address}, ${selectedAddressObj.ward}, ${selectedAddressObj.province}, ${selectedAddressObj.city}`,
      });
    }
  };

  const handlePayment = async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const body = {
        total_Price: cart?.cartItems?.reduce((total, item) => {
          return total + item.quantity * item.variant.price;
        }, 0),
        total_Discounted_Price: cart?.cartItems?.reduce((total, item) => {
          return total + item.quantity * item.variant.price;
        }, 0),
        status: "pending",
      };

      console.log(body);
      console.log(info.account.accountId);
      console.log(address.addressId);

      const response = await axios.post(
        `https://localhost:7121/api/Order?accountId=${info.account.accountId}&addressId=${address.addressId}`,
        body,
        config
      );
      console.log(response.data);

      const orderId = response.data.order_Id;

      // Gọi API để tạo orderItem cho từng item trong giỏ hàng
      for (const item of cart.cartItems) {
        const orderItemBody = {
          order_Id: orderId, // ID của đơn hàng vừa được tạo
          variant_Id: item?.variant?.variant_Id,
          quantity: item?.quantity,
          unit_Price: item?.variant?.price,
          discounted_Percentage: 0, // Mặc định là 0
        };

        const variantBody = {
          in_Stock: item?.quantity,
          sold_Quantity: item?.quantity,
        };

        console.log(orderItemBody);

        await axios.post(
          "https://localhost:7121/api/Order/OrderItems",
          orderItemBody,
          config
        );

        await axios.put(
          `https://localhost:7121/api/Product/Variant?id=${item?.variant?.variant_Id}`,
          variantBody,
          config
        );
      }

      console.log("Order and order items created successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    //then navigate to order
    navigate(`/order`);
  };

  return (
    <section
      className={cn(styles.checkoutSection, props.className, "check-out")}
      style={{
        "--src": `url(${"/assets/76ba15bb1dab00bdcf93f82d34a0a7a0.png"})`,
      }}
    >
      {/* Main section for the checkout process. */}

      <div className={styles.flex_row}>
        {/* Wrapper for flex row items. */}

        <div className={styles.flex_col}>
          {/* Column layout for checkout details. */}

          <div className={styles.flex_col_info}>
            {/* Column for checkout informational content. */}
            <img
              className={styles.image_product}
              src={"/assets/5c94b95dddde7368805f687e96d53061.svg"}
              alt="alt text"
            />
            {/* Image for the checkout process. */}
            <h1 className={styles.title_checkout}>
              {/* Main title for the checkout page. */}
              Checkout
            </h1>

            <div className={styles.flex_row_highlights}>
              {/* Row for important highlights in the checkout. */}
              <p className={styles.highlight_info}>
                {/* Text field for shipping information highlight. */}
                Thông tin
              </p>
              <p className={styles.highlight_payment}>
                {/* Text field for payment highlight. */}
                Thanh toán
              </p>
            </div>

            <div className={styles.flex_row_shipping_details}>
              {/* Row holding details related to shipping. */}
              <div className={styles.text_shipping_address}>
                {/* Text label for shipping address. */}
                Địa chỉ giao hàng
              </div>

              <div className={styles.content_box_country}>
                {/* Box containing country selection info. */}
                <div className={styles.info_country}>
                  {/* Information label for country field. */}
                  Địa chỉ
                </div>

                <select value={address.address_Id} onChange={handleChange}>
                  <option value=""> Chọn địa chi</option>
                  {addressList.map((address) => (
                    <option key={address.address_Id} value={address.address_Id}>
                      {`${address.street_Address}, ${address.ward}, ${address.province}, ${address.city}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.flex_col_shipping_info}>
              {/* Column layout for display shipping info. */}
              <div className={styles.text_shipping_address1}>
                {/* Repeated label for shipping address. */}
                Địa chỉ chi tiết
              </div>
              <div className={styles.text_shipping_address2}>
                {/* Repeated label for shipping address. */}
                {address.fullAddress}
              </div>
            </div>
          </div>

          <button
            className={styles.btn_shipping}
            onClick={() => {
              handlePayment();
            }}
          >
            {/* Button to proceed with shipping. */}
            <p className={styles.btn_text_shipping}>
              {/* Text content for shipping button. */}
              Thanh toán
            </p>
            <img
              className={styles.btn_icon_shipping}
              src={"/assets/1da2c68f8e6fbc5e2826743171deb922.svg"}
              alt="alt text"
            />
            {/* Icon for the shipping button. */}
          </button>

          <div
            className={styles.btn_shipping}
            onClick={() => {
              handlePayment();
            }}
          >
            <CreateOrder
              total={cart?.cartItems?.reduce((total, item) => {
                return total + item.quantity * item.variant.price;
              }, 0)}
            ></CreateOrder>
          </div>
        </div>

        <div className={styles.content_box_order_summary}>
          {/* Box for displaying order summary. */}

          <div className={styles.flex_col_order_info}>
            {/* Column for order information display. */}

            <div className={styles.content_box_order_count}>
              {/* Box showing the number of items in the order. */}
              <p className={styles.paragraph_order_count}>
                {/* Text field showing item count. */}(
                {cart?.cartItems?.reduce((total, item) => {
                  return total + item.quantity;
                }, 0)}
                )
              </p>
            </div>

            <p className={styles.paragraph_order_title}>
              {/* Title for the order summary. */}
              ĐƠN HÀNG CỦA BẠN
            </p>

            <div className={styles.flex_col_product_details}>
              {cart?.cartItems?.map((item, index) => (
                <div
                  className={styles.flex_row_product_image}
                  key={`cartItem#${index}`}
                >
                  <img
                    className={styles.image_product1}
                    src={item.variant.image}
                    alt={item.productName}
                  />

                  <div className={styles.flex_col_product_desc}>
                    <div className={styles.flex_col_product_info}>
                      <p className={styles.desc_product_name1}>
                        {item.productName}
                      </p>
                      <p className={styles.desc_product_size1}>
                        {item.variant.variant_Name}
                      </p>
                    </div>

                    <div className={styles.flex_row_product_price_info}>
                      <p className={styles.paragraph_product_quantity1}>
                        ({item.quantity})
                      </p>

                      <p className={styles.desc_product_price1}>
                        {item.variant.price}VND
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.flex_col_totals}>
              {/* Column for displaying total amounts. */}
              <img
                className={styles.line_separator1}
                src={"/assets/361b766db969832312f06f938953923e.svg"}
                alt="alt text"
              />
              {/* Line separator in totals section. */}

              <div className={styles.flex_row_subtotal}>
                {/* Row displaying subtotal summary. */}
                <p className={styles.desc_subtotal_label}>
                  {/* Label for subtotal value. */}
                  Subtotal
                </p>
                <p className={styles.desc_subtotal_value}>
                  {/* Value of the subtotal. */}
                  {cart?.cartItems?.reduce((total, item) => {
                    return total + item.quantity * item.variant.price;
                  }, 0)}
                  VND
                </p>
              </div>

              <img
                className={styles.line_separator2}
                src={"/assets/361b766db969832312f06f938953923e.svg"}
                alt="alt text"
              />
              {/* Second line separator. */}

              <div className={styles.flex_row_total}>
                {/* Row displaying total amount. */}
                <p className={styles.paragraph_total_label}>
                  {/* Label for total amount. */}
                  Total
                </p>
                <p className={styles.paragraph_total_value}>
                  {/* Value for the total amount. */}
                  {cart?.cartItems?.reduce((total, item) => {
                    return total + item.quantity * item.variant.price;
                  }, 0)}
                  VND
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

CheckOut.propTypes = {
  className: PropTypes.string,
};

export default CheckOut;
