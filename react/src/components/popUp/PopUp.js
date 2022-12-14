import React, { useEffect, useRef, useState } from "react";
import { Whole, Wrap, Attribute, Button, CardWrap, CardDescription, CardStatusWrap } from "./style";
import { itemAction } from "../../redux/middleware/itemAction";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { cards } from "../../images";

const PopUp = ({ purpose, setPopUp, popUpSvg, play, cardData }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const loginUserId = useSelector(state => state.loginReducer.id);
  const userPoint = useSelector(state => state.loginReducer.point);
  const buyAmount = useRef();
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    if (purpose === "shop") setTotalPrice(popUpSvg.props["data-price"] * 1);
  }, []);

  if (cardData) {
    var attackColor =
      cardData.attack >= 25
        ? "rgb(212,175,55)"
        : cardData.attack < 25 && cardData.attack >= 15
        ? "rgb(170,169,173)"
        : "black";
    var defColor =
      cardData.def >= 25
        ? "rgb(212,175,55)"
        : cardData.def < 25 && cardData.def >= 15
        ? "rgb(170,169,173)"
        : "black";
    var averageColor =
      cardData.average >= 25
        ? "rgb(212,175,55)"
        : cardData.average < 25 && cardData.average >= 15
        ? "rgb(170,169,173)"
        : "black";
    var rarityColor =
      cardData.rarity === "UltraRare"
        ? "rgb(212,175,55)"
        : cardData.rarity === "Rare"
        ? "rgb(170,169,173)"
        : "black";
  }
  // console.log(popUpSvg);
  function closePopUp(e) {
    if (e.target.dataset.for === "backGround") {
      setPopUp(false);
      if (play) play();
    }
  }
  function onInput(e) {
    const targetSvg = e.target.parentNode.parentNode.parentNode.children[0];
    setTotalPrice(buyAmount.current.value * 1 * targetSvg.dataset.price * 1);
  }
  function openItem(e) {
    // console.log(e.target.parentNode.children[0].dataset.item);
    const targetSvg = e.target.parentNode.children[0];
    switch (targetSvg.dataset.item) {
      case "card_pack_basic":
        console.log("????????? ??????");
        dispatch(itemAction.openCardPack(loginUserId, setPopUp));
        break;
      case "card_pack_rare":
        console.log("?????? ????????? ??????");
        dispatch(itemAction.openRareCardPack(loginUserId, setPopUp));
        break;
      case "card_pack_ultraRare":
        console.log("?????? ????????? ??????");
        dispatch(itemAction.openUltraRareCardPack(loginUserId, setPopUp));
        break;
      case "point_5000":
        console.log("5000???????????? ??????");
        dispatch(itemAction.openPointPack(loginUserId, setPopUp, 5000));
        break;
      default:
        break;
    }
  }
  function buyItem(e) {
    const targetSvg = e.target.parentNode.parentNode.children[0];
    if (totalPrice > userPoint) {
      alert("?????? ????????? ??????");
      return;
    }
    dispatch(
      itemAction.buyItem(
        loginUserId,
        setPopUp,
        targetSvg.dataset.item,
        targetSvg.dataset.price,
        buyAmount.current.value,
        play
      )
    );
    // buyAmount.current.value = 1;
  }
  function giftPoint(e) {
    const targetSvg = e.target.parentNode.parentNode.children[0];
    if (totalPrice > userPoint) {
      alert("?????? ????????? ??????");
      return;
    }
    const targetId = prompt("????????? ?????? ????????? ???????????? ???????????????");
    if (targetId === "") {
      alert("???????????? ???????????????");
      giftPoint(e);
    } else if (targetId === null || targetId === undefined) return;
    else {
      const result = window.confirm(
        `${targetId} ????????? ${buyAmount.current.value}?????? ?????????????????????????`
      );
      if (result) {
        dispatch(
          itemAction.giftPoint(
            loginUserId,
            targetId,
            setPopUp,
            targetSvg.dataset.item,
            targetSvg.dataset.price,
            buyAmount.current.value,
            play
          )
        );
      }
    }
    // buyAmount.current.value = 1;
  }
  useEffect(() => {
    // popUpSvg.props.style.width = "300px";
    // console.log(popUpSvg.props);
  }, [popUpSvg]);
  // console.log(popUpSvg.props.style.width);
  return (
    <Whole onClick={closePopUp} data-for="backGround">
      <Wrap purpose={purpose}>
        {purpose === "inventory" ? (
          <>
            {popUpSvg}
            <Button onClick={openItem}>??????</Button>
          </>
        ) : null}
        {purpose === "shop" ? (
          <>
            {popUpSvg}
            <Attribute>
              <div>
                <label htmlFor="amount">??????: </label>
                <input
                  type="number"
                  id="amount"
                  defaultValue={1}
                  ref={buyAmount}
                  onInput={onInput}
                  min={1}
                  max={10}
                />
              </div>
              {popUpSvg.props["data-category"] === "point" ? (
                <Button onClick={giftPoint}>{totalPrice.toLocaleString()}P ??????</Button>
              ) : (
                <Button onClick={buyItem}>{totalPrice.toLocaleString()}P ??????</Button>
              )}
            </Attribute>
          </>
        ) : null}
        {purpose === "card" ? (
          <CardWrap style={{ backgroundColor: averageColor, width: "100%", height: "100%" }}>
            {/* <div style={{ width: "90%", height: "100px", backgroundColor: "orange" }}>????????????</div> */}
            <img
              src={cards[cardData.img]}
              alt=""
              style={{
                width: "90%",
                height: "70%",
                border: "6px solid black",
                backgroundColor: "white",
              }}
            ></img>
            <CardDescription>
              <CardStatusWrap>
                <span>
                  ?????????:<span style={{ color: attackColor }}>{cardData.attack}</span>
                </span>
                <span>
                  ?????????:<span style={{ color: defColor }}>{cardData.def}</span>
                </span>
              </CardStatusWrap>
              <CardStatusWrap>
                <span>
                  ??????:<span style={{ color: averageColor }}>{cardData.average}</span>
                </span>
                <span>
                  ????????????:<span style={{ color: rarityColor }}>{cardData.rarity}</span>
                </span>
              </CardStatusWrap>
            </CardDescription>
          </CardWrap>
        ) : null}
      </Wrap>
    </Whole>
  );
};

export default PopUp;
