import { useCallback } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

import { Data, useDataQuery, useRemoveDataMutation } from "./fakeApollo";
import { FakeAPIProvider } from "./fakeApollo";
import { v4 as uuid } from "uuid";
import { XIcon } from "@heroicons/react/outline";
import NewDataPage from "./NewDataPage";
import { LoadingIcon, LoadingOverlay } from "./components/basic/Loading";

export default function App() {
  return (
    <FakeAPIProvider
      initialState={[
        { title: "Hello world", description: "world hello", id: uuid() },
        { title: "Some more data", description: "world hello", id: uuid() },
      ]}
    >
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/new" component={NewDataPage} />
        </Switch>
      </BrowserRouter>
    </FakeAPIProvider>
  );
}

function Main() {
  const { data, loading: loadingData } = useDataQuery();
  const [remove, { loading: removeLoading }] = useRemoveDataMutation();

  const handleRemove = useCallback(
    (id: string) => {
      remove({ id });
    },
    [remove]
  );

  const renderDataItem = (data: Data) => {
    return (
      <li key={data.id} className="flex items-center space-x-2 my-2">
        <div>
          <div className="font-medium">{data.title}</div>
          <div>{data.description}</div>
        </div>
        <button onClick={() => handleRemove(data.id)}>
          <XIcon className="w-4 h-4" />
        </button>
      </li>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">Data points</h1>
        <ul className="relative">
          {data?.map(renderDataItem)}
          {removeLoading && <LoadingOverlay />}
          {loadingData && (
            <div className="py-2 flex items-center opacity-50 space-x-2">
              <span className="italic">Loading data</span> <LoadingIcon />
            </div>
          )}
        </ul>
        <Link to="/new" className="text-sm underline">
          Add new
        </Link>
      </div>
    </div>
  );
}
