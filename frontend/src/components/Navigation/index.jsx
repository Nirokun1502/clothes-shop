import MenuItem from "../MenuItem";
import "./Navigation.scss";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";

// eslint-disable-next-line react/prop-types
function Navigation() {
  const items = [
    {
      icon: faAddressCard,
      name: "Trang chủ",
      onClick: () => {
        console.log("hello!");
      },
      to: "/admin",
    },
    {
      icon: faAddressCard,
      name: "Tài khoản",
      onClick: () => {},
      to: "/account",
    },
    { icon: faAddressCard, name: "Vai trò", onClick: () => {}, to: "/role" },
    {
      icon: faAddressCard,
      name: "Quyền hạn",
      onClick: () => {},
      to: "/permission",
    },
    {
      icon: faAddressCard,
      name: "Thống kê",
      onClick: () => {},
      to: "/statistic",
    },
    {
      icon: faAddressCard,
      name: "Danh mục",
      onClick: () => {},
      to: "/category",
    },
    {
      icon: faAddressCard,
      name: "Sản phẩm",
      onClick: () => {},
      to: "/producttable",
    },
    {
      icon: faAddressCard,
      name: "Đơn hàng",
      onClick: () => {},
      to: "/ordertable",
    },
  ];

  return (
    <div className="container-nav">
      <ul>
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

        {/* set logic khi hover vào usermenu thì thêm class cho thẻ đó và mất hover thì tắt class đó đi */}
      </ul>
    </div>
  );
}

export default Navigation;
