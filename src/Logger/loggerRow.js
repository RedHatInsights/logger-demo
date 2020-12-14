import React, { useState, useEffect, memo } from 'react';
import { LOGGER_LINE_NUMBER_INDEX_DELTA } from './utils/constants';
import classNames from 'classnames';
import './styles/loggerRow.styles.scss';
import PropTypes from 'prop-types';

const LoggerRow = memo(({ index, style, data }) => {
    const { parsedData, rowInFocus, setRowInFocus, highlightedRowIndexes, setHighlightedRowIndexes } = data;
    const [ clickCounter, setClickCounter ] = useState(0);
    const [ isHiglighted, setIsHiglighted ] = useState(false);
    // const [ rowSeen, setRowSeen ] = useState(false);

    useEffect(() => {
        let currentHighlightedIndexes = [];
        currentHighlightedIndexes = highlightedRowIndexes;
        let temp = 0;

        if (isHiglighted && clickCounter > 0) {
            currentHighlightedIndexes.push(index);
            setHighlightedRowIndexes(currentHighlightedIndexes);
        }
        else if (!isHiglighted && clickCounter > 0) {
            temp = currentHighlightedIndexes.indexOf(index);
            currentHighlightedIndexes.splice(temp, 1);
            setHighlightedRowIndexes(currentHighlightedIndexes);
        }
    }, [ clickCounter ]);

    useEffect(() => {
      const highlightIndex = highlightedRowIndexes.indexOf(index);
      highlightIndex === -1 ? setIsHiglighted(false) : setIsHiglighted(true);
    }, []);

    const getData = (index) => {
        return parsedData[ index ]; // Can use this function to later add wrapping for syntax highlighting (basic)
    };

    const getRowIndex = (index) => {
        return (index + LOGGER_LINE_NUMBER_INDEX_DELTA);
    };

    const handleHighlightRow = () => {
        const counter = clickCounter + 1;
        setClickCounter(counter);
        setIsHiglighted(!isHiglighted);
    };

    // const handleMouseFocusEnter = () => {
    //     if (rowInFocus !== index && rowSeen) {
    //         return null;
    //     }

    //     setRowSeen(true);
    // };

    const rowClassname = classNames('ins-logger-row cell__data-column',
        {
            'cell--highlighted': isHiglighted
        },
        {
            'cell--inFocus': index === rowInFocus 
        }
    );

    return (
        <div style={ style }
            className='ins-logger-row'
            onClick={ () => handleHighlightRow(index) }
            // onMouseEnter={ () => handleMouseFocusEnter() }
        >
            <span className='ins-logger-row cell__index-column'>
                { getRowIndex(index) }
            </span>
            <span
                className={ rowClassname }
                onClick={ () => handleHighlightRow() }
            >
                { getData(index) }
            </span>
        </div>
    );
});

LoggerRow.propTypes = {
    index: PropTypes.number,
    style: PropTypes.object,
    data: PropTypes.object
};

export default LoggerRow;
