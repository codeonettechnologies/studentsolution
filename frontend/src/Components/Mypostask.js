import React from "react";
import { useOutletContext } from "react-router-dom";
import CommonContent from "./Common";
import ShopItem from "./Shopping";
import UsedItem from "./UsedItem";
import Learning from "./Learning";

export default function Mypostask() {
  const { currentSection } = useOutletContext();

  // Render only one component based on current section
  if (currentSection === "shoping") {
    return <ShopItem />;
  } else if (currentSection === "useditem") {
    return <UsedItem />;
  } else if (currentSection === "notes") {
    return <Learning />
  } else {
    return <CommonContent />;
  }
}
