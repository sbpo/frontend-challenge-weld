import { useCallback } from "react";
import { Data, useDataQuery, useRemoveDataMutation } from "./fakeApollo";
import { FakeAPIProvider } from "./fakeApollo";
import { v4 as uuid } from "uuid";
import { XIcon } from "@heroicons/react/outline";

export default function App() {
  return (
    <FakeAPIProvider
      initialState={[
        { title: "Hello world", description: "world hello", id: uuid() },
        { title: "Some more data", description: "world hello", id: uuid() },
      ]}
    >
      <Main />
    </FakeAPIProvider>
  );
}

function Main() {
  const { data, loading: loadingData } = useDataQuery();

  const [remove, { loading: removeLoading }] = useRemoveDataMutation();
  console.log({ removeLoading, loadingData });
  const handleRemove = useCallback(
    (id: string) => {
      remove({ id });
    },
    [remove]
  );

  const handleAdd = useCallback(() => {
    alert("not implemeted");
  }, []);

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
        <button onClick={handleAdd} className="text-sm underline">
          Add new
        </button>
      </div>
    </div>
  );
}

const LoadingOverlay = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50 flex items-center justify-center">
      <LoadingIcon />
    </div>
  );
};

const LoadingIcon = () => {
  return (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};
