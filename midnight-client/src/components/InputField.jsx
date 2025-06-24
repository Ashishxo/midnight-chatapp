import React from 'react'

function InputField({ className = "", placeholder}) {
  return (
    <input type="text" className={`bg-[#404040] outline-none rounded-2xl border-[0.1px] border-[#666666] p-4 ` + className} placeholder={placeholder}/>
  )
}

export default InputField