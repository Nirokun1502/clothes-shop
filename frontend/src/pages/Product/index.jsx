// import React from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../State/Product/Action";
import cn from "classnames";
import styles from "./index.module.scss";
import ResultsList from "../../components/UserComponents/UserSearchBar/ResultsList";
import UserSearchBar from "../../components/UserComponents/UserSearchBar";

function Product(props) {
  const [results, setResults] = useState([]);

  const [product, setProduct] = useState([]);
  const [visible, setVisible] = useState(true);
  const [category, setCategory] = useState([]);

  const [cateSelect, setcateSelect] = useState("");
  const [avaiSelect, setAvaiSelect] = useState("");
  const [priceSelect, setPriceSelect] = useState("");

  const [filterClick, setFilterClick] = useState(false);

  const { products } = useSelector((store) => store.products);
  console.log(products);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGetCategory = async () => {
    try {
      const response = await axios.get(`https://localhost:7121/api/Category`);

      // console.log(response.data);
      const categoryNames = response.data.map((item) => item.categoryname);
      console.log(categoryNames);
      setCategory(categoryNames);

      // );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilterProduct = () => {
    const filteredProducts = products.filter((product) => {
      // Lọc theo danh mục
      const categoryMatch =
        !cateSelect ||
        (product.categories && product.categories.includes(cateSelect));

      // Lọc theo tình trạng (đã bán hay còn hàng)
      const availabilityMatch =
        avaiSelect === "" ||
        (avaiSelect === "option1" && product.active) ||
        (avaiSelect === "option2" && !product.active);

      // Lọc theo mức giá
      const priceMatch =
        priceSelect === "" ||
        (priceSelect === "option1" && product.variants[0].price <= 100000) ||
        (priceSelect === "option2" &&
          product.variants[0].price > 100000 &&
          product.variants[0].price <= 250000) ||
        (priceSelect === "option3" &&
          product.variants[0].price > 250000 &&
          product.variants[0].price <= 500000) ||
        (priceSelect === "option4" && product.variants[0].price > 500000);

      return categoryMatch && availabilityMatch && priceMatch;
    });

    console.log("Filtered Products:", filteredProducts); // In ra để kiểm tra kết quả lọc
    setProduct(filteredProducts); // Cập nhật state products nếu cần
  };

  // Dispatch action getAllProducts khi component được render
  useEffect(() => {
    dispatch(getAllProducts());
    handleGetCategory();
    setProduct(products);
  }, [dispatch]);

  useEffect(() => {
    handleFilterProduct();
  }, [cateSelect, avaiSelect, priceSelect]);

  return (
    <section
      className={cn(styles.products_section, props.className, "productpage")}
      style={{
        "--src": `url(${"/assets/41b3660a9d11681941f8449946929cbc.png"})`,
      }}
    >
      <div className={styles.product_listing_section}>
        {/* Section for displaying product listings. */}

        <div className={styles.breadcrumb_col}>
          {/* Column for breadcrumb navigation. */}
          <p className={styles.breadcrumb_text_box}>
            {/* Text for breadcrumb navigation. */}
            <span className={styles.breadcrumb_text}>
              <span className={styles.breadcrumb_text_span0}>Home</span>
              <span className={styles.breadcrumb_text_span1}> / Products</span>
            </span>
          </p>
          <h3 className={styles.products_heading}>
            {/* Heading for products section. */}
            Products
          </h3>

          <div className={styles.search_container}>
            {/* Container for the search functionality. */}

            {/* Search */}
            <UserSearchBar setResults={setResults} setVisible={setVisible} />
            {!!results?.length && visible && (
              <ResultsList
                results={results}
                setProduct={setProduct}
                setVisible={setVisible}
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.filter_section}>
        {/* Section for product filters. */}

        <div className={styles.filters_header_col}>
          {/* Column for the filters header. */}
          <p className={styles.filters_heading}>
            {/* Heading for filters section. */}
            Lọc theo
          </p>

          <div className={styles.filter_options_container}>
            <div
              className={styles.availability_filter}
              style={{
                "--src": `url(${"/assets/225fc32151ef6497f4d9b6b6499a272c.svg"})`,
              }}
            ></div>

            {/* Available */}
            <div className={styles.category_filter}>
              <div className={styles.category_row}>
                <p className={styles.filter_category_label}>Danh mục</p>
                <select
                  id="combobox"
                  value={cateSelect}
                  onChange={(e) => {
                    setcateSelect(e.target.value);
                    setFilterClick(true);
                  }}
                  style={{
                    padding: "8px",
                    margin: "10px 0",
                    borderRadius: "4px",
                  }}
                >
                  <option value="" disabled>
                    --Chọn danh mục--
                  </option>
                  {category?.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <img
                className={styles.divider_line}
                src={"/assets/0d446865c2c17e6772540384958f5cf2.svg"}
                alt="alt text"
              />
            </div>
            {/* Available */}

            {/* category */}
            <div className={styles.category_filter}>
              <div className={styles.category_row}>
                <p className={styles.filter_category_label}>Hàng có sẵn</p>
                <select
                  id="combobox"
                  value={avaiSelect}
                  onChange={(e) => {
                    setAvaiSelect(e.target.value);
                    setFilterClick(true);
                  }}
                  style={{
                    padding: "8px",
                    margin: "10px 0",
                    borderRadius: "4px",
                  }}
                >
                  <option value="" disabled>
                    --Chọn mục--
                  </option>
                  <option value="option1">Còn hàng</option>
                  <option value="option2">Đã bán hết</option>
                </select>
              </div>

              <img
                className={styles.divider_line}
                src={"/assets/0d446865c2c17e6772540384958f5cf2.svg"}
                alt="alt text"
              />
            </div>
            {/* category */}

            {/* price */}
            <div className={styles.category_filter}>
              <div className={styles.category_row}>
                <p className={styles.filter_category_label}>Giá bán</p>
                <select
                  id="combobox"
                  value={priceSelect}
                  onChange={(e) => {
                    setPriceSelect(e.target.value);
                    setFilterClick(true);
                  }}
                  style={{
                    padding: "8px",
                    margin: "10px 0",
                    borderRadius: "4px",
                  }}
                >
                  <option value="" disabled>
                    --Chọn mức giá--
                  </option>
                  <option value="option1">1 - 100.000</option>
                  <option value="option2">100.000 - 250.000</option>
                  <option value="option3">250.000 - 500.000</option>
                  <option value="option4">{"<"}500.000</option>
                </select>
              </div>

              <img
                className={styles.divider_line}
                src={"/assets/0d446865c2c17e6772540384958f5cf2.svg"}
                alt="alt text"
              />
            </div>
            {/* price */}
          </div>
        </div>

        <div className={styles.flex_row}>
          {console.log(product)}
          {(product?.length || filterClick ? product : products)?.map(
            (item) => (
              <div
                onClick={() => navigate(`/product/${item.id}`)}
                key={`product#${item?.id}`}
                className={styles.product_col_1}
              >
                <img
                  className={styles.product_image_1}
                  src={item?.productImage}
                  alt={item?.productName}
                />
                <div className={styles.product_details_row_1}>
                  <p className={styles.product_name_1}>{item?.productName}</p>
                  <p className={styles.product_price_1}>
                    {item?.variants[0]?.price || 0} VNĐ
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

Product.propTypes = {
  className: PropTypes.string,
};

export default Product;
