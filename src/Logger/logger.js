import React, { useEffect, useState, memo }  from 'react';
import { VariableSizeList as List, areEqual } from 'react-window';
import LoggerRow from './loggerRow';
import LoggerToolbar from './loggerToolbar';
// import LoggerFooter from './loggerFooter';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { LOGGER_ROW_HEIGHT, LOGGER_HEIGHT, LOGGER_WIDTH } from './utils/constants';
import YAML from 'yaml';
import './styles/base.scss';
import './styles/logger.styles.scss';
import './styles/styles.css';

const cleanUpStringArray = (data) => { // Needs refactoring and refinement *later*
    const cleanArray = [];
    let s = '';
    console.log('This is our split: ', data); //eslint-disable-line

    for (s of data) {
        if (s !== '\r' && s !== '\\r' && s !== '"') {
            // spaceCounter++;
            cleanArray.push(s);
        }
    }

    return cleanArray;

};

const parseConsoleOutput = (data) => {
    const stringToSplitWith = '\n';
    const stringifiedData = YAML.stringify(data);
    const cleanString = stringifiedData.split(stringToSplitWith);

    return cleanUpStringArray(cleanString);
};

// Wrapping multiple variables around memoization to rerender loggerRow only when these change, and to send both through a single obj.
const createLoggerDataItem = memoize((
    parsedData,
    searchedInput,
    loggerRef,
    rowInFocus,
    setRowInFocus,
    highlightedRowIndexes,
    setHighlightedRowIndexes,
    searchedWordIndexes
) => ({
    parsedData,
    searchedInput,
    loggerRef,
    rowInFocus,
    setRowInFocus,
    highlightedRowIndexes,
    setHighlightedRowIndexes,
    searchedWordIndexes
}));

const Logger = memo(({ hasSearchbar, data, isParentDataString }) => {
    const [ parsedData, setParsedData ] = useState([]);
    const [ searchedInput, setSearchedInput ] = useState('');
    const [ searchedWordIndexes, setSearchedWordIndexes ] = useState([]);
    const [ highlightedRowIndexes, setHighlightedRowIndexes ] = useState([]);
    const [ rowInFocus, setRowInFocus ] = useState();
    const loggerRef = React.useRef();
    Logger.displayName = 'Logger';
    const dataToRender = createLoggerDataItem(
        parsedData,
        searchedInput,
        loggerRef,
        rowInFocus,
        setRowInFocus,
        highlightedRowIndexes,
        setHighlightedRowIndexes,
        searchedWordIndexes
    );

    const scrollToRow = (searchedRowIndex) => {
        setRowInFocus(searchedRowIndex);
        loggerRef.current.scrollToItem(searchedRowIndex, 'center');

        return true;
    };

    useEffect(() => {
        isParentDataString
            ? setParsedData(parseConsoleOutput(data.console))
            : setParsedData('');
    }, []);

    useEffect(() => {
        if (searchedWordIndexes.length !== 0) {
            scrollToRow(searchedWordIndexes[0]);
        }
    }, [ searchedWordIndexes ]);

    const searchForKeyword = () => {
        let rowIndexCounter = 0;
        const searchResults = [];

        // Need to verify array v. string, might just be receiving an array depending on where they're running this
        console.log('This is my searchedInput: ', searchedInput); //eslint-disable-line

        if (searchedInput.match(':')) {

            const splitInput = searchedInput.split(':');
            scrollToRow(parseInt(splitInput[1])); // Needs input validation/Clean Up for readability later
            setSearchedInput('');
            return;
        }

        for (const row of parsedData) {
            console.log('Looking for the stuffs inside this: ', parsedData); //eslint-disable-line
            console.log('This is my searchedInput in the search: ', searchedInput); //eslint-disable-line
            console.log('This is my row of parsedData: ', row); //eslint-disable-line
            const lowerCaseRow = row.toLowerCase();
            const keywordIndexPosition = lowerCaseRow.search(searchedInput);

            console.log('This is my searched index position: ', keywordIndexPosition); //eslint-disable-line

            if (keywordIndexPosition !== -1) {
                searchResults.push(rowIndexCounter);
            }

            rowIndexCounter++;
        }

        setSearchedWordIndexes(searchedWordIndexes => [ ...searchedWordIndexes, ...searchResults ]); // gonna need a way for the user to clear these
    };

    const calculateItemsPerPage = () => {
        return Math.round(LOGGER_HEIGHT / LOGGER_ROW_HEIGHT); // This will have to change with collapsible rows
    };

    const setRowHeight = (index) => {
        return index % 2 === 0
            ? LOGGER_ROW_HEIGHT
            : LOGGER_ROW_HEIGHT;
    };

    return (
      <>
        <div className='ins-c-logger' hasGutter>
            <LoggerToolbar
                rowInFocus={ rowInFocus }
                setRowInFocus={ setRowInFocus }
                scrollToRow={ scrollToRow }
                loggerRef={ loggerRef }
                itemCount={ parsedData.length }
                searchedWordIndexes={ searchedWordIndexes }
                setSearchedWordIndexes={ setSearchedWordIndexes }
                itemsPerPage={ calculateItemsPerPage }
                hasSearchbar={ hasSearchbar }
                searchedInput={ searchedInput }
                setSearchedInput={ setSearchedInput }
                searchForKeyword={ searchForKeyword }
            />
            <List
                className='logger__grid'
                rowHeight={ index => setRowHeight(index) }
                height={ LOGGER_HEIGHT }
                width={ LOGGER_WIDTH }
                itemSize={ () => 30 }
                itemCount={ parsedData.length }
                itemData={ dataToRender }
                ref={ loggerRef }
            >
                { LoggerRow }
            </List>
            { /* <LoggerFooter
                highlightedRowIndexes={ highlightedRowIndexes }
                scrollToRow={ scrollToRow }
                setRowInFocus={ setRowInFocus }
            /> */ }
        </div>
      </>
    );
}, areEqual);

Logger.defaultProps =  {
    isParentDataString: true,
    hasSearchbar: true,
    includesLoadingStatus: true,
    searchedKeyword: '',
    path: '.console'
};

Logger.propTypes = {
    hasSearchbar: PropTypes.bool,
    data: PropTypes.object,
    isParentDataString: PropTypes.bool
};

export default Logger;
