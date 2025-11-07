import React from "react";
import { useOutletContext } from "react-router-dom";
import CommonContent from "./Common";
import ShopItem from "./Shopping";

export default function Mypostask() {
  const { currentSection } = useOutletContext();

  return (
    <>
      {currentSection === "shoping" ? <ShopItem /> : <CommonContent />}
    </>
  );
}
