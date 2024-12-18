import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import "./DefaultAdminLayout.scss";

// eslint-disable-next-line react/prop-types
function DefaultAdminLayout({ children }) {
  return (
    <div className="wrapper">
      <Header />
      <div className="container">
        <Navigation />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default DefaultAdminLayout;
