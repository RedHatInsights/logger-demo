import React, { useState, useEffect } from 'react';
import { Level, LevelItem, SearchInput } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import './styles/loggerToolbar.styles.scss';

const LoggerToolbar = ({
    searchedWordIndexes,
    setSearchedWordIndexes,
    scrollToRow,
    rowInFocus,
    setRowInFocus,
    setSearchedInput,
    searchedInput,
    searchForKeyword
}) => {
    const [ userInput, setUserInput ]  = useState('');
    const [ foundWordIndex, setFoundWordIndex ] = useState(-1);
    // const disablingFlag = searchedInput === '' ? true : false;
    const value = userInput;
    const DEFAULT_FOCUS = -1;
    const DEFAULT_INDEX = 1;

    useEffect(() => {
      if (userInput.length === 0) {
        handleClear();
        return null;
      }

      setSearchedInput(userInput);
    }, [ userInput ]);

    useEffect(() => {
      if( searchedWordIndexes.length >= 1 ){
        setFoundWordIndex(DEFAULT_INDEX);
      }
    }, [ searchedWordIndexes ]);

    const handleChange = (value) => {
        setUserInput(value.toLowerCase());
    };

    const handleClear = () => {
        setUserInput('');
        setSearchedInput('');
        setSearchedWordIndexes([]);
        setRowInFocus(DEFAULT_FOCUS);
    };

    const handleNextSearchItem = () => {
        let oldIndex = searchedWordIndexes.indexOf(rowInFocus);
        let temp = foundWordIndex;

        if (oldIndex >= searchedWordIndexes.length - 1) {
            return null;
        }
   
        setFoundWordIndex(++temp);
        scrollToRow(searchedWordIndexes[foundWordIndex]);
    };

    const handlePrevSearchItem = () => {
        let oldIndex = searchedWordIndexes.indexOf(rowInFocus);
        let temp = foundWordIndex;

        if (oldIndex <= 0) {
            return null;
        }

        setFoundWordIndex(--temp);
        scrollToRow(searchedWordIndexes[--temp]);
    };

    const handleKeyPress = (e) => {
        if(e.key === "Enter") {
          searchForKeyword(userInput.toLowerCase());
        }

        if(e.keyCode === 27) {
          handleClear();
        }
    };

    const renderSearchBar = () => {
        return (
            <>
                <SearchInput
                    type='text'
                    placeholder='Search'
                    value= { value }
                    aria-label='logger keyword search bar'
                    onChange={ handleChange }
                    onClear={ () => handleClear() }
                    onNextClick = { () => handleNextSearchItem() }
                    onPreviousClick = { () => handlePrevSearchItem() }
                    onKeyDown={ (e) => handleKeyPress(e) }
                    resultsCount = { 
                        searchedWordIndexes.length === 0 ? "" : `${ foundWordIndex } / ${ searchedWordIndexes.length }`
                    }
                    className='toolbar__searchbar'
                />
            </>
        );
    };

    // const renderSearchButtons = () => {
    //     if (searchedWordIndexes.length >= 2) {
    //         return (
    //             <>
    //                 <Button
    //                     variant='plain'
    //                     aria-label='Look up'
    //                     className='toolbar__icons'
    //                     onClick={ handlePrevSearchItem }
    //                 >
    //                     <AngleLeftIcon id='lookUp'/>
    //                 </Button>
    //                 <Button
    //                     variant='plain'
    //                     aria-label='Look down'
    //                     className='toolbar__icons'
    //                     onClick={ handleNextSearchItem }              
    //                 >
    //                     <AngleRightIcon id='lookDown'/>
    //                 </Button>
    //             </>
    //         );
    //     }
    // };

    return (
        <Level className='logger__toolbar'>
            <LevelItem className='toolbar__searchbar-group'>
                { renderSearchBar() }
            </LevelItem>
        </Level>
    );

};

LoggerToolbar.propTypes = {
    itemCount: PropTypes.number,
    scrollToRow: PropTypes.func,
    rowInFocus: PropTypes.number,
    setRowInFocus: PropTypes.func,
    setSearchedInput: PropTypes.func,
    searchedInput: PropTypes.string,
    searchForKeyword: PropTypes.func,
    searchedWordIndexes: PropTypes.array,
    setSearchedWordIndexes: PropTypes.func
};

export default LoggerToolbar;
