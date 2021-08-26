import { BrowserRouter, Route, Switch } from "react-router-dom";
import { FakeAPIProvider } from "./API/fakeApollo";
import { v4 as uuid } from "uuid";

import MainDataList from "./components/MainDataList/MainDataList";
import NewDataPage from "./components/MutateData/NewDataPage";
import UpdateDataPage from "./components/MutateData/UpdateDataPage";

export default function App() {
  return (
    <FakeAPIProvider
      initialState={[
        { title: "Hello world", description: "world hello", id: uuid() },
        { title: "Some more data", description: "world hello", id: uuid() },
      ]}
    >
      <BrowserRouter>
        <MainDataList />
        <Switch>
          <Route exact path="/new" component={NewDataPage} />
          <Route exact path="/edit/:id" component={UpdateDataPage} />
        </Switch>
      </BrowserRouter>
    </FakeAPIProvider>
  );
}
