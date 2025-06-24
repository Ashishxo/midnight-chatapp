import React from 'react'

function InputField({ className = "", placeholder, type="text", value, onChange=null, name=''}) {
  return (
    <input type={type} className={`bg-[#404040] outline-none rounded-2xl border-[0.1px] border-[#666666] p-4 ` + className} placeholder={placeholder} value={value} onChange={onChange} name={name}/>
  )
}

export default InputField