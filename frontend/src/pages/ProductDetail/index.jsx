// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { findProductsById } from "../../State/Product/Action";
import PropTypes from "prop-types";
import cn from "classnames";
import axios from "axios";
import styles from "./index.module.scss";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProductDetail(props) {
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [variantName, setVariantName] = useState("");
  const [variant, setVariant] = useState({});
  const [product, setProduct] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [image, setImage] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  const handleProduct = async (productId) => {
    try {
      const response = await axios.get(
        `https://localhost:7121/api/Product/${productId}`
      );
      setProduct(response.data);
      console.log(response.data);
      // setVisible(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddCartItem = async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const body = {
        cart_Id: JSON.parse(localStorage.getItem("accountinfo"))?.account
          ?.cartId,
        variant_Id: variant?.variant_Id,
        quantity: quantity,
      };

      console.log(body);

      const response = await axios.post(
        `https://localhost:7121/api/Cart/CartItems`,
        body,
        config
      );
      setProduct(response.data);
      console.log(response.data);
      // setVisible(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    //then navigate to cart
    navigate(`/cart`);
  };

  useEffect(() => {
    handleProduct(params.productId);
  }, [params.productId]);

  useEffect(() => {
    setTotalPrice(price * quantity);
  }, [quantity]);

  return (
    <section
      className={cn(
        styles["product-section"],
        props.className,
        "product-detail"
      )}
      style={{
        "--src": `url(${"/assets/41b3660a9d11681941f8449946929cbc.png"})`,
      }}
    >
      <div className={styles["flex-row"]}>
        {/* Flex container for layout alignment. */}

        <div className={styles["flex-row-images"]}>
          {/* Row containing images related to the product. */}
          <img
            className={styles["product-image"]}
            src={image ? image : product?.image}
            alt={product?.product_Name}
          />
          {/* Main image of the product. */}

          <div className={styles["flex-col-image-thumbnails"]}>
            {/* Column for thumbnail images of the product. */}
            {/* <img
              className={styles["thumbnail-image-1"]}
              src={"/assets/productdetail.png"}
              alt="alt text"
            /> */}

            {product?.product_Variants?.map((variant, index) => (
              <img
                key={`variant#${index}`}
                className={`${styles["thumbnail-image-1"]} ${
                  selectedImageIndex === index ? styles["selected-border"] : ""
                }`} // Thêm class có điều kiện
                src={variant.image}
                alt={variant.variant_Name}
                onClick={() => {
                  setPrice(variant.price);
                  setTotalPrice(variant.price * quantity);
                  setVariant(variant);
                  setVariantName(variant.variant_Name);
                  setImage(variant.image);
                  setSelectedImageIndex(index); // Cập nhật index của ảnh đang được chọn
                }}
              />
            ))}

            {/* Thumbnail image of the product. */}
          </div>
        </div>

        <div className={styles["product-details-box"]}>
          {/* Container for product description and pricing details. */}

          <div className={styles["flex-col-text"]}>
            {/* Column for product textual information. */}

            <div className={styles["product-description"]}>
              {/* Container for main product text descriptions. */}
              <p className={styles["product-title"]}>
                {/* Title of the product. */}
                {product?.product_Name?.toUpperCase()}
              </p>
              <p className={styles["product-price-label"]}>
                {/* Price label for the product. */}
                Phân loại | {variantName}
              </p>

              <p className={styles["product-price"]}>
                {/* Price of the product. */}
                Giá: {price ? `${price}VNĐ` : ""}
              </p>

              <p className={styles["product-description-details"]}>
                {/* Detailed description of the product. */}
                {/* Relaxed-fit shirt. Camp collar and short sleeves. Button-up
                front. */}
                {product?.description}
              </p>
            </div>

            <div className={styles["flex-col-size-selection"]}>
              {/* Column for size selection and related actions. */}
              <p className={styles["size-label"]}>
                {/* Label indicating size selection. */}
                Số lượng
              </p>

              <div className={styles["flex-row-size-buttons"]}>
                {/* Row containing size selection buttons. */}
                <button
                  className={styles["size-button-xs"]}
                  onClick={() => {
                    quantity > 1 && setQuantity(quantity - 1);
                  }}
                >
                  {/* Button for selecting XS size. */} ➖
                </button>

                <div className={styles["content-box-size-s"]}>
                  {/* Box containing size information for size S. */}
                  <p className={styles["size-label-s"]}>{quantity}</p>
                </div>

                <button
                  className={styles["size-button-m"]}
                  onClick={() => {
                    setQuantity(quantity + 1);
                  }}
                >
                  {/* Button for selecting M size. */}➕
                </button>
              </div>

              <p className={styles["size-guide-notice"]}>
                {/* Message prompting to find size or measurement guide. */}
                TẠM TÍNH | {totalPrice} Đ
              </p>
              {!(typeof selectedImageIndex === "number") ? (
                <p className={styles["size-guide-notice"]}>
                  {/* Message prompting to find size or measurement guide. */}
                  Vui lòng chọn một phân loại
                </p>
              ) : (
                <button
                  className={styles["add-to-cart-btn"]}
                  onClick={() => {
                    handleAddCartItem();
                  }}
                >
                  {/* Button to add the product to the cart. */}
                  ADD
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

ProductDetail.propTypes = {
  className: PropTypes.string,
};

export default ProductDetail;
