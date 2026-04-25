import React, { memo } from "react";
import PropTypes from "prop-types";

const LogoIcon = memo(() => {
  return (
    <a
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
      aria-label="HealthAxis Home"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm shrink-0" />
    </a>
  );
});

LogoIcon.displayName = "LogoIcon";

export default LogoIcon;
