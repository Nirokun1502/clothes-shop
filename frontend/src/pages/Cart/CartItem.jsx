/* eslint-disable react/prop-types */

import { useDispatch } from "react-redux";
import { removeCartItem, updateCartItem } from "../../State/Cart/Action";
import { useState } from "react";
import styles from "./index.module.scss";

function CartItem({ item, cartId, setRefresh }) {
  const [visible, setVisible] = useState(true);
  const dispatch = useDispatch();

  const handleUpdateCartItem = (num) => {
    console.log(item);
    const data = {
      cart_Id: cartId,
      variant_Id: item?.variant?.variant_Id,
      quantity: num,
    };
    console.log(data);
    dispatch(updateCartItem(data));
    setRefresh((prev) => !prev);
  };

  const handleRemoveCartItem = () => {
    const data = {
      cartId: cartId,
      itemId: item?.variant?.variant_Id,
    };
    dispatch(removeCartItem(data));
    setVisible(!visible);
  };

  return (
    visible && (
      <div className={styles.flex_row3}>
        <div className={styles.flex_col4}>
          <img
            className={styles.cover}
            src={item.variant.image}
            alt={item.variant.variant_Name}
          />
          <div className={styles.flex_row4}>
            <div className={styles.flex_col5}>
              <p className={styles.desc1}>{item.variant.variant_Name}</p>
              <p className={styles.paragraph}>{item.productName}</p>
            </div>
            <p className={styles.paragraph1}>{item.variant.price}VND</p>
          </div>
        </div>

        <div className={styles.flex_col6}>
          <img
            className={styles.image6}
            src={"/assets/5df583b0d8230cee2d32259b655f89ce.svg"}
            alt="delete button"
            onClick={handleRemoveCartItem}
          />
          <div className={styles.flex_col7}>
            <img
              className={styles.image10}
              src={"/assets/e672f5fe6c2bd76487b375425aeeea70.png"}
              alt="quantity increase button"
              onClick={() => handleUpdateCartItem(1)}
            />
            {/*img above ?? */}
            <div className={styles.content_box4}>
              <div className={styles.content_box3}>
                <div className={styles.rect2} />
              </div>
              <p className={styles.desc}>{item.quantity}</p>
            </div>

            <img
              className={styles.image9}
              src={"/assets/df8215d6408e8511592b5b0189da6e9e.png"}
              alt="quantity decrease button"
              onClick={() => handleUpdateCartItem(-1)}
            />
          </div>
        </div>
      </div>
    )
  );
}

export default CartItem;
