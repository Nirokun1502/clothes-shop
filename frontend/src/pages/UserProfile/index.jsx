import PropTypes from "prop-types";
import cn from "classnames";
import styles from "./index.module.scss";
import { useState, useEffect } from "react";
import axios from "axios";

function UserProfile(props) {
  const [infoForm, setInfoForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    defaultAddressId: "",
  });

  const [addressForm, setAddressForm] = useState({
    city: "",
    province: "",
    ward: "",
    streetAddress: "",
  });

  const [address, setAddress] = useState({ addressId: "", fullAddress: "" });

  const [addressList, setAddressList] = useState([]);

  const [addressInput, setAddressInput] = useState("");

  const [editMode, setEditMode] = useState(false);

  const [changeAddress, setChangeAddress] = useState(false);

  const [editAddressMode, setEditAddressMode] = useState(false);

  const [addAddressMode, setAddAddressMode] = useState(false);

  useEffect(() => {
    const accountInfo = JSON.parse(localStorage.getItem("accountinfo"));

    if (accountInfo && accountInfo.account) {
      setInfoForm({
        accountId: accountInfo.account.accountId || "",
        username: accountInfo.account.username || "",
        lastName: accountInfo.account.lastName || "",
        firstName: accountInfo.account.firstName || "",
        email: accountInfo.account.email || "",
        phone: accountInfo.account.phone || "",
        defaultAddressId: accountInfo.account.defaultAddressId || "",
      });
    }

    handleGetAddress(accountInfo.account.accountId);
  }, []);

  useEffect(() => {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInfoForm({
      ...infoForm,
      [name]: value,
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: value,
    });
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handleAddressEditClick = () => {
    setEditAddressMode(true);
  };

  const handleAddressCancelClick = () => {
    setEditAddressMode(false);
  };

  const handleAddAddressEditClick = () => {
    setAddAddressMode(true);
  };

  const handleAddAddressCancelClick = () => {
    setAddAddressMode(false);
  };

  const handleChangeAddressClick = () => {
    setChangeAddress(true);
  };

  const handleCancelChangeAddressClick = () => {
    setChangeAddress(false);
  };

  const handleChange = (event) => {
    const selectedId = event.target.value;
    console.log(selectedId);
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

    setAddressInput(
      `${selectedAddressObj.street_Address}, ${selectedAddressObj.ward}, ${selectedAddressObj.province}, ${selectedAddressObj.city}`
    );
  };

  const handleChangeAddress = async () => {
    const jwt = localStorage.getItem("jwt");
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      // const body = {
      //   email: infoForm.email,
      //   first_Name: infoForm.firstName,
      //   last_Name: infoForm.lastName,
      //   phone: infoForm.phone,
      // };
      const response = await axios.put(
        `https://localhost:7121/api/Account?accountId=${infoForm.accountId}&addressId=${address.addressId}`,
        null,
        config
      );
      console.log("Update successful", response);

      setChangeAddress(false);
      // handleGetAddress(infoForm.accountId);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleConfirmClick = async () => {
    const jwt = localStorage.getItem("jwt");
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const body = {
        email: infoForm.email,
        first_Name: infoForm.firstName,
        last_Name: infoForm.lastName,
        phone: infoForm.phone,
      };
      const response = await axios.put(
        `https://localhost:7121/api/Account/${infoForm.accountId}`,
        body,
        config
      );
      console.log("Update successful", response);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleConfirmAddressClick = async () => {
    const jwt = localStorage.getItem("jwt");
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const body = {
        city: addressForm?.city,
        province: addressForm?.province,
        ward: addressForm?.ward,
        street_Address: addressForm?.streetAddress,
      };

      const response = await axios.put(
        `https://localhost:7121/api/Address?accountId=${infoForm.accountId}&addressId=${infoForm.defaultAddressId}`,
        body,
        config
      );
      // handleGetAddress(infoForm.accountId);
      console.log("Update successful", response);
      setEditAddressMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddAddressClick = async () => {
    const jwt = localStorage.getItem("jwt");
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const body = {
        city: addressForm?.city,
        province: addressForm?.province,
        ward: addressForm?.ward,
        street_Address: addressForm?.streetAddress,
      };

      const response = await axios.post(
        `https://localhost:7121/api/Address?id=${infoForm.accountId}`,
        body,
        config
      );
      console.log("Update successful", response);
      setAddAddressMode(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleGetAddress = async (accountIdd) => {
    const accountInfo = JSON.parse(localStorage.getItem("accountinfo"));
    const jwt = localStorage.getItem("jwt");
    try {
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const response = await axios.get(
        `https://localhost:7121/api/Address/${accountIdd}`,
        config
      );

      const result = response.data.address;

      setAddressList(result);

      console.log(result);

      const defaultAddress = result?.find(
        (addr) => addr.address_Id === accountInfo.account.defaultAddressId
      );
      setAddressForm({
        city: defaultAddress?.city || "",
        province: defaultAddress?.province || "",
        ward: defaultAddress?.ward || "",
        streetAddress: defaultAddress?.street_Address || "",
      });
      console.log(defaultAddress);

      setAddressList(response.data.address);
      setAddressInput(
        `${defaultAddress?.street_Address}, ${defaultAddress?.ward}, ${defaultAddress?.province}, ${defaultAddress?.city}`
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <section
      className={cn(styles.checkoutSection, props.className, "user-profile")}
      style={{
        "--src": `url(${"/assets/62e6edbea13bf3b8f158133ce3713986.png"})`,
      }}
    >
      {/* Main section for the checkout process. */}

      <div className={styles.flex_col}>
        {/* Container for flex columns. */}

        <div className={styles.flex_row}>
          <img
            className={styles.img_icon}
            src={"/assets/usericon.svg"}
            alt="alt text"
          />

          <div className={styles.flex_col_header}>
            <div className={styles.flex_row_main_titles}>
              <h1 className={styles.hero_title_checkout}>
                {infoForm.lastName + " " + infoForm.firstName}
              </h1>
              <h1 className={styles.hero_title_checkout_second}>
                {/* (Username: {accountInfo?.account?.username}) */}
              </h1>
            </div>

            <div className={styles.flex_col_titles}>
              <div className={styles.flex_row_collection_titles}>
                <h2 className={styles.medium_title_collections_first}>
                  Email:
                </h2>
                <h2 className={styles.medium_title_collections_second}>
                  {infoForm.email}
                </h2>
              </div>

              <div className={styles.flex_row1}>
                <h2 className={styles.medium_title_collections_third}>
                  Số điện thoại:
                </h2>
                <h2 className={styles.medium_title_collections_fourth}>
                  {infoForm.phone}
                </h2>
              </div>

              <div className={styles.flex_row_collection_titles_second}>
                <h2 className={styles.medium_title_collections_fifth}>
                  Địa chỉ mặc định:
                </h2>
                <h2 className={styles.medium_title_collections_sixth}>
                  {addressInput}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.flex_col_collections}>
          <div className={styles.flex_row_collection_titles_main}>
            <h1 className={styles.hero_title_collections}>Thông tin cá nhân</h1>
            <h1
              className={styles.title_collections}
              onClick={handleEditClick}
              style={{ cursor: "pointer" }}
            >
              Chỉnh sửa
            </h1>
          </div>

          {editMode && (
            <div className={styles.grid_collections}>
              <div className={styles.item_collection}>
                <p className={styles.highlight_collection_first}>Họ</p>
                <input
                  type="text"
                  name="lastName"
                  value={infoForm.lastName}
                  onChange={handleInputChange}
                  className={styles.rect_collection_first}
                />
              </div>

              <div className={styles.item_collection_second}>
                <p className={styles.highlight_collection_second}>Tên</p>
                <input
                  type="text"
                  name="firstName"
                  value={infoForm.firstName}
                  onChange={handleInputChange}
                  className={styles.rect_collection_second}
                />
              </div>

              <div className={styles.item_collection_third}>
                <p className={styles.highlight_collection_third}>Email</p>
                <input
                  type="email"
                  name="email"
                  value={infoForm.email}
                  onChange={handleInputChange}
                  className={styles.rect_collection_third}
                />
              </div>

              <div className={styles.item_collection_fourth}>
                <p className={styles.highlight_collection_fourth}>
                  Số điện thoại
                </p>
                <input
                  type="text"
                  name="phone"
                  value={infoForm.phone}
                  onChange={handleInputChange}
                  className={styles.rect_collection_fourth}
                />
              </div>

              <div className={styles.flex_row_cart_buttons}>
                <button
                  className={styles.btn_add_to_cart}
                  onClick={handleConfirmClick}
                >
                  Xác nhận
                </button>
                <button
                  className={styles.btn_view_cart}
                  onClick={handleCancelClick}
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          )}

          <div>
            <div className={styles.flex_row_highlight_collections}>
              <p className={styles.highlight_collection_fifth}>
                Địa chỉ mặc định
              </p>
              <p className={styles.rect_collection_fifth}>{addressInput}</p>
              <p
                className={styles.highlight_collection_sixth}
                onClick={handleAddressEditClick}
                style={{ cursor: "pointer" }}
              >
                Sửa địa chỉ |{" "}
              </p>
              <p
                className={styles.highlight_collection_seventh}
                onClick={handleAddAddressEditClick}
                style={{ cursor: "pointer" }}
              >
                Thêm địa chỉ mới |
              </p>
              <p
                className={styles.highlight_collection_seventh}
                onClick={handleChangeAddressClick}
                style={{ cursor: "pointer" }}
              >
                Đổi địa chỉ
              </p>
            </div>

            {editAddressMode && (
              <div className={styles.grid_highlight_collections}>
                <div className={styles.item_collection_fifth}>
                  <p className={styles.highlight_collection_eighth}>
                    Thành phố
                  </p>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    className={styles.rect_collection_fifth1}
                  />
                </div>

                <div className={styles.item_collection_sixth}>
                  <p className={styles.highlight_collection_ninth}>Tỉnh</p>
                  <input
                    type="text"
                    name="province"
                    value={addressForm.province}
                    onChange={handleAddressChange}
                    className={styles.rect_collection_sixth}
                  />
                </div>

                <div className={styles.item_collection_seventh}>
                  <p className={styles.highlight_collection_tenth}>Phường</p>
                  <input
                    type="text"
                    name="ward"
                    value={addressForm.ward}
                    onChange={handleAddressChange}
                    className={styles.rect_collection_seventh}
                  />
                </div>

                <div className={styles.item_collection_eighth}>
                  <p className={styles.highlight_collection_eleventh}>
                    Số nhà, đường phố:
                  </p>
                  <input
                    type="text"
                    name="streetAddress"
                    value={addressForm.streetAddress}
                    onChange={handleAddressChange}
                    className={styles.rect_collection_eighth}
                  />
                </div>

                <div className={styles.flex_row_cart_buttons}>
                  <button
                    className={styles.btn_add_to_cart}
                    onClick={handleConfirmAddressClick}
                  >
                    Xác nhận
                  </button>
                  <button
                    className={styles.btn_view_cart}
                    onClick={handleAddressCancelClick}
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>
            )}

            {addAddressMode && (
              <div className={styles.grid_highlight_collections}>
                <div className={styles.item_collection_fifth}>
                  <p className={styles.highlight_collection_eighth}>
                    Thành phố
                  </p>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    className={styles.rect_collection_fifth1}
                  />
                </div>

                <div className={styles.item_collection_sixth}>
                  <p className={styles.highlight_collection_ninth}>Tỉnh</p>
                  <input
                    type="text"
                    name="province"
                    value={addressForm.province}
                    onChange={handleAddressChange}
                    className={styles.rect_collection_sixth}
                  />
                </div>

                <div className={styles.item_collection_seventh}>
                  <p className={styles.highlight_collection_tenth}>Phường</p>
                  <input
                    type="text"
                    name="ward"
                    value={addressForm.ward}
                    onChange={handleAddressChange}
                    className={styles.rect_collection_seventh}
                  />
                </div>

                <div className={styles.item_collection_eighth}>
                  <p className={styles.highlight_collection_eleventh}>
                    Số nhà, đường phố:
                  </p>
                  <input
                    type="text"
                    name="streetAddress"
                    value={addressForm.streetAddress}
                    onChange={handleAddressChange}
                    className={styles.rect_collection_eighth}
                  />
                </div>

                <div className={styles.flex_row_cart_buttons}>
                  <button
                    className={styles.btn_add_to_cart}
                    onClick={handleAddAddressClick}
                  >
                    Xác nhận
                  </button>
                  <button
                    className={styles.btn_view_cart}
                    onClick={handleAddAddressCancelClick}
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>
            )}

            {changeAddress && (
              <div
                className={styles.content_box_country}
                style={{ margin: "30px" }}
              >
                {/* Box containing country selection info. */}
                <div className={styles.info_country}>
                  Đổi địa chỉ
                  {/* Information label for country field. */}
                </div>

                <select
                  value={address.addressId}
                  onChange={handleChange}
                  className={styles.rect_collection_seventh}
                >
                  <option value="">--Chọn địa chỉ--</option>

                  {addressList.map((address) => (
                    <option key={address.address_Id} value={address.address_Id}>
                      {`${address.street_Address}, ${address.ward}, ${address.province}, ${address.city}`}
                    </option>
                  ))}
                </select>

                <div className={styles.flex_row_cart_buttons}>
                  <button
                    className={styles.btn_add_to_cart}
                    onClick={handleChangeAddress}
                  >
                    Xác nhận
                  </button>
                  <button
                    className={styles.btn_view_cart}
                    onClick={handleCancelChangeAddressClick}
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

UserProfile.propTypes = {
  className: PropTypes.string,
};

export default UserProfile;
