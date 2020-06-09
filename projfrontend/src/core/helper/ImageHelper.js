import React from "react";
import { API } from "../../backend";

const ImageHelper = ({ image }) => {
  return (
    <div className="rounded border border-success p-2">
      <img
        src={image}
        alt="photo"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
        className="mb-3 rounded"
      />
    </div>
  );
};
export default ImageHelper;
