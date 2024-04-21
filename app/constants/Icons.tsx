import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Icons = {
  home: (color: string, size: number = 24) => (
    <Ionicons name="home" size={size} color={color} />
  ),
  search: (color: string, size: number = 24) => (
    <Ionicons name="search" size={size} color={color} />
  ),
  profile: (color: string, size: number = 24) => (
    <Ionicons name="person" size={size} color={color} />
  ),
  back: (color: string, size: number = 24) => (
    <Ionicons name="arrow-back" size={size} color={color} />
  ),
};

export default Icons;