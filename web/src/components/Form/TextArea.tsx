import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

interface TextAreaProps {
   id: string,
   name: string,
   maxLength?: number
};

const Input: React.FC<TextAreaProps> = ({ name, ...otherProps }) => {
   const textAreaRef = useRef(null);
   const { fieldName, registerField, error } = useField(name);

   useEffect(() => {
      registerField({
         name: fieldName,
         path: 'value',
         ref: textAreaRef.current
      })
   }, [fieldName, registerField]);

   return <textarea ref={textAreaRef} {...otherProps} />;
};

export default Input;