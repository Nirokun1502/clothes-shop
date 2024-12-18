import "./Role.scss";
import MenuItem from "../../components/MenuItem";
import { useEffect, useState } from "react";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import apiConfig from "../../config";
import axios from "axios";

function Role() {
  const [roleList, setRoleList] = useState([]);
  const [permissionList, setPermissionList] = useState([]);
  const [addBtn, setAddBtn] = useState(false);

  const [updateBtn, setUpdateBtn] = useState(false);

  const [addRolePermissionBtn, setAddRolePermissionBtn] = useState(false);
  const [removeRolePermissionBtn, setRemoveRolePermissionBtn] = useState(false);

  const [roleNameInput, setRoleNameInput] = useState("");
  const [roleDescriptionInput, setRoleDescriptionInput] = useState("");

  const [updateRoleNameInput, setUpdateRoleNameInput] = useState("");
  const [updateRoleDescriptionInput, setUpdateRoleDescriptionInput] =
    useState("");

  const [addRolePermissionInputRoleName, setAddRolePermissionInputRoleName] =
    useState("");
  const [
    removeRolePermissionInputRoleName,
    setRemoveRolePermissionInputRoleName,
  ] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedAddPermission, setSelectedAddPermission] = useState({});
  const [selectedRemovePermission, setSelectedRemovePermission] = useState("");

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "rolename",
      headerName: "Tên vai trò",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "roledescription",
      headerName: "Mô tả vai trò",
      flex: 2,
    },
    {
      field: "rolepermissions",
      headerName: "Quyền hạn",
      flex: 2,
    },
  ];

  const getTableData = async () => {
    try {
      const apiUrl = apiConfig.apiurls.role;
      const jwt = localStorage.getItem("jwt");

      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(apiUrl, config);
      setRoleList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getPermissionData = async () => {
    try {
      const apiUrl = apiConfig.apiurls.permission;
      const jwt = localStorage.getItem("jwt");

      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(apiUrl, config);
      setPermissionList(
        response.data.map(({ id, permissionname }) => ({ id, permissionname }))
      );
      console.log(
        response.data.map(({ id, permissionname }) => ({ id, permissionname }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddButton = async (event) => {
    event.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      const apiUrl = apiConfig.apiurls.role;
      const body = {
        role_Name: roleNameInput,
        role_Description: roleDescriptionInput,
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

  const handleUpdateButton = async (event) => {
    event.preventDefault();
    try {
      if (!selectedRow) {
        console.log("vui long chon mot vai tro");
        return;
      }

      const id = selectedRow.id;

      setSelectedRow(null);
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.role}/${id}`;
      const body = {
        role_Name: updateRoleNameInput,
        role_Description: updateRoleDescriptionInput,
      };
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const response = await axios.put(apiUrl, body, config);
      getTableData();
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteButton = async () => {
    try {
      if (!selectedRow) {
        console.log("vui long chon mot vai tro");
        return;
      }

      const id = selectedRow.id;
      setSelectedRow(null);
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.role}/${id}`;
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

  const handleAddRolePermissionButton = async (event) => {
    event.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.role}/permission`;
      const body = {
        role_Id: selectedRow.id.toString(),
        permission_id: selectedAddPermission.toString(),
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

  const handleRemoveRolePermissionButton = async (event) => {
    event.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.role}/permission`;
      const body = {
        role_Id: selectedRow.id,
        permission_id: selectedRemovePermission,
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
    getPermissionData();
  }, []);

  const items = [
    {
      icon: faAddressCard,
      name: "Thêm vai trò",
      onClick: () => {
        setAddBtn(!addBtn);
        console.log("hello!");
      },
    },
    {
      icon: faAddressCard,
      name: "Sửa thông tin",
      onClick: () => {
        setUpdateBtn(!updateBtn);
      },
    },
    {
      icon: faAddressCard,
      name: "Thêm quyền",
      onClick: () => {
        setAddRolePermissionBtn(!addRolePermissionBtn);
      },
    },
    {
      icon: faAddressCard,
      name: "Gỡ quyền",
      onClick: () => {
        setRemoveRolePermissionBtn(!removeRolePermissionBtn);
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
    <div className="container-role">
      <h2 className="role-title">Quản lý vai trò</h2>
      <ul className="role-buttons">
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
        <div className="addrole">
          <h2 className="role-title">Thêm vai trò mới:</h2>
          <form className="addrole-form" onSubmit={handleAddButton}>
            <label className="addrole-form-label" htmlFor="add-rolename">
              Tên vai trò:
            </label>
            <input
              className="addrole-form-input"
              type="text"
              id="add-rolename"
              name="add-rolename"
              placeholder="Nhập tên vai trò"
              maxLength="16"
              required
              onChange={(e) => {
                setRoleNameInput(e.target.value);
              }}
            />

            <label className="addrole-form-label" htmlFor="add-roledescription">
              Mô tả:
            </label>
            <input
              className="addrole-form-input"
              type="text"
              id="add-roledescription"
              name="add-roledescription"
              placeholder="Nhập mô tả"
              maxLength="100"
              required
              onChange={(e) => {
                setRoleDescriptionInput(e.target.value);
              }}
            />
            <button className="addrole-form-button" type="submit">
              Xác nhận
            </button>
          </form>
        </div>
      )}

      {addRolePermissionBtn && (
        <div className="addaccount">
          <h2 className="account-title">Thêm quyền vào vai trò:</h2>
          <form
            className="addaccount-form"
            onSubmit={handleAddRolePermissionButton}
          >
            <label className="addaccount-form-label" htmlFor="add-accountname">
              Vai trò:
            </label>
            <input
              className="addaccount-form-input"
              type="text"
              id="add-accountname"
              name="add-accountname"
              placeholder="Vai trò"
              maxLength="16"
              required
              value={addRolePermissionInputRoleName}
              readOnly={true}
              onChange={(e) => {
                setAddRolePermissionInputRoleName(e.target.value);
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
              value={selectedAddPermission}
              onChange={(e) => {
                setSelectedAddPermission(e.target.value);
                console.log(selectedAddPermission);
              }}
            >
              {permissionList.map(({ id, permissionname }) => {
                return (
                  <option key={`permissionnum#${id}`} value={id}>
                    {permissionname}
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

      {removeRolePermissionBtn && (
        <div className="addaccount">
          <h2 className="account-title">Gỡ quyền khỏi vai trò:</h2>
          <form
            className="addaccount-form"
            onSubmit={handleRemoveRolePermissionButton}
          >
            <label className="addaccount-form-label" htmlFor="add-accountname">
              Vai trò:
            </label>
            <input
              className="addaccount-form-input"
              type="text"
              id="add-accountname"
              name="add-accountname"
              placeholder="Vai trò"
              maxLength="20"
              required
              value={removeRolePermissionInputRoleName}
              readOnly={true}
              onChange={(e) => {
                setRemoveRolePermissionInputRoleName(e.target.value);
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
              value={selectedRemovePermission}
              onChange={(e) => {
                setSelectedRemovePermission(e.target.value);
                console.log(selectedRemovePermission);
              }}
            >
              {permissionList
                .filter((item) =>
                  selectedRow.rolepermissions.includes(item.permissionname)
                )
                .map(({ id, permissionname }) => {
                  return (
                    <option key={`permissionnumber#${id}`} value={id}>
                      {permissionname}
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

      {updateBtn && (
        <div className="addrole">
          <h2 className="role-title">Sửa thông tin vai trò:</h2>
          <form className="addrole-form" onSubmit={handleUpdateButton}>
            <label className="addrole-form-label" htmlFor="add-rolename">
              Tên vai trò:
            </label>
            <input
              className="addrole-form-input"
              type="text"
              id="add-rolename"
              name="add-rolename"
              placeholder="Nhập tên vai trò"
              maxLength="16"
              required
              value={updateRoleNameInput}
              onChange={(e) => {
                setUpdateRoleNameInput(e.target.value);
              }}
            />

            <label className="addrole-form-label" htmlFor="add-roledescription">
              Mô tả:
            </label>
            <input
              className="addrole-form-input"
              type="text"
              id="add-roledescription"
              name="add-roledescription"
              placeholder="Nhập mô tả"
              maxLength="100"
              required
              value={updateRoleDescriptionInput}
              onChange={(e) => {
                setUpdateRoleDescriptionInput(e.target.value);
              }}
            />
            <button className="addrole-form-button" type="submit">
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
          rows={roleList}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onRowClick={(e) => {
            setSelectedRow(e.row);

            setAddRolePermissionInputRoleName(e.row.rolename);
            setRemoveRolePermissionInputRoleName(e.row.rolename);
            console.log(selectedRow);
            setUpdateRoleNameInput(e.row.rolename);
            setUpdateRoleDescriptionInput(e.row.roledescription);
            console.log(updateRoleNameInput);
            console.log(updateRoleDescriptionInput);
          }}
        />
      </Box>
    </div>
  );
}

export default Role;
