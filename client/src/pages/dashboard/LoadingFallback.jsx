import React, { memo } from "react";
import PropTypes from "prop-types";
import Spinner from "../../components/Spinner";

const LoadingFallback = memo(() => (
  <div className="w-full h-screen flex items-center justify-center">
    <Spinner />
  </div>
));

LoadingFallback.displayName = "LoadingFallback";

LoadingFallback.propTypes = {
  children: PropTypes.node,
};

LoadingFallback.defaultProps = {
  children: null,
};

export default LoadingFallback;
