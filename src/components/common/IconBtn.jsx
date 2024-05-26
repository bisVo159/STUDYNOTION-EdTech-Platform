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
    >
      {
        children?(
          <>
            <span>
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