import React, {useState} from 'react';

interface FormValues {
    email?: string;
    password: string;
    password_confirmation: string;
    new_password?: string;

}
// export function useForm(initialValues: FormValues, validate){

//     const[values, setValues] = useState(initialValues);
//     const[errors, setErrors] = useState({})
//     const handleInputChange = (e: React.FormEvent) => {
//         const {name, value} = e.target
//         setValues()
//     }
// }