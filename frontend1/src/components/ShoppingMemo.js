import React, { useState, useEffect } from "react";

const ShoppingMemo = () => {
  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("items"));
    if (items) {
      setItems(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const handleUndo = () => {
    if (isDeleted === true) {
      items.push(item);
      setIsDeleted(false);
    }
  };

  const handleClick = (event) => {
    console.log(event.detail);
    switch (event.detail) {
      case 1: {
        const newItems = [...items, item];
        setItems(newItems);
        break;
      }
      case 2: {
        const answer = window.confirm("Delete item?");
        if (answer) {
          items.pop();
          setIsDeleted(true);
          setItems(items);
        }

        break;
      }
      default: {
        break;
      }
    }
  };

  console.log("list of items: ", items);
  return (
    <div>
      <input
        type="text"
        placeholder="Add item"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />

      <button onClick={handleClick}>Add</button>
      <button onClick={handleUndo}>Undo</button>

      {items.map((item, index) => (
        <h1 key={index}>{item}</h1>
      ))}
    </div>
  );
};

export default ShoppingMemo;
