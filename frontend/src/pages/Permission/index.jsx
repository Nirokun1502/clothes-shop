import "./Permission.scss";
import MenuItem from "../../components/MenuItem";
import { useEffect, useState } from "react";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import apiConfig from "../../config";
import axios from "axios";

function Permission() {
  const [permissionList, setPermissionList] = useState([]);
  const [addBtn, setAddBtn] = useState(false);
  const [updateBtn, setUpdateBtn] = useState(false);

  const [permissionNameInput, setPermissionNameInput] = useState("");
  const [permissionDescriptionInput, setPermissionDescriptionInput] =
    useState("");
  const [updatePermissionNameInput, setUpdatePermissionNameInput] =
    useState("");
  const [
    updatePermissionDescriptionInput,
    setUpdatePermissionDescriptionInput,
  ] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "permissionname",
      headerName: "Tên quyền hạn",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "permissiondescription",
      headerName: "Mô tả quyền hạn",
      flex: 2,
    },
    {
      field: "permissionroles",
      headerName: "Các quyền hạn chứa quyền này",
      flex: 2,
    },
  ];

  const getTableData = async () => {
    try {
      const apiUrl = apiConfig.apiurls.permission;
      const jwt = localStorage.getItem("jwt");

      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(apiUrl, config);
      setPermissionList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddButton = async (event) => {
    event.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      const apiUrl = apiConfig.apiurls.permission;
      const body = {
        permission_Name: permissionNameInput,
        permission_Description: permissionDescriptionInput,
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
      const apiUrl = `${apiConfig.apiurls.permission}/${id}`;
      const body = {
        permission_Name: updatePermissionNameInput,
        permission_Description: updatePermissionDescriptionInput,
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
        console.log("vui long chon mot quyen");
        return;
      }

      const id = selectedRow.id;
      setSelectedRow(null);
      const jwt = localStorage.getItem("jwt");
      const apiUrl = `${apiConfig.apiurls.permission}/${id}`;
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

  useEffect(() => {
    getTableData();
  }, []);

  const items = [
    {
      icon: faAddressCard,
      name: "Thêm quyền hạn",
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
    <div className="container-permission">
      <h2 className="permission-title">Quản lý quyền hạn</h2>
      <ul className="permission-buttons">
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
        <div className="addpermission">
          <h2 className="permission-title">Thêm quyền hạn mới:</h2>
          <form className="addpermission-form" onSubmit={handleAddButton}>
            <label
              className="addpermission-form-label"
              htmlFor="add-permissionname"
            >
              Tên quyền hạn:
            </label>
            <input
              className="addpermission-form-input"
              type="text"
              id="add-permissionname"
              name="add-permissionname"
              placeholder="Nhập tên quyền hạn"
              maxLength="16"
              required
              onChange={(e) => {
                setPermissionNameInput(e.target.value);
              }}
            />

            <label
              className="addpermission-form-label"
              htmlFor="add-permissiondescription"
            >
              Mô tả:
            </label>
            <input
              className="addpermission-form-input"
              type="text"
              id="add-permissiondescription"
              name="add-permissiondescription"
              placeholder="Nhập mô tả"
              maxLength="100"
              required
              onChange={(e) => {
                setPermissionDescriptionInput(e.target.value);
              }}
            />
            <button className="addpermission-form-button" type="submit">
              Xác nhận
            </button>
          </form>
        </div>
      )}

      {updateBtn && (
        <div className="addpermission">
          <h2 className="permission-title">Sửa thông tin quyền hạn:</h2>
          <form className="addpermission-form" onSubmit={handleUpdateButton}>
            <label
              className="addpermission-form-label"
              htmlFor="add-permissionname"
            >
              Tên quyền hạn:
            </label>
            <input
              className="addpermission-form-input"
              type="text"
              id="add-permissionname"
              name="add-permissionname"
              placeholder="Nhập tên quyền hạn"
              maxLength="16"
              required
              value={updatePermissionNameInput}
              onChange={(e) => {
                setUpdatePermissionNameInput(e.target.value);
              }}
            />

            <label
              className="addpermission-form-label"
              htmlFor="add-permissiondescription"
            >
              Mô tả:
            </label>
            <input
              className="addpermission-form-input"
              type="text"
              id="add-permissiondescription"
              name="add-permissiondescription"
              placeholder="Nhập mô tả"
              maxLength="100"
              required
              value={updatePermissionDescriptionInput}
              onChange={(e) => {
                setUpdatePermissionDescriptionInput(e.target.value);
              }}
            />
            <button className="addpermission-form-button" type="submit">
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
          rows={permissionList}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onRowClick={(e) => {
            setSelectedRow(e.row);
            setUpdatePermissionNameInput(e.row.permissionname);
            setUpdatePermissionDescriptionInput(e.row.permissiondescription);
            console.log(selectedRow);
          }}
        />
      </Box>
    </div>
  );
}

export default Permission;
