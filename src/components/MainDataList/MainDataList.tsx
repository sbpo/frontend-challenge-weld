import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Data,
  useDataQuery,
  useRemoveDataMutation,
  useRestoreDataMutation,
} from "../../API/fakeApollo";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "@heroicons/react/outline";
import { LoadingIcon, LoadingOverlay } from "../basic/Loading";
import UndoIcon from "../basic/icons/UndoIcon";
import { Transition } from "@headlessui/react";
import { Button } from "../basic/Button";

function MainDataList() {
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
        }, 10000);
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
    const currrentPageStartIndex = (currentPage - 1) * itemsPerPage;
    if (data && currrentPageStartIndex > 0 && data?.length <= currrentPageStartIndex) {
      setCurrentPage(Math.ceil(data?.length / itemsPerPage));
    }
  }, [data, currentPage, itemsPerPage]);

  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data?.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, data, itemsPerPage]);

  const renderDataItem = (data: Data, index: number) => {
    return (
      <li key={data.id} className="flex items-center space-x-2 my-4 bg-gray-100 rounded px-4">
        <Link to={`/edit/${data.id}`} className="flex-1 py-2">
          <div className="font-medium">{data.title}</div>
          <div>{data.description}</div>
        </Link>
        <button onClick={() => handleRemove(data, index)}>
          <XIcon className="w-4 h-4" />
        </button>
      </li>
    );
  };

  const renderPagenationControls = () => {
    return (
      <div className="flex items-center space-x-2">
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
                page === currentPage ? "bg-indigo-500 text-white" : "text-gray-700"
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
    <div className="flex justify-center min-h-screen">
      <div className="w-screen  max-w-screen-sm min-h-screen flex flex-col px-4">
        <h1 className="text-2xl font-bold pt-8">Data points</h1>
        <ul className="relative">{currentPageData?.map(renderDataItem)}</ul>
        {(removeLoading || restoreLoading) && <LoadingOverlay />}
        {loadingData && (
          <div className="py-4 w-full flex items-center opacity-50 space-x-2">
            <span className="italic">Loading data</span> <LoadingIcon />
          </div>
        )}
        {pages.length > 1 && renderPagenationControls()}
        <div className="pt-4 pb-8">
          <Link to="/new">
            <Button>Add new</Button>
          </Link>
        </div>
      </div>
      <DeletedItemsNotifications recentlyDeleted={recentlyDeleted} restore={handleRestore} />
    </div>
  );
}

const DeletedItemsNotifications: React.FC<{
  recentlyDeleted: { data: Data; index: number }[];
  restore: (item: { data: Data; index: number }) => void;
}> = ({ recentlyDeleted, restore }) => {
  //hold a cache of previous items for transitions to word
  const [cachedItems, setCachedItems] =
    useState<{ data: Data; index: number }[]>(recentlyDeleted);
  useEffect(() => {
    //full list of all previous notifications
    setCachedItems((p) => [
      ...recentlyDeleted,
      ...p.filter((pItem) => !recentlyDeleted.some((cur) => cur.data.id === pItem.data.id)),
    ]);
  }, [recentlyDeleted]);

  return (
    <div className="fixed bottom-0 mb-4 right-0 mr-6 flex flex-col space-y-2 w-48">
      {cachedItems.map((item) => {
        const show = recentlyDeleted.some((cur) => cur.data.id === item.data.id);
        return (
          <Transition
            appear={true}
            show={show}
            key={item.data.id}
            enter="transform ease-out duration-400 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="flex items-center shadow-lg bg-indigo-500 text-white border border-indigo-600 rounded">
              <div className="text-xs px-2 flex-grow">{item.data.title} deleted</div>
              <button
                className="hover:bg-indigo-500 rounded-r py-1 border-l border-indigo-500 px-1"
                onClick={() => restore(item)}
              >
                <UndoIcon />
              </button>
            </div>
          </Transition>
        );
      })}
    </div>
  );
};

export default MainDataList;
