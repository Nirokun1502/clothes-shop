/* eslint-disable react/prop-types */
import "./ResultsList.scss";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types, no-unused-vars
function ResultsList({ results, setProduct, setVisible }) {
  // const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();

  const handleProductClick = async (result) => {
    const productId = result.product_Id;
    navigate(`/product/${productId}`);
    // console.log(result.id);
    // try {
    //   const config = {
    //     headers: { Authorization: `Bearer ${jwt}` },
    //   };

    //   const response = await axios.get(
    //     `http://localhost/api/products/${productId}`,
    //     config
    //   );
    //   setProduct(response.data);
    //   console.log(response.data);
    //   // setVisible(false);
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
  };

  return (
    <div className="results-list">
      {results.slice(0, 6).map((result, index) => {
        return (
          <div
            className="results-child"
            key={index}
            onClick={() => handleProductClick(result)}
          >
            <p className="results-title">{result.product_Name}</p>
          </div>
        );
      })}
    </div>
  );
}

export default ResultsList;
