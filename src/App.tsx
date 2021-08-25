import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

import { Data, useDataQuery, useRemoveDataMutation } from "./fakeApollo";
import { FakeAPIProvider } from "./fakeApollo";
import { v4 as uuid } from "uuid";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "@heroicons/react/outline";
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const pages = useMemo(() => {
    const nrOfPages = data ? Math.ceil(data?.length / itemsPerPage) : 0;
    return Array(nrOfPages)
      .fill(0)
      .map((_, i) => i + 1);
  }, [data, itemsPerPage]);

  useEffect(() => {
    //Make sure current page does no run out of data:
    const currrentPageFirstI = (currentPage - 1) * itemsPerPage;
    if (data && data?.length < currrentPageFirstI) {
      setCurrentPage(Math.ceil(data?.length / itemsPerPage));
    }
  }, [data, currentPage, itemsPerPage]);

  const shownData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data?.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, data, itemsPerPage]);

  console.log({ currentPage, shownData });

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

  const renderPageNationControls = () => {
    return (
      <div className="flex items-center space-x-2 py-2">
        <button
          className={`${currentPage === 1 ? "opacity-25" : ""}`}
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage((prev) => prev - 1);
            }
          }}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        {pages.map((page) => {
          return (
            <button
              onClick={() => {
                setCurrentPage(page);
              }}
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                page === currentPage ? "bg-blue-500 text-white" : "text-gray-700"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          className={`${currentPage === pages.length ? "opacity-25" : ""}`}
          onClick={() => {
            if (currentPage < pages.length) {
              setCurrentPage((prev) => prev + 1);
            }
          }}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">Data points</h1>
        <div className="relative">
          <ul className="relative">{shownData?.map(renderDataItem)}</ul>
          {removeLoading && <LoadingOverlay />}
          {loadingData && (
            <div className="py-2 flex items-center opacity-50 space-x-2">
              <span className="italic">Loading data</span> <LoadingIcon />
            </div>
          )}

          {pages.length > 1 && renderPageNationControls()}
        </div>

        <Link to="/new" className="text-sm underline">
          Add new
        </Link>
      </div>
    </div>
  );
}
