import React, { useState, useEffect } from 'react';
import { Level, LevelItem, SearchInput } from '@patternfly/react-core';
// import { AngleDoubleDownIcon, AngleDoubleUpIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import './styles/loggerToolbar.styles.scss';

const LoggerToolbar = ({
    searchedWordIndexes,
    setSearchedWordIndexes,
    scrollToRow,
    rowInFocus,
    hasSearchbar,
    setSearchedInput,
    searchedInput,
    searchForKeyword
}) => {
    const [ userInput, setUserInput ]  = useState('');
    // const disablingFlag = searchedInput === '' ? true : false;
    const value = userInput;

    useEffect(() => {
      console.log('Viendo que es searchedInput: ', searchedInput); //eslint-disable-line
    }, [ searchedInput ]);

    const handleChange = (value) => {
        setUserInput(value);
        setSearchedInput(userInput);
        searchForKeyword(userInput.toLowerCase());
    };

    const handleClear = () => {
        setUserInput('');
        setSearchedInput('');
        setSearchedWordIndexes([]);
    };

    const handleNextSearchItem = () => {
        let oldIndex = searchedWordIndexes.indexOf(rowInFocus);
        console.log('TAKING OVER EVERYTHNG: '); //eslint-disable-line

        if (oldIndex >= searchedWordIndexes.length - 1) {
            return null;
        }

        scrollToRow(searchedWordIndexes[oldIndex++]);
        // setRowInFocus(searchedWordIndexes[oldIndex++]);
    };

    const handlePrevSearchItem = () => {
        let oldIndex = searchedWordIndexes.indexOf(rowInFocus);

        if (oldIndex <= 0) {
            return null;
        }

        scrollToRow(searchedWordIndexes[--oldIndex]);
    };

    // const handleSearchInputSubmit = (e) => {
    //     if(e.key !== "Enter") {
    //         return null;
    //     }

    //     searchFo
    // };

    const renderSearchBar = () => {
        if (!hasSearchbar) {
            return null;
        }

        return (
            <>
                <SearchInput
                    type='text'
                    placeholder='Search'
                    value= { value }
                    aria-label='logger keyword search bar'
                    onChange={ handleChange }
                    onClear={ handleClear }
                    onNextClick = { handleNextSearchItem }
                    onPreviousClick = { handlePrevSearchItem }
                    resultsCount = { searchedWordIndexes.length }
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
    hasSearchbar: PropTypes.bool,
    setSearchedInput: PropTypes.func,
    searchedInput: PropTypes.string,
    searchForKeyword: PropTypes.func,
    searchedWordIndexes: PropTypes.array,
    setSearchedWordIndexes: PropTypes.func
};

export default LoggerToolbar;
