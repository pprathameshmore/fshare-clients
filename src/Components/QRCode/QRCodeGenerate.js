import React from "react";
import QRCode from "qrcode.react";

export default function QRCodeGenerate(props) {
  return (
    <div className="img-fluid">
      <QRCode value={props.url} />
    </div>
  );
}
