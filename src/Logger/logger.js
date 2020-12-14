import React, { useEffect, useState, memo }  from 'react';
import { VariableSizeList as List, areEqual } from 'react-window';
import LoggerRow from './loggerRow';
import LoggerToolbar from './loggerToolbar';
import LoggerFooter from './loggerFooter';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { LOGGER_ROW_HEIGHT, LOGGER_HEIGHT, LOGGER_WIDTH } from './utils/constants';
import YAML from 'yaml';
import './styles/base.scss';
import './styles/logger.styles.scss';
import './styles/styles.css';

const cleanUpStringArray = (data) => {
    const cleanArray = [];
    let s = '';
    console.log('HOw many times');
    for (s of data) {
        if (s !== '\r' && s !== '\\r' && s !== '"') {
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
    const DEFAULT_SEARCH_INDEX = 0;
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

    useEffect(() => { isParentDataString ? setParsedData(parseConsoleOutput(data.console)) : setParsedData(''); }, [isParentDataString]);

    const searchForKeyword = () => {
        const searchResults = [];
        let rowIndexCounter = 0;
        let keywordIndexPosition = 0;
        let lowerCaseRow = "";

        // Need to verify array v. string, might just be receiving an array depending on where they're running this
        console.log('Going looking for my searchedInput: ', searchedInput); //eslint-disable-line

        if (searchedInput.match('[:][1-9]\d*')) {
            const splitInput = searchedInput.split(':');
            console.log('Going searching in line mode: ', searchedInput);
            console.log('Going into line mode: ', splitInput);
            scrollToRow(parseInt(splitInput[1])); // Needs input validation/Clean Up for readability later
            setSearchedInput('');
            return;
        }

        for (const row of parsedData) {
            lowerCaseRow = row.toLowerCase();
            keywordIndexPosition = lowerCaseRow.indexOf(searchedInput);

            if (keywordIndexPosition !== -1) {
                console.log("searched! making sure we got the right thing: ", searchedInput); // eslint-disable-line
                searchResults.push(rowIndexCounter);
            }

            rowIndexCounter++;
        }

        console.log('searched! checking my index: ', keywordIndexPosition); // eslint-disable-line
        
        if(searchResults.length > 0){
          console.log('searched! scrolling to : ', searchResults[DEFAULT_SEARCH_INDEX]); // eslint-disable-line
          setSearchedWordIndexes([...searchResults]); // testing this for search
          scrollToRow(searchResults[DEFAULT_SEARCH_INDEX]);
        }
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
        <div className='ins-c-logger' hasgutter>
            <LoggerToolbar
                rowInFocus={ rowInFocus }
                setRowInFocus={ setRowInFocus }
                scrollToRow={ scrollToRow }
                loggerRef={ loggerRef }
                itemCount={ parsedData.length }
                searchedWordIndexes={ searchedWordIndexes }
                setSearchedWordIndexes={ setSearchedWordIndexes }
                itemsPerPage={ calculateItemsPerPage }
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
                itemCount={ `${ parsedData.length }` }
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
    isParentDataString: false,
    hasSearchbar: true,
    includesLoadingStatus: true,
    includesFooter: false,
    searchedKeyword: '',
    path: '.console'
};

Logger.propTypes = {
    hasSearchbar: PropTypes.bool,
    includesFooter: PropTypes.bool, 
    data: PropTypes.object,
    isParentDataString: PropTypes.bool
};

export default Logger;
