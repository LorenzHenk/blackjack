import React from "react";
import { Link } from "react-router-dom";
import { getUrl, Routes } from "../routes";

export function Home() {
  return (
    <div>
      HOME
      <Link to={getUrl(Routes.PracticeBasicCounting)}>
        Practice Basic Counting
      </Link>
    </div>
  );
}
