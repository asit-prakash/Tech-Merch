import React from "react";

//Image component for card used in home
const ImageHelper = ({ image }) => {
  return (
    <div className="rounded border border-info">
      <img
        src={image}
        alt="photo"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
        className="rounded"
      />
    </div>
  );
};
export default ImageHelper;
