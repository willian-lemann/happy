import React, { ChangeEvent, useRef, useEffect, useCallback, useState, MutableRefObject } from 'react';
import { useField } from '@unform/core';

interface Props {
   name: string;
}

type InputProps = JSX.IntrinsicElements['input'] & Props;

const InputFile: React.FC<InputProps> = ({ name, ...otherProps }) => {
   const { onChange } = otherProps;
   const inputRef = useRef<HTMLInputElement>(null);
   const { fieldName, registerField, error } = useField(name);

   useEffect(() => {
      registerField({
         name: fieldName,
         ref: inputRef.current,
         path: 'files',
         clearValue(ref: HTMLInputElement) {
            if (!ref.files) {
               return
            }
         },
         setValue(_: HTMLInputElement, value: any) {

         }
      })
   }, [fieldName, registerField]);

   return (
      <>
         <input
            type="file"
            ref={inputRef} 
            {...otherProps}
         />
      </>
   );
};
export default InputFile;