import MenuButtons from "../MenuButtons";
import Searchbar from "../Searchbar";
import UserMenu from "../UserMenu";
import "./Header.scss";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleIconClick = () => {
    navigate("/");
  };
  return (
    <div className="container-header">
      <a
        className="logo"
        onClick={() => {
          handleIconClick();
        }}
      >
        <img src="src\images\blueberrylogo.jpg"></img>
        <h2>Greatest Blue</h2>
      </a>
      <Searchbar />
      <MenuButtons />
      <UserMenu />
    </div>
  );
}

export default Header;
