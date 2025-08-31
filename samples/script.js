import http from "k6/http";
import { check } from "k6";

export default function () {
  check(http.get("http://localhost:5000/products"), {
    "status is 200": (r) => r.status == 200,
    "protocol is HTTP/2": (r) => r.proto == "HTTP/2.0",
  });
}