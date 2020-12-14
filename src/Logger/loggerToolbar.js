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
      setSearchedInput(userInput);

      if (userInput.length === 0) {
        console.log('DELETING MY INPUT'); //eslint-disable-line
        // setRowInFocus(DEFAULT_FOCUS);
        handleClear();
        console.log('DELETING MY INPUT bruh, :', DEFAULT_FOCUS); //eslint-disable-line
      }

      console.log('What happens with searchedInput in Toolar: ', userInput); //eslint-disable-line
      console.log('Length of my userINput: ', userInput.length);
    }, [ userInput ]);

    const handleChange = (value) => {
        setUserInput(value.toLowerCase());
        // searchForKeyword(userInput.toLowerCase());
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
        
        console.log('What happens with moving forward: ', oldIndex); //eslint-disable-line
        console.log('row in focus is: ', rowInFocus);
        console.log('Moving and looking for: ', searchedWordIndexes); //eslint-disable-line

        if (oldIndex >= searchedWordIndexes.length - 1) {
            console.log('HIT MY LIMIT NOW SUBIENDO PAPA'); //eslint-disable-line
            return null;
        }

        console.log(`TELOMETIERON: ${temp} and state is: ${foundWordIndex}`);
        
        setFoundWordIndex(++temp);
        scrollToRow(searchedWordIndexes[foundWordIndex]);
    };

    const handlePrevSearchItem = () => {
        let oldIndex = searchedWordIndexes.indexOf(rowInFocus);
        let temp = foundWordIndex;

        console.log('This is my rowInFocus: ', rowInFocus);
        console.log('What happens when moving back: ', oldIndex);

        if (oldIndex <= 0) {
            console.log('HIT MY LIMIT NOW BAJANDO PAPA'); //eslint-disable-line
            return null;
        }

        console.log(`TELOMETIERON: ${temp} and state is: ${foundWordIndex}`);
        setFoundWordIndex(--temp);
        scrollToRow(searchedWordIndexes[--temp]);
    };

    const handleKeyPress = (e) => {
        if(e.key === "Enter") {
          searchForKeyword(userInput.toLowerCase());
          setFoundWordIndex(DEFAULT_INDEX);
        }

        if(e.keyCode === 27) {
          console.log("CLEARING FROM ESC");
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
                    onKeyPress={ (e) => handleKeyPress(e) }
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
