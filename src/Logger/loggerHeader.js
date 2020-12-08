import React, {useState} from 'react';
import {Button, TextInput} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons'
import './styles/loggerHeader.styles.scss';



const LoggerHeader = ({setSearchedInput, searchedInput, searchForKeyword}) => {
    const [userInput, setUserInput] = useState('')
    const disablingFlag = searchedInput == '' ? true : false;
    let value = userInput;

    console.log('Ou disabling flag: ', disablingFlag);


    const handleChange = (value) => {
        setUserInput(value);
        setSearchedInput(value.toLowerCase());
    }

    const handleSubmit = () => {
        searchForKeyword();
        handleChange('');
    }


    return (
        <>
            <TextInput 
                type='text' 
                value={value} 
                aria-label='logger keyword search bar'
                onChange={handleChange} 
                className='ins-logger-header__search'    
            />
            <Button
                onClick={handleSubmit}
                className='ins-header__btn'
                variant='control'
                isDisabled={disablingFlag}
            >
                <SearchIcon />
            </Button>
        </>
    )
}

export default LoggerHeader;