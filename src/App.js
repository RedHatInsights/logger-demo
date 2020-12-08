import './App.css';
import "@patternfly/react-core/dist/styles/base.css";
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

  // const onSelect = ( currentItem, currentItemProps ) => {
  //   console.log('looking at new logger: ', currentItem, currentItemProps)
  // };
  
  const stringTest = "\n\r\nPLAY [pause] *******************************************************************\n\r\nTASK [Gathering Facts] *********************************************************\n\nok: [etta-sitze.example.com]\n\r\nTASK [pause] *******************************************************************\n\nPausing for 60 seconds\n(ctrl+C then 'C' = continue early, ctrl+C then 'A' = abort)\r\nok: [etta-sitze.example.com]\n\r\nPLAY [run insights] ************************************************************\n\r\nTASK [run insights] ************************************************************\n\n\n\r\nPLAY [pause] *******************************************************************\n\r\nTASK [Gathering Facts] *********************************************************\n\nok: [etta-sitze.example.com]\n\r\nTASK [pause] *******************************************************************\n\nPausing for 60 seconds\n(ctrl+C then 'C' = continue early, ctrl+C then 'A' = abort)\r\nok: [etta-sitze.example.com]\n\r\nPLAY [run insights] ************************************************************\n\r\nTASK [run insights] ************************************************************\n\n";
  console.log('data.console in logger: ', stringTest);
  console.log('stringify ', JSON.stringify(stringTest));

  // const Logger = () => {
  //   <Logger 
  // }

  // const LazyLogger = () => {
  //   <LazyLog enableSearch text={ () => data.console } caseInsensitive/>
  // };

  return (
    <div className="root-div">
      <Stack>
          <h1 style={{textAlign: "center"}}> Logger Test </h1>
          <StackItem>
            <Card style={{ height: 900, width: 1000}}>
              <CardTitle>
                Lazy Log
              </CardTitle>
              <CardBody>
                <LazyLog extraLines={1} enableSearch text={stringTest} caseInsensitive/>
              </CardBody>
            </Card>
            <Card>
              <CardTitle>
                Logger
              </CardTitle>
              <CardBody>
                <Logger data={ data.message.payload } />
              </CardBody>
            </Card>
            <Card>
              <CardTitle> Raw Data</CardTitle>
              <CardBody>
                <Button> Click to See Raw Data </Button>
              </CardBody>
            </Card>
          </StackItem>
      </Stack>
    </div>
  );
}

export default App;
