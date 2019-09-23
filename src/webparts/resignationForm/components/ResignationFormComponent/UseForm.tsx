import * as React from 'react';
import { useState, useEffect } from 'react';
import { sp, ItemAddResult, EmailProperties } from '@pnp/sp';

// const content = MailtoManager;
// console.log("mail", content);
const emailProps: EmailProperties = {
    To: ["saniya.salaria@aristocraticlemmings.onmicrosoft.com"],
    CC: [""],
    Subject: "Resignation email",
    Body: "Lorem ipsum dolor emet",
    From: "testuser01@aristocraticlemmings.onmicrosoft.com",
};
const useForm = (initialValues, validate) => {
    const [inputs, setInputs] = useState(initialValues || {});
    const [LastWorkingDate, setDate] = useState();
    const [errors, setErrors] = useState({});
    const [isSubmitting, setSubmitting] = useState(false);

    const handleInputChange = event => {
        console.log(event);
        const target = event.target;
        const name = target.name;
        setInputs(inputs => ({ ...inputs, [name]: target.value }));
    };
    const clearState = () => {
        setInputs({ ...initialValues });
    };
    const handleDateChange = event => {
        console.log(event);
        setDate(event);
    };

    const getPeoplePickerItems = (items: any[]) => {
        let peoplePickerValue = items[0];
        let fullName = peoplePickerValue.text.split(' ');
        let mFirstName = fullName[0];
        let mLastName = fullName[fullName.length - 1];
        let mEmail = peoplePickerValue.secondaryText;
        setInputs(inputs => ({ ...inputs, ManagerFirstName: mFirstName, ManagerLastName: mLastName, ManagerEmail: mEmail }));

    };

    useEffect(() => {
        if (isSubmitting) {
            const noErrors = Object.keys(errors).length === 0;
            if (noErrors) {
                console.log("Authenticated", inputs);
                setSubmitting(false);
            } else {
                setSubmitting(false);
            }
        }
    }, [errors])
    const handleBlur = () => {
        const ValidationErrors = validate(inputs);
        setErrors(ValidationErrors);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const ValidationErrors = validate(inputs);
        setErrors(ValidationErrors);
        setSubmitting(true);
        const elements = [{
            ...inputs,
            'EmployeeName': inputs.FirstName + " " + inputs.LastName,
            'ManagerName': inputs.ManagerFirstName + " " + inputs.ManagerLastName,
        }
        ];
        console.log("elements", elements);
        addListItem(elements[0]);

        //   onSubmit({ inputs });
        clearState();
    };

  
   
      
    // sp.utility.getCurrentUserEmailAddresses().then((addressString: string) => {
    //     console.log(addressString);
    // });
    const addListItem = (elements) => {
        sp.web.lists.getByTitle("ResignationList").items.add(elements).then((response: ItemAddResult): void => {
            const item = response.data as string;
            if (item) {
                console.log('submitted', item);

                //send email 
                sp.utility.sendEmail(emailProps).then(response => {
                    console.log("Email Sent!", response);
                });
            }
        }, (error: any): void => {
            console.log('Error while creating the item: ' + error);
        });
    };
    return {
        inputs,
        errors,
        getPeoplePickerItems,
        handleDateChange,
        LastWorkingDate,
        handleInputChange,
        handleSubmit,
        handleBlur,
        isSubmitting,
        

    };
};
export default useForm;