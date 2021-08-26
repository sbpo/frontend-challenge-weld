import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

import {
  Data,
  useDataQuery,
  useRemoveDataMutation,
  useRestoreDataMutation,
} from "./fakeApollo";
import { FakeAPIProvider } from "./fakeApollo";
import { v4 as uuid } from "uuid";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "@heroicons/react/outline";
import { NewDataPage, UpdateDataPage } from "./MutateDataPage";
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
          <Route path="/edit/:id" component={UpdateDataPage} />
        </Switch>
      </BrowserRouter>
    </FakeAPIProvider>
  );
}

function Main() {
  const { data, loading: loadingData } = useDataQuery();
  const [remove, { loading: removeLoading }] = useRemoveDataMutation();
  const [restoreData, { loading: restoreLoading }] = useRestoreDataMutation();

  const [recentlyDeleted, setRecentlyDeleted] = useState<{ data: Data; index: number }[]>([]);

  const handleRemove = useCallback(
    (data: Data, index: number) => {
      remove({ id: data.id }).then(() => {
        setRecentlyDeleted((p) => [{ data, index }, ...p]);
        setTimeout(() => {
          setRecentlyDeleted((p) => p.filter((item) => item.data.id !== data.id));
        }, 100000);
      });
    },
    [remove]
  );

  const handleRestore = useCallback(
    (item: { data: Data; index: number }) => {
      setRecentlyDeleted((p) => p.filter((p) => p.data.id !== item.data.id));
      restoreData(item);
    },
    [restoreData]
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
    if (data && currrentPageFirstI > 0 && data?.length <= currrentPageFirstI) {
      setCurrentPage(Math.ceil(data?.length / itemsPerPage));
    }
  }, [data, currentPage, itemsPerPage]);

  const shownData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data?.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, data, itemsPerPage]);

  const renderDataItem = (data: Data, index: number) => {
    return (
      <li key={data.id} className="flex items-center space-x-2 my-2">
        <div>
          <Link to={`/edit/${data.id}`} className="font-medium">
            {data.title}
          </Link>
          <div>{data.description}</div>
        </div>
        <button onClick={() => handleRemove(data, index)}>
          <XIcon className="w-4 h-4" />
        </button>
      </li>
    );
  };

  const renderPagenationControls = () => {
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
              key={page}
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
          {(removeLoading || restoreLoading) && <LoadingOverlay />}
          {loadingData && (
            <div className="py-2 flex items-center opacity-50 space-x-2">
              <span className="italic">Loading data</span> <LoadingIcon />
            </div>
          )}
          {pages.length > 1 && renderPagenationControls()}
        </div>

        <Link to="/new" className="text-sm underline">
          Add new
        </Link>
      </div>
      <DeletedItemsNotifications recentlyDeleted={recentlyDeleted} restore={handleRestore} />
    </div>
  );
}

const DeletedItemsNotifications: React.FC<{
  recentlyDeleted: { data: Data; index: number }[];
  restore: (item: { data: Data; index: number }) => void;
}> = ({ recentlyDeleted, restore }) => {
  return (
    <div className="fixed bottom-0 mb-4 right-0 mr-6 flex flex-col space-y-2 w-48">
      {recentlyDeleted.map((item) => {
        return (
          <div className="flex items-center shadow-lg bg-gray-500 text-white border border-gray-600 rounded">
            <div className="text-xs px-2 flex-grow ">{item.data.title} deleted</div>
            <button
              className="hover:bg-gray-600 rounded-r py-1 border-l border-gray-600 px-1"
              onClick={() => restore(item)}
            >
              <UndoIcon />
            </button>
          </div>
        );
      })}
    </div>
  );
};

const UndoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className || ""}
    fill={"currentColor"}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path fill="none" d="M0 0h24v24H0V0z"></path>
    <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L3.71 8.71C3.08 8.08 2 8.52 2 9.41V15c0 .55.45 1 1 1h5.59c.89 0 1.34-1.08.71-1.71l-1.91-1.91c1.39-1.16 3.16-1.88 5.12-1.88 3.16 0 5.89 1.84 7.19 4.5.27.56.91.84 1.5.64.71-.23 1.07-1.04.75-1.72C20.23 10.42 16.65 8 12.5 8z"></path>
  </svg>
);
