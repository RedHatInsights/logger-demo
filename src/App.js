import './App.css';
import "@patternfly/react-core/dist/styles/base.css";
import React, { useState } from 'react';
import { LazyLog } from 'react-lazylog';
import Logger from './Logger/logger';
import data from "./data/data";
import {
  Button,
  CardTitle,
  Card,
  CardBody, 
  Stack,
  StackItem,
  TextArea
} from "@patternfly/react-core";

const App = () => {
  const [ showData, setShowData ] = useState(false);
  const [ parseData, setParseData ] = useState(true);
  const [ textAreaValue, setTextAreaValue ] = useState('');
  const [ message, setMessage ] = useState(data.message.payload.console);
  // const onSelect = ( currentItem, currentItemProps ) => {
  //   console.log('looking at new logger: ', currentItem, currentItemProps)
  // };

  const originalData = data.message.payload.console;

  const handleTextAreaChange = (textAreaValue) => {
    setTextAreaValue(textAreaValue);
  }

  const submitNewLog = () => {
    console.log('New log submitted:', textAreaValue);
    setMessage(textAreaValue);
  }

  const resetLog = () => {
    console.log('Resetting log values');
    setTextAreaValue('');
    setMessage(originalData);
  }
  
  return (
    <div className="root-div">
      <Stack hasGutter>
          <h1 style={{textAlign: "center"}}> Logger Test </h1>
          <StackItem>
            <Card>
              <CardTitle> Custom Log Message</CardTitle>
              <CardBody>
                <TextArea value={textAreaValue} onChange={handleTextAreaChange}/>
                <div className='button-wrapper'>
                  <Button variant="primary" onClick={() => submitNewLog()}> Submit </Button>
                  <Button variant="secondary" onClick={() => resetLog()}> Reset </Button>
                </div>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <Card style={{ height: 800 }}>
              <CardTitle>
                Lazy Log
              </CardTitle>
              <CardBody>
                <LazyLog extraLines={1} enableSearch text={ message } caseInsensitive/>
              </CardBody>
            </Card>
            <Card style={{ height: 800 }}>
              <CardTitle>
                Logger
                <Button style={ { marginLeft: 10 } } onClick={() => { setParseData(!parseData) }}>Parse Data</Button>
              </CardTitle>
              <CardBody style={{ height: 700, width: 1200}}>
                <Logger data={ message }  parseData={ parseData } />
              </CardBody>
            </Card>
            <Card>
              <CardTitle> Raw Data</CardTitle>
              <CardBody>
                <Button onClick={ () => { setShowData(!showData) } }> Click to See Raw Data </Button>
              </CardBody>
              <CardBody>
                { showData ? <p> { message } </p>: <br /> }
              </CardBody>
            </Card>
          </StackItem>
      </Stack>
    </div>
  );
}

export default App;
