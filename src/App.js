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
} from "@patternfly/react-core";

const App = () => {
  const [ showData, setShowData ] = useState(false);
  const [ parseData, setParseData ] = useState(true);
  // const onSelect = ( currentItem, currentItemProps ) => {
  //   console.log('looking at new logger: ', currentItem, currentItemProps)
  // };
  
  const stringTest = "\n\r\nPLAY [pause] *******************************************************************\n\r\nTASK [Gathering Facts] *********************************************************\n\nok: [etta-sitze.example.com]\n\r\nTASK [pause] *******************************************************************\n\nPausing for 60 seconds\n(ctrl+C then 'C' = continue early, ctrl+C then 'A' = abort)\r\nok: [etta-sitze.example.com]\n\r\nPLAY [run insights] ************************************************************\n\r\nTASK [run insights] ************************************************************\n\n\n\r\nPLAY [pause] *******************************************************************\n\r\nTASK [Gathering Facts] *********************************************************\n\nok: [etta-sitze.example.com]\n\r\nTASK [pause] *******************************************************************\n\nPausing for 60 seconds\n(ctrl+C then 'C' = continue early, ctrl+C then 'A' = abort)\r\nok: [etta-sitze.example.com]\n\r\nPLAY [run insights] ************************************************************\n\r\nTASK [run insights] ************************************************************\n\n";
  console.log('data.console in logger: ', stringTest);
  console.log('stringify ', JSON.stringify(stringTest));
  console.log('Testing out my og data: ', data);

  return (
    <div className="root-div">
      <Stack>
          <h1 style={{textAlign: "center"}}> Logger Test </h1>
          <StackItem>
            <Card style={{ height: 800, width: 1000}}>
              <CardTitle>
                Lazy Log
              </CardTitle>
              <CardBody>
                <LazyLog extraLines={1} enableSearch text={ data.message.payload.console } caseInsensitive/>
              </CardBody>
            </Card>
            <Card style={{ height: 800, width: 1500}}>
              <CardTitle>
                Logger
                <Button style={ { marginLeft: 10 } } onClick={() => { setParseData(!parseData) }}>Parse Data</Button>
              </CardTitle>
              <CardBody style={{ height: 700, width: 1200}}>
                <Logger data={ data.message.payload.console }  parseData={ parseData } />
              </CardBody>
            </Card>
            <Card>
              <CardTitle> Raw Data</CardTitle>
              <CardBody>
                <Button onClick={ () => { setShowData(!showData) } }> Click to See Raw Data </Button>
              </CardBody>
              <CardBody>
                { showData ? <p> { stringTest } </p>: <br /> }
              </CardBody>
            </Card>
          </StackItem>
      </Stack>
    </div>
  );
}

export default App;
