import React from "react";
import QRCode from "qrcode.react";

export default function QRCodeGenerate(props) {
  console.log(props);
  return (
    <div className="img-fluid">
      <QRCode className="img-fluid" value={props.url} level="L" />
    </div>
  );
}
