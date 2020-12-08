import React, { useState, useEffect } from 'react';
// import classNames from 'classnames';
import './styles/loggerFooter.styles.scss';
import { Button, Level, LevelItem } from '@patternfly/react-core';
import { AngleLeftIcon, AngleRightIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

const LoggerFooter = ({ highlightedRowIndexes, rowInFocus, scrollToRow }) => {
    const [ currentHighlightedIndex, setCurrentHighlightedIndex ] = useState();
    const [ rowIndexes, setRowIndexes ] = useState([ 'temp' ]);
    const [ isVisible, setIsVisible ] = useState(false);

    useEffect(() => {
        if (highlightedRowIndexes.length > 1 && !isVisible) {
            // console.log('Activating our footer: ');
            setIsVisible(true);
        } else {
            // console.log('Deactivting our footer');
            setIsVisible(false);
        }
    });

    useEffect(() => {
        setRowIndexes(highlightedRowIndexes);
    }, [ rowIndexes ]);

    useEffect(() => {
        if (rowInFocus) {
            scrollToRow(currentHighlightedIndex);
        }
    }, [ currentHighlightedIndex ]);

    const mapStateToProps = () => {
        setRowIndexes(highlightedRowIndexes);
    };

    // const handlePageDown = () => {
    //     scrollToRow(itemCount);
    // };

    // const handlePageUp = () => {
    //     scrollToRow(0);
    // };

    const handleNextHighlightedRow = () => {
        if (rowIndexes.length <= 1) {
            return;
        }

        setCurrentHighlightedIndex(2);
    };

    const handlePrevHighlightedRow = () => {
        if (rowIndexes.length <= 1) {
            return;
        }

        setCurrentHighlightedIndex(1);
    };

    const displayFooter = () => {
        return (
                <>
                    <LevelItem className='footer__icon-group'>
                        <Button
                            variant='plain'
                            className='footer__icons'
                            isSmall
                            onClick={ () => handlePrevHighlightedRow() }
                        >
                            <AngleLeftIcon />
                        </Button>
                        <Button
                            variant='plain'
                            className='footer__icons'
                            isSmall
                            onClick={ () => handleNextHighlightedRow() }
                        >
                            <AngleRightIcon />
                        </Button>
                      { /* <Button
                          variant='plain'
                          aria-label='Page up'
                          className='toolbar__icons'
                          // onClick={ handlePageUp }
                      >
                          <AngleDoubleUpIcon id='pageUp'/>
                      </Button>
                      <Button
                          variant='plain'
                          aria-label='Page down'
                          className='toolbar__icons'
                          // onClick={ handlePageDown }
                      >
                          <AngleDoubleDownIcon id='skipDown'/>
                      </Button> */ }
                    </LevelItem>
                </>
        );
    };

    return (
        <Level className='ins-logger-footer'>
            { displayFooter }
            { () => mapStateToProps() }
        </Level>
    );
};

LoggerFooter.propTypes = {
    highlightedRowIndexes: PropTypes.array,
    rowInFocus: PropTypes.number,
    scrollToRow: PropTypes.func
};

export default LoggerFooter;
