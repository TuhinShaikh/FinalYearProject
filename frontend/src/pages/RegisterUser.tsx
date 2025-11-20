import React, { useState } from "react";
import axios from "axios";

export default function RegisterUser(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
