import React from 'react'

function IconBtn({
    text,
    onclick,
    children,
    disabled,
    outline=false,
    customeClasses,
    type
}) {
  return (
    <button
    disabled={disabled}
    onClick={onclick}
    type={type}
    className={`flex items-center ${
      outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
    } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 ${customeClasses}`}
    >
      {
        children?(
          <>
            <span className={`${outline && "text-yellow-50"}`}>
              {text}
            </span>
            {children}
          </>
        ):(
          <span>
          {text}
        </span>
        )
      }
    </button>
  )
}

export default IconBtn