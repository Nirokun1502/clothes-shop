import "./ProductTable.scss";
import MenuItem from "../../components/MenuItem";
import { useEffect, useState } from "react";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import apiConfig from "../../config";
import axios from "axios";

function ProductTable() {
  const [productList, setProductList] = useState([]);
  const [variantList, setVariantList] = useState([]);

  const [addBtn, setAddBtn] = useState(false);
  const [addVariantBtn, setAddVariantBtn] = useState(false);

  const [productNameInput, setproductNameInput] = useState("");
  const [productImgInput, setproductImgInput] = useState("");
  const [productInfoInput, setproductInfoInput] = useState("");

  const [variantNameInput, setVariantNameInput] = useState("");
  const [variantPriceInput, setVariantPriceInput] = useState(0);
  const [variantStockInput, setVariantStockInput] = useState(0);
  const [variantImgInput, setVariantImgInput] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedVariantRow, setSelectedVariantRow] = useState(null);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "productName",
      headerName: "Tên sản phẩm",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "productImage", headerName: "Ảnh", flex: 1 },
    { field: "productDescription", headerName: "Mô tả", flex: 1 },
    { field: "active", headerName: "ACTIVE", flex: 1 },
    { field: "soldQuantity", headerName: "Đã bán", flex: 1 },
    { field: "createdAt", headerName: "Ngày tạo", flex: 1 },
    {
      field: "variants",
      headerName: "loại sản phẩm",
    },
  ];

  const variantColumns = [
    { field: "variantId", headerName: "ID", flex: 1 },
    {
      field: "variantName",
      headerName: "Tên loại",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "price", headerName: "Đơn giá", flex: 1 },
    { field: "soldQuantity", headerName: "Đã bán", flex: 1 },
    { field: "inStock", headerName: "Tồn kho", flex: 1 },
    { field: "variantImage", headerName: "Ảnh", flex: 1 },
  ];

  const getTableData = async () => {
    try {
      const apiUrl = apiConfig?.apiurls?.product;
      const response = await axios.get(apiUrl);
      setProductList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddButton = async (event) => {
    event.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.product}/Product`;
      const body = {
        product_Name: productNameInput,
        image: productImgInput,
        description: productInfoInput,
        is_Active: true,
      };
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const response = await axios.post(apiUrl, body, config);
      getTableData();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleAddVariantButton = async (event) => {
    event.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.product}/Variant?productId=${selectedRow.id}`;
      const body = {
        variant_Name: variantNameInput,
        price: variantPriceInput,
        in_Stock: variantStockInput,
        sold_Quantity: 0,
        image: variantImgInput,
      };
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const response = await axios.post(apiUrl, body, config);
      getTableData();
    } catch (error) {
      console.error("Error adding product variant:", error);
    }
  };

  const handleDeleteButton = async () => {
    try {
      if (!selectedRow) {
        console.log("Please select a product.");
        return;
      }
      const id = selectedRow.id;
      setSelectedRow(null);
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.product}/Product?id=${id}`;
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const response = await axios.delete(apiUrl, config);
      getTableData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleDeleteVariantButton = async () => {
    try {
      if (!selectedVariantRow) {
        console.log("Please select a variant.");
        return;
      }
      const id = selectedVariantRow.variantId;
      setSelectedVariantRow(null);
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.product}/Variant?id=${id}`;
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const response = await axios.delete(apiUrl, config);
      getTableData();
    } catch (error) {
      console.error("Error deleting product variant:", error);
    }
  };

  useEffect(() => {
    getTableData();
  }, []);

  const items = [
    {
      icon: faAddressCard,
      name: "Thêm",
      onClick: () => setAddBtn(!addBtn),
    },
    {
      icon: faAddressCard,
      name: "Xóa",
      onClick: handleDeleteButton,
    },
    {
      icon: faAddressCard,
      name: "Refresh",
      onClick: getTableData,
    },
  ];

  const variantItems = [
    {
      icon: faAddressCard,
      name: "Thêm ",
      onClick: () => setAddVariantBtn(!addVariantBtn),
    },
    {
      icon: faAddressCard,
      name: "Xóa",
      onClick: handleDeleteVariantButton,
    },
    {
      icon: faAddressCard,
      name: "Refresh",
      onClick: getTableData,
    },
  ];

  return (
    <div className="container-account">
      <h2 className="account-title">Quản lý Sản phẩm</h2>
      <ul className="account-buttons">
        {items.map((item, index) => (
          <MenuItem
            key={`menuitem${index}`}
            name={item.name}
            icon={item.icon}
            onClick={item.onClick}
          />
        ))}
      </ul>

      {addBtn && (
        <div className="addaccount">
          <h2 className="account-title">Thêm sản phẩm mới:</h2>
          <form className="addaccount-form" onSubmit={handleAddButton}>
            <label className="addaccount-form-label" htmlFor="add-productname">
              Tên sản phẩm:
            </label>
            <input
              className="addaccount-form-input"
              type="text"
              id="add-productname"
              placeholder="Nhập tên sản phẩm"
              maxLength="50"
              required
              onChange={(e) => setproductNameInput(e.target.value)}
            />
            <label className="addaccount-form-label" htmlFor="add-productimg">
              Ảnh sản phẩm:
            </label>
            <input
              className="addaccount-form-input"
              type="text"
              id="add-productimg"
              placeholder="Chèn link ảnh sản phẩm"
              maxLength="1000"
              required
              onChange={(e) => setproductImgInput(e.target.value)}
            />
            <label className="addaccount-form-label" htmlFor="add-productinfo">
              Mô tả:
            </label>
            <input
              className="addaccount-form-input"
              type="text"
              id="add-productinfo"
              placeholder="Nhập mô tả sản phẩm"
              maxLength="1000"
              required
              onChange={(e) => setproductInfoInput(e.target.value)}
            />
            <button className="addaccount-form-button" type="submit">
              Xác nhận
            </button>
          </form>
        </div>
      )}

      <Box
        m="40px 0 0 0"
        height="75vh"
        display="flex"
        flexWrap="wrap"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": {
            /* Custom styles */
          },
          "& .MuiDataGrid-columnHeaders": { borderBottom: "none" },
          "& .MuiDataGrid-footerContainer": { borderTop: "none" },
        }}
      >
        <DataGrid
          rows={productList}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          columnVisibilityModel={{ variants: false }}
          onRowClick={(e) => {
            setSelectedRow(e.row);
            setVariantList(e.row.variants);
            setSelectedVariantRow(null);
            console.log(e.row.variants);
          }}
        />
        <Box
          flex="0 0 200px"
          ml="20px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img
            src={selectedRow?.productImage}
            alt="Product"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Box>

        {variantList?.length >= 0 && (
          <Box
            display="flex"
            marginTop="30px"
            width="100%"
            justifyContent="space-around"
            flexWrap="wrap"
          >
            {/* <br></br> */}

            <div style={{ display: "flex", flexWrap: "nowarp" }}>
              <h2 className="account-title">Loại sản phẩm</h2>
              <ul className="account-buttons">
                {variantItems.map((item, index) => (
                  <MenuItem
                    key={`menuitem${index}`}
                    name={item.name}
                    icon={item.icon}
                    onClick={item.onClick}
                  />
                ))}

                {addVariantBtn && (
                  <div className="addaccount">
                    <h2 className="account-title">Thêm loại sản phẩm mới:</h2>
                    <form
                      className="addaccount-form"
                      onSubmit={handleAddVariantButton}
                    >
                      <label
                        className="addaccount-form-label"
                        htmlFor="add-variantname"
                      >
                        Tên Loại:
                      </label>
                      <input
                        className="addaccount-form-input"
                        type="text"
                        id="add-variantname"
                        // placeholder="Nhập tên loại"
                        maxLength="50"
                        required
                        onChange={(e) => setVariantNameInput(e.target.value)}
                      />
                      <label
                        className="addaccount-form-label"
                        htmlFor="add-variantimg"
                      >
                        Ảnh:
                      </label>
                      <input
                        className="addaccount-form-input"
                        type="text"
                        id="add-variantimg"
                        // placeholder="Chèn link ảnh sản phẩm"
                        maxLength="1000"
                        required
                        onChange={(e) => setVariantImgInput(e.target.value)}
                      />

                      <label
                        className="addaccount-form-label"
                        htmlFor="add-variantprice"
                      >
                        Giá:
                      </label>
                      <input
                        className="addaccount-form-input"
                        type="text"
                        id="add-variantprice"
                        // placeholder="Nhập giá sản phẩm"
                        maxLength="11"
                        required
                        onChange={(e) => setVariantPriceInput(e.target.value)}
                      />

                      <label
                        className="addaccount-form-label"
                        htmlFor="add-variantstock"
                      >
                        Kho:
                      </label>
                      <input
                        className="addaccount-form-input"
                        type="text"
                        id="add-variantstock"
                        // placeholder="Nhập số lượng tồn"
                        maxLength="9"
                        required
                        onChange={(e) => setVariantStockInput(e.target.value)}
                      />

                      <button className="addaccount-form-button" type="submit">
                        Xác nhận
                      </button>
                    </form>
                  </div>
                )}
              </ul>
            </div>
            <DataGrid
              columns={variantColumns}
              rows={variantList}
              getRowId={(row) => row.variantId}
              components={{ Toolbar: GridToolbar }}
              onRowClick={(e) => {
                setSelectedVariantRow(e.row);
              }}
            />
            <img
              src={selectedVariantRow?.variantImage}
              alt="Product"
              style={{ maxWidth: "50%", maxHeight: "50%" }}
            />
          </Box>
        )}
      </Box>
    </div>
  );
}

export default ProductTable;
