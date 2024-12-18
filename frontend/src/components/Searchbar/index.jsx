import "./Searchbar.scss";
import { SearchIcon } from "../../images/icons/index.jsx";
function Searchbar() {
  return (
    <div className="container-search">
      <input spellCheck="false" />
      <button className="search-button">
        <SearchIcon />
      </button>
    </div>
  );
}

export default Searchbar;
