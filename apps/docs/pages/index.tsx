import { useEffect } from "react";

export default function Docs() {
  useEffect(() => {
    console.log("Docs");
  }, []);
  return (
    <div>
      <h1>Docs</h1>
    </div>
  );
}
