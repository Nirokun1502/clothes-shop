// import "./UserSearchBar.scss";
import axios from "axios";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
function SearchBar({ setResults, setVisible }) {
  const [input, setInput] = useState("");
  const jwt = localStorage.getItem("jwt");

  const fecthData = async (value) => {
    if (value.trim().length < 1) {
      setResults([]);
      return;
    }

    try {
      // const body = {
      //   key: "value",
      // };
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const results = await axios.get(
        `https://localhost:7121/api/Product/search/${value}`,
        config
      );
      setResults(results.data);
      console.log(results.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (value) => {
    setInput(value);
    fecthData(value);
    setVisible(true);
  };

  return (
    <div className="container-search">
      <input
        spellCheck="false"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setVisible(true)}
        onBlur={() => {
          setTimeout(() => {
            // setVisible(false);
          }, 125);
        }}
      />
      <button className="search-button">
        <FaSearch />
      </button>
    </div>
  );
}

export default SearchBar;
