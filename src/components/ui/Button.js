import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx';

const Button = ({children, variant, onClick, type, disabled, classNames}) => {
    // Default props
    const baseClasses = "px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantClasses = {
        primary: "bg-orange-400 text-white hover:bg-orange-500 focus:ring-orange-500",
        secondary: "text-blue-800 hover:bg-blue-10  0 focus:ring-blue-400",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
    };
    const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={clsx(
            baseClasses,
            variantClasses[variant],
            disabled && disabledClasses,
            classNames)}
    >
        {children}
    </button>
  )
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    disabled: PropTypes.bool,
    onClick: () => {}
}

export default Button