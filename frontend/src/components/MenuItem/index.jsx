import "./MenuItem.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
// eslint-disable-next-line react/prop-types
function MenuItem({ index, icon, name, onClick, to }) {
  return to ? (
    <li key={index} className="dropdown-item" onClick={() => onClick()}>
      <NavLink className="dropdown-item" to={to}>
        <FontAwesomeIcon icon={icon ? icon : faUser} />
        <p className="menuitem-name"> {name} </p>
      </NavLink>
    </li>
  ) : (
    <li key={index} className="dropdown-item" onClick={() => onClick()}>
      <FontAwesomeIcon icon={icon ? icon : faUser} />
      <p className="menuitem-name"> {name} </p>
    </li>
  );
}

export default MenuItem;
