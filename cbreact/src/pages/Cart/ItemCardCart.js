import React from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { useState } from "react";
import { deleteItem, updateItemSoldStatus } from "../../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectItemID } from '../../redux/cartSlice';

const formatTime = (timeString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    
  };
  return new Date(timeString).toLocaleString("en-US", options);
};

const getFormattedTime = (timeString) => {
  return formatTime(timeString);
};

const ItemCard = ({ item, uniqueIdentifier }) => {
  const [isRemoved, setRemoved] = useState(false);
  const [buyButtonText, setBuyButtonText] = useState("Buy");
  const itemID = item.itemID;

  const dispatch = useDispatch();
  
  const markitemsold = async (email, id) => {
    try {
        const apiUrl = 'http://localhost:3001/markitemsold'; // Update with your actual API endpoint for user data
        const response = await axios.post(apiUrl, { email, id });
        return response.data;
    } catch (error) {
        console.error(error);
        // Handle the error appropriately (e.g., return a default user object or rethrow the error)
        alert(error);
        throw new Error('Error marking item as sold');
    }
};

  const handleBuyClick = async () => {
    try { 
        const valid = await markitemsold(item.email, item.itemID);
        alert(valid);
        setBuyButtonText("Sold");
    } catch (error) {
        alert("Item purchase unsuccesful");
    }
};

const handleRemoveItem = () => {
  console.log('Removing Item with ID:', uniqueIdentifier);
  dispatch(deleteItem(uniqueIdentifier));
};


  if (isRemoved){
    return null;
  }

  //console.log(item.itemID)
  console.log(item.itemID)

  return (
    <div className="w-full grid grid-cols-5 mb-4 border py-2">
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-4 ml-4">
        <ImCross
          onClick={handleRemoveItem}
          className="text-primeColor hover:text-red-500 duration-300 cursor-pointer"
        />
        <p>{itemID}</p>
      </div>
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        <div className="flex w-1/3 items-center text-lg font-semibold">
          ${item.price}
        </div>
        <div className="w-2/3 flex items-center justify-left gap-6 text-lg">
          <button
            className="py-4 px-20 bg-green-700 text-white font-semibold uppercase mb-4 hover:bg-green-800 duration-300"
            onClick={handleBuyClick}
            disabled={buyButtonText === "Sold"} // Disable the button if the item is already sold
          >
            <p className="text-white font-semibold">{buyButtonText}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
