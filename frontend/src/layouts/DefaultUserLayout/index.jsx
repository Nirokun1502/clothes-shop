import UserNavigation from "../../components/UserComponents/UserNavigation";
import "./DefaultUserLayout.scss";

// eslint-disable-next-line react/prop-types
function DefaultUserLayout({ children }) {
  return (
    <div className="wrapper">
      <UserNavigation />
      <div className="content">{children}</div>
    </div>
  );
}

export default DefaultUserLayout;
