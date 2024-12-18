import "./Category.scss";
import MenuItem from "../../components/MenuItem";
import { useEffect, useState } from "react";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import apiConfig from "../../config";
import axios from "axios";

function Category() {
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [addBtn, setAddBtn] = useState(false);

  const [addCategoryProductBtn, setAddCategoryProductBtn] = useState(false);
  const [removeCategoryProductBtn, setRemoveCategoryProductBtn] =
    useState(false);

  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [categoryImageInput, setCategoryImageInput] = useState("");
  const [categoryInfoInput, setCategoryInfoInput] = useState("");

  const [addCategoryProductInput, setAddCategoryProductInput] = useState("");
  const [removeCategoryProductInput, setRemoveCategoryProductInput] =
    useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedAddProduct, setSelectedAddProduct] = useState({});
  const [selectedRemoveProduct, setSelectedRemoveProduct] = useState("");

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "categoryname",
      headerName: "Tên danh mục",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "categoryproducts",
      headerName: "Sản phẩm",
      flex: 3,
    },
  ];

  const getTableData = async () => {
    try {
      const apiUrl = apiConfig.apiurls.category;
      //   const jwt = localStorage.getItem("jwt");

      //   const config = {
      //     headers: { Authorization: `Bearer ${jwt}` },
      //   };

      const response = await axios.get(apiUrl);
      setCategoryList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getProductData = async () => {
    try {
      const apiUrl = apiConfig.apiurls.product;
      const jwt = localStorage.getItem("jwt");

      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(apiUrl, config);
      setProductList(
        response.data.map(({ id, productName }) => ({ id, productName }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddButton = async (event) => {
    event.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      const apiUrl = apiConfig.apiurls.category;
      const body = {
        category_Name: categoryNameInput,
        image: categoryImageInput,
        description: categoryInfoInput,
      };
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const response = await axios.post(apiUrl, body, config);
      getTableData();
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteButton = async () => {
    try {
      if (!selectedRow) {
        console.log("vui lòng chọn một danh mục");
        return;
      }

      const id = selectedRow.id;
      setSelectedRow(null);
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.category}/${id}`;

      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const response = await axios.delete(apiUrl, config);
      getTableData();
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddCategoryProductButton = async (event) => {
    event.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.category}/product`;
      const body = {
        product_id: selectedAddProduct,
        category_Id: selectedRow.id,
      };
      console.log(body);
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(apiUrl, body, config);
      getTableData();
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRemoveCategoryProductButton = async (event) => {
    event.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.category}/product`;
      const body = {
        category_Id: selectedRow.id,
        product_id: selectedRemoveProduct,
      };
      const response = await axios.request({
        method: "DELETE",
        url: apiUrl,
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json-patch+json",
          Authorization: `Bearer ${jwt}`,
        },
        data: body,
      });
      getTableData();
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getTableData();
    getProductData();
  }, []);

  const items = [
    {
      icon: faBoxOpen,
      name: "Thêm",
      onClick: () => {
        setAddBtn(!addBtn);
      },
    },
    {
      icon: faBoxOpen,
      name: "Thêm sản phẩm",
      onClick: () => {
        setAddCategoryProductBtn(!addCategoryProductBtn);
      },
    },
    {
      icon: faBoxOpen,
      name: "Gỡ sản phẩm",
      onClick: () => {
        setRemoveCategoryProductBtn(!removeCategoryProductBtn);
      },
    },
    {
      icon: faBoxOpen,
      name: "Xóa",
      onClick: () => {
        handleDeleteButton();
      },
    },
    {
      icon: faBoxOpen,
      name: "Refresh",
      onClick: () => {
        getTableData();
      },
    },
  ];

  return (
    <div className="container-category">
      <h2 className="category-title">Quản lý danh mục</h2>
      <ul className="category-buttons">
        {items &&
          items?.map((item, index) => {
            return (
              <MenuItem
                key={`menuitem${index}`}
                name={item.name}
                icon={item.icon}
                onClick={item.onClick}
                to={item.to}
              />
            );
          })}
      </ul>

      {addBtn && (
        <div className="addcategory">
          <h2 className="category-title">Thêm danh mục mới:</h2>
          <form className="addcategory-form" onSubmit={handleAddButton}>
            <label
              className="addcategory-form-label"
              htmlFor="add-categoryname"
            >
              Tên danh mục:
            </label>
            <input
              className="addcategory-form-input"
              type="text"
              id="add-categoryname"
              name="add-categoryname"
              placeholder="Nhập tên danh mục"
              maxLength="50"
              required
              onChange={(e) => {
                setCategoryNameInput(e.target.value);
              }}
            />
            <label
              className="addcategory-form-label"
              htmlFor="add-categoryimage"
            >
              Ảnh:
            </label>
            <input
              className="addcategory-form-input"
              type="text"
              id="add-categoryimage"
              name="add-categoryimage"
              placeholder="Chèn link ảnh"
              maxLength="1000"
              required
              onChange={(e) => {
                setCategoryImageInput(e.target.value);
              }}
            />
            <label
              className="addcategory-form-label"
              htmlFor="add-categoryinfo"
            >
              Ảnh:
            </label>
            <input
              className="addcategory-form-input"
              type="text"
              id="add-categoryinfo"
              name="add-categoryinfo"
              placeholder="Mô tả"
              maxLength="1000"
              required
              onChange={(e) => {
                setCategoryInfoInput(e.target.value);
              }}
            />
            <button className="addcategory-form-button" type="submit">
              Xác nhận
            </button>
          </form>
        </div>
      )}

      {addCategoryProductBtn && (
        <div className="addcategory">
          <h2 className="category-title">Thêm sản phẩm vào danh mục:</h2>
          <form
            className="addcategory-form"
            onSubmit={handleAddCategoryProductButton}
          >
            <label className="addcategory-form-label" htmlFor="add-productname">
              Tên danh mục:
            </label>
            <input
              className="addcategory-form-input"
              type="text"
              id="add-productname"
              name="add-productname"
              placeholder="Tên danh mục"
              maxLength="50"
              required
              value={addCategoryProductInput}
              readOnly={true}
              onChange={(e) => {
                setAddCategoryProductInput(e.target.value);
              }}
            />

            <label className="addcategory-form-label" htmlFor="select-product">
              Thêm sản phẩm:
            </label>
            <select
              className="addcategory-form-select"
              id="select-product"
              value={selectedAddProduct}
              onChange={(e) => {
                setSelectedAddProduct(e.target.value);
                console.log(selectedAddProduct);
              }}
            >
              <option value="" disabled>
                chọn sản phẩm
              </option>
              {productList?.map(({ id, productName }) => {
                return (
                  <option key={`productnum#${id}`} value={id}>
                    {productName}
                  </option>
                );
              })}
            </select>
            <button className="addcategory-form-button" type="submit">
              Xác nhận
            </button>
          </form>
        </div>
      )}

      {removeCategoryProductBtn && (
        <div className="addcategory">
          <h2 className="category-title">Gỡ sản phẩm khỏi danh mục:</h2>
          <form
            className="addcategory-form"
            onSubmit={handleRemoveCategoryProductButton}
          >
            <label
              className="addcategory-form-label"
              htmlFor="remove-productname"
            >
              Tên danh mục:
            </label>
            <input
              className="addcategory-form-input"
              type="text"
              id="remove-productname"
              name="remove-productname"
              placeholder="Tên danh mục"
              maxLength="50"
              required
              value={removeCategoryProductInput}
              onChange={(e) => {
                setRemoveCategoryProductInput(e.target.value);
              }}
              readOnly={true}
            />

            <label className="addcategory-form-label" htmlFor="remove-product">
              Gỡ sản phẩm:
            </label>
            <select
              className="addcategory-form-select"
              id="select-product"
              value={selectedRemoveProduct}
              onChange={(e) => {
                setSelectedRemoveProduct(e.target.value);
                console.log(selectedRemoveProduct);
              }}
            >
              <option value="" disabled>
                chọn sản phẩm
              </option>
              {productList
                .filter((item) =>
                  selectedRow.categoryproducts.includes(item.productName)
                )
                .map(({ id, productName }) => {
                  return (
                    <option key={`productnum#${id}`} value={id}>
                      {productName}
                    </option>
                  );
                })}
            </select>
            <button className="addcategory-form-button" type="submit">
              Xác nhận
            </button>
          </form>
        </div>
      )}

      <Box className="category-datagrid">
        <DataGrid
          rows={categoryList}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          onRowClick={(e) => {
            setSelectedRow(e.row);
            setAddCategoryProductInput(e.row.categoryname);
            setRemoveCategoryProductInput(e.row.categoryname);
            console.log(selectedRow);
          }}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}

export default Category;
