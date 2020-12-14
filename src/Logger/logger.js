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

    console.log('TESTING DATA MIAMORRRRRRRRR'); //eslint-disable-line

    for (s of data) {
        if (s !== '\r' && s !== '\\r' && s !== '' && s !== '\n' && s !== '\\n"' && s !== '\\n' && s !== '"') {
            console.log('TESTING SUCCESS'); //eslint-disable-line
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

const Logger = memo(({ hasSearchbar, data, parseData }) => {
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

    useEffect(() => { parseData ? setParsedData(parseConsoleOutput(data)) : setParsedData(data); }, [parseData]); // this is going to cause issues as it is

    const searchForKeyword = () => {
        const searchResults = [];
        let rowIndexCounter = 0;
        let keywordIndexPosition = 0;
        let lowerCaseRow = "";

        if (searchedInput.match('[:][1-9]\d*')) {
            console.log('Trying to jump to a line: ', searchedInput); //eslint-disable-line
            const splitInput = searchedInput.split(':');
            const offsetIndex = parseInt(splitInput[1]) - 1;
            scrollToRow(offsetIndex); // Needs input validation/Clean Up for readability later
            setSearchedInput('');
            return;
        }

        for (const row of parsedData) {
            lowerCaseRow = row.toLowerCase();
            keywordIndexPosition = lowerCaseRow.search(searchedInput);

            if (keywordIndexPosition !== -1) {
                searchResults.push(rowIndexCounter);
            }

            rowIndexCounter++;
        }

        console.log('searched! checking my index: ', keywordIndexPosition); // eslint-disable-line
        console.log('searched! checking my searchResults: ', searchResults); // eslint-disable-lin
        
        if(searchResults.length > 0){
          setSearchedWordIndexes([...searchResults]); // testing this for search
          scrollToRow(searchResults[DEFAULT_SEARCH_INDEX]);
        }

        else if(searchResults.length <= 0){
          setRowInFocus(-1);
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
    parseData: true,
    hasSearchbar: true,
    includesLoadingStatus: true,
    includesFooter: false,
    searchedKeyword: '',
    path: '.console'
};

Logger.propTypes = {
    hasSearchbar: PropTypes.bool,
    includesFooter: PropTypes.bool, 
    data: PropTypes.string,
    parseData: PropTypes.bool
};

export default Logger;
