import "./Account.scss";
import MenuItem from "../../components/MenuItem";
import { useEffect, useState } from "react";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import apiConfig from "../../config";
import axios from "axios";
function Account() {
  const [accountList, setAccountList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [addBtn, setAddBtn] = useState(false);

  const [addAccountRoleBtn, setAddAccountRoleBtn] = useState(false);
  const [removeAccountRoleBtn, setRemoveAccountRoleBtn] = useState(false);

  const [accountNameInput, setAccountNameInput] = useState("");
  const [accountPasswordInput, setAccountPasswordInput] = useState("");

  const [addAccoutRoleInputUsername, setAddAccoutRoleInputUsername] =
    useState("");
  const [removeAccoutRoleInputUsername, setRemoveAccoutRoleInputUsername] =
    useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedAddRole, setSelectedAddRole] = useState({});
  const [selectedRemoveRole, setSelectedRemoveRole] = useState("");

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "username",
      headerName: "Tên tài khoản",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "roles",
      headerName: "Vai trò",
      flex: 2,
    },
    {
      field: "permissions",
      headerName: "Quyền hạn",
      flex: 2,
    },
  ];

  const getTableData = async () => {
    try {
      const apiUrl = apiConfig.apiurls.account;
      const jwt = localStorage.getItem("jwt");

      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(apiUrl, config);
      console.log(response.data);
      setAccountList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getRoleData = async () => {
    try {
      const apiUrl = apiConfig.apiurls.role;
      const jwt = localStorage.getItem("jwt");

      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(apiUrl, config);
      setRoleList(response.data.map(({ id, rolename }) => ({ id, rolename })));
      console.log(response.data.map(({ id, rolename }) => ({ id, rolename })));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddButton = async (event) => {
    event.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      const apiUrl = apiConfig.apiurls.account;
      const body = {
        username: accountNameInput,
        password: accountPasswordInput,
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
        console.log("vui long chon mot tai khoan");
        return;
      }
      if (localStorage.getItem("username") == selectedRow.username) {
        console.log("khong duoc xoa chinh ban than minh");
        return;
      }

      const id = selectedRow.id;
      setSelectedRow(null);
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.account}/${id}`;

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

  const handleAddAccountRoleButton = async (event) => {
    event.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.account}/role`;
      const body = {
        account_Id: selectedRow.id.toString(),
        role_id: selectedAddRole.toString(),
      };
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

  const handleRemoveAccountRoleButton = async (event) => {
    event.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.account}/role`;
      const body = {
        account_Id: selectedRow.id,
        role_id: selectedRemoveRole,
      };
      // const config = {
      //   headers: { Authorization: `Bearer ${jwt}` },
      // };
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
    getRoleData();
  }, []);

  const items = [
    {
      icon: faAddressCard,
      name: "Thêm",
      onClick: () => {
        setAddBtn(!addBtn);
        console.log("hello!");
      },
    },
    {
      icon: faAddressCard,
      name: "Thêm vai trò",
      onClick: () => {
        setAddAccountRoleBtn(!addAccountRoleBtn);
      },
    },
    {
      icon: faAddressCard,
      name: "Gỡ vai trò",
      onClick: () => {
        setRemoveAccountRoleBtn(!removeAccountRoleBtn);
      },
    },
    {
      icon: faAddressCard,
      name: "Xóa",
      onClick: () => {
        handleDeleteButton();
      },
    },
    {
      icon: faAddressCard,
      name: "Refresh",
      onClick: () => {
        getTableData();
      },
    },
  ];
  return (
    <div className="container-account">
      <h2 className="account-title">Quản lý tài khoản</h2>
      <ul className="account-buttons">
        {items &&
          // eslint-disable-next-line react/prop-types
          items.map((item, index) => {
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
        <div className="addaccount">
          <h2 className="account-title">Thêm tài khoản mới:</h2>
          <form className="addaccount-form" onSubmit={handleAddButton}>
            <label className="addaccount-form-label" htmlFor="add-accountname">
              Tài khoản:
            </label>
            <input
              className="addaccount-form-input"
              type="text"
              id="add-accountname"
              name="add-accountname"
              placeholder="Nhập tên tài khoản"
              maxLength="16"
              required
              onChange={(e) => {
                setAccountNameInput(e.target.value);
              }}
            />

            <label
              className="addaccount-form-label"
              htmlFor="add-accountpassword"
            >
              Mật khẩu:
            </label>
            <input
              className="addaccount-form-input"
              type="password"
              id="add-accountpassword"
              name="add-accountpassword"
              placeholder="Nhập mật khẩu"
              maxLength="16"
              required
              onChange={(e) => {
                setAccountPasswordInput(e.target.value);
              }}
            />
            <button className="addaccount-form-button" type="submit">
              Xác nhận
            </button>
          </form>
        </div>
      )}

      {addAccountRoleBtn && (
        <div className="addaccount">
          <h2 className="account-title">Thêm vai trò vào tài khoản:</h2>
          <form
            className="addaccount-form"
            onSubmit={handleAddAccountRoleButton}
          >
            <label className="addaccount-form-label" htmlFor="add-accountname">
              Tài khoản:
            </label>
            <input
              className="addaccount-form-input"
              type="text"
              id="add-accountname"
              name="add-accountname"
              placeholder="Tài khoản"
              maxLength="16"
              required
              value={addAccoutRoleInputUsername}
              readOnly={true}
              onChange={(e) => {
                setAddAccoutRoleInputUsername(e.target.value);
              }}
            />

            <label
              className="addaccount-form-label"
              htmlFor="add-accountpassword"
            >
              Thêm quyền:
            </label>
            <select
              className="addaccount-form-select"
              id="dropdown"
              value={selectedAddRole}
              onChange={(e) => {
                setSelectedAddRole(e.target.value);
                console.log(selectedAddRole);
              }}
            >
              {roleList.map(({ id, rolename }) => {
                return (
                  <option key={`rolenum#${id}`} value={id}>
                    {rolename}
                  </option>
                );
              })}
            </select>
            <button className="addaccount-form-button" type="submit">
              Xác nhận
            </button>
          </form>
        </div>
      )}

      {removeAccountRoleBtn && (
        <div className="addaccount">
          <h2 className="account-title">Gỡ vai trò khỏi tài khoản:</h2>
          <form
            className="addaccount-form"
            onSubmit={handleRemoveAccountRoleButton}
          >
            <label className="addaccount-form-label" htmlFor="add-accountname">
              Tài khoản:
            </label>
            <input
              className="addaccount-form-input"
              type="text"
              id="add-accountname"
              name="add-accountname"
              placeholder="Tài khoản"
              maxLength="16"
              required
              value={removeAccoutRoleInputUsername}
              readOnly={true}
              onChange={(e) => {
                setRemoveAccoutRoleInputUsername(e.target.value);
              }}
            />

            <label
              className="addaccount-form-label"
              htmlFor="add-accountpassword"
            >
              Gỡ quyền:
            </label>
            <select
              className="addaccount-form-select"
              id="dropdown"
              value={selectedRemoveRole}
              onChange={(e) => {
                setSelectedRemoveRole(e.target.value);
                console.log(selectedRemoveRole);
              }}
            >
              {roleList
                .filter((item) => selectedRow.roles.includes(item.rolename))
                .map(({ id, rolename }) => {
                  return (
                    <option key={`rolenumber#${id}`} value={id}>
                      {rolename}
                    </option>
                  );
                })}
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
          rows={accountList}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onRowClick={(e) => {
            setSelectedRow(e.row);
            setAddAccoutRoleInputUsername(e.row.username);
            setRemoveAccoutRoleInputUsername(e.row.username);
            console.log(selectedRow);
          }}
        />
      </Box>
    </div>
  );
}

export default Account;
