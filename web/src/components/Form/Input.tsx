import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

interface InputProps {
   id: string,
   name: string,
   type: string,
};

const Input: React.FC<InputProps> = ({ name, ...otherProps }) => {
   const inputRef = useRef(null);
   const { fieldName, registerField, error } = useField(name);

   useEffect(() => {
      registerField({
         name: fieldName,
         path: 'value',
         ref: inputRef.current
      })
   }, [fieldName, registerField]);

   return (
      <>
         <input
            ref={inputRef}
            name={name}
            style={error ? { borderColor: 'red' } : {}}
            {...otherProps}
         />
         {error && <span style={{ color: 'red' }}>{error}</span>}
      </>
   );
}

export default Input;