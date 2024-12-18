import "./OrderTable.scss";
import MenuItem from "../../components/MenuItem";
import { useEffect, useState } from "react";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import apiConfig from "../../config";
import axios from "axios";
function OrderTable() {
  const [OrderList, setOrderList] = useState([]);
  const [orderDetailList, setOrderDetailList] = useState([]);

  const [selectedRow, setSelectedRow] = useState(null);

  const [selectedOrderId, setSelectedOrderId] = useState();

  const [orderStatusInput, setOrderStatusInput] = useState("");

  const [statusBtn, setStatusBtn] = useState(false);

  const columns = [
    {
      field: "orderId",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "totalPrice",
      headerName: "Tổng tiền",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "totalDiscountedPrice",
      headerName: "Tổng tiền sau giảm giá",
      flex: 2,
    },
    {
      field: "orderStatus",
      headerName: "Trạng thái",
      flex: 2,
    },
    {
      field: "dateCreated",
      headerName: "Ngày đặt",
      flex: 2,
    },
    {
      field: "orderItems",
      headerName: "chi tiết đơn hàng",
    },
  ];

  const orderDetailColumns = [
    {
      field: "productName",
      headerName: "Tên sản phẩm",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      flex: 2,
    },
    {
      field: "unitPrice",
      headerName: "Đơn giá",
      flex: 2,
    },
  ];

  const getTableData = async () => {
    try {
      const apiUrl = apiConfig?.apiurls?.order;
      const jwt = localStorage.getItem("jwt");

      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(apiUrl, config);

      setOrderList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOrderStatus = async (event) => {
    event.preventDefault();
    try {
      const apiUrl = `${apiConfig?.apiurls?.order}/OrderStatus?orderId=${selectedOrderId}&status=${orderStatusInput}`;
      const jwt = localStorage.getItem("jwt");

      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.put(apiUrl, null, config);

      if (orderStatusInput == "cancelled") {
        handleCancelOrder();
      }
      console.log("orderstatus:" + orderStatusInput);
      getTableData();

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      for (const item of selectedRow.orderItems) {
        const variantBody = {
          in_Stock: -item?.quantity,
          sold_Quantity: -item?.quantity,
        };

        console.log(variantBody);
        console.log("variant id is:" + item?.variant?.variant_Id);

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
  };

  useEffect(() => {
    getTableData();
  }, []);

  const items = [
    {
      icon: faAddressCard,
      name: "Refresh",
      onClick: () => {
        getTableData();
      },
    },
    {
      icon: faAddressCard,
      name: "Duyệt đơn hàng",

      onClick: () => setStatusBtn(!statusBtn),
    },
  ];
  return (
    <div className="container-account">
      <h2 className="account-title">Quản lý đơn hàng</h2>
      <ul className="account-buttons">
        {items &&
          // eslint-disable-next-line react/prop-types
          items?.map((item, index) => {
            return (
              <MenuItem
                key={`menuitem${index}`}
                name={item?.name}
                icon={item?.icon}
                onClick={item?.onClick}
                to={item?.to}
              />
            );
          })}
      </ul>

      {statusBtn && selectedRow && (
        <div className="addaccount">
          <h2 className="account-title">Duyệt đơn hàng:</h2>

          <form className="addaccount-form" onSubmit={handleOrderStatus}>
            <label className="addaccount-form-label" htmlFor="add-accountname">
              Mã đơn hàng:
            </label>
            <input
              className="addaccount-form-input"
              type="text"
              id="add-accountname"
              name="add-accountname"
              maxLength="16"
              required
              value={selectedOrderId}
              readOnly={true}
              onChange={(e) => {
                setSelectedOrderId(e.target.value);
              }}
            />

            <label className="addaccount-form-label" htmlFor="dropdown">
              Trạng thái:
            </label>
            <select
              className="addaccount-form-select"
              id="dropdown"
              value={orderStatusInput}
              onChange={(e) => setOrderStatusInput(e.target.value)}
            >
              <option value="" disabled>
                Chọn trạng thái
              </option>
              <option value="pending">Đang chờ duyệt</option>
              <option value="shipping">Đang giao hàng</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            <button className="addaccount-form-button" type="submit">
              Xác nhận
            </button>
          </form>
        </div>
      )}

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            // color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            // backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            // backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            // backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            // color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            // color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={OrderList}
          columns={columns}
          columnVisibilityModel={{ orderItems: false }}
          getRowId={(row) => row.orderId}
          components={{ Toolbar: GridToolbar }}
          onRowClick={(e) => {
            setSelectedRow(e.row);
            setOrderDetailList(e.row.orderItems);
            setSelectedOrderId(e.row.orderId);
          }}
        />

        {orderDetailList?.length > 0 && (
          <div>
            <br></br>
            <h2 className="account-title">Chi tiết đơn hàng</h2>

            <DataGrid
              rows={orderDetailList.map((row, index) => ({
                ...row,
                tempId: index + 1,
              }))}
              columns={orderDetailColumns}
              getRowId={(row) => row.tempId}
              components={{ Toolbar: GridToolbar }}
            />
          </div>
        )}
      </Box>
    </div>
  );
}

export default OrderTable;
