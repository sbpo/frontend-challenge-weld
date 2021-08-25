import { useCallback } from "react";
import { useDataQuery, useRemoveDataMutation } from "./fakeApollo";
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
  const { data, loading } = useDataQuery();

  const [remove] = useRemoveDataMutation();

  const handleRemove = useCallback(
    (id: string) => {
      remove({ id });
    },
    [remove]
  );

  const handleAdd = useCallback(() => {
    alert("not implemeted");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">Data points</h1>
        <ul>
          {data?.map((x) => (
            <li key={x.id} className="flex items-center space-x-2 my-2">
              <div>
                <div className="font-medium">{x.title}</div>
                <div>{x.description}</div>
              </div>
              <button onClick={() => handleRemove(x.id)}>
                <XIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
        <button onClick={handleAdd} className="text-sm underline">
          Add new
        </button>
      </div>
    </div>
  );
}
