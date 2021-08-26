import { useCallback, useContext } from "react";
import { useEffect } from "react";
import { Dispatch, SetStateAction, useState } from "react";
import { createContext } from "react";
import { v4 as uuid } from "uuid";
import { immutableSplice } from "../utilities/immutableArray";

export type Data = {
  id: string;
  title: string;
  description: string;
};

const FakeAPIContext = createContext<[Data[], Dispatch<SetStateAction<Data[]>>]>(
  [] as unknown as [Data[], Dispatch<SetStateAction<Data[]>>]
);

export const FakeAPIProvider = (props: {
  children: JSX.Element | JSX.Element[];
  initialState: Data[];
}) => {
  const state = useState<Data[]>(props.initialState);
  return <FakeAPIContext.Provider value={state}>{props.children}</FakeAPIContext.Provider>;
};

const useFakeLoading = () => {
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));
    setLoading(false);
  }, []);
  return { load, loading };
};

export const useDataQuery = () => {
  const [data] = useContext(FakeAPIContext);
  const { load, loading } = useFakeLoading();
  useEffect(() => {
    load();
  }, [load]);
  return { data: loading ? null : data, loading };
};

export const useDataByID = (id: string) => {
  const [data] = useContext(FakeAPIContext);
  const { load, loading } = useFakeLoading();
  const [queryResult, setQueryResult] = useState<Data | null>(null);

  useEffect(() => {
    load().then(() => {
      setQueryResult(data.find((d) => d.id === id) || null);
    });
  }, [load, id, data]);
  return { data: queryResult, loading };
};

export function useCreateDataMutation(): [
  (props: { data: Omit<Data, "id"> }) => Promise<any>,
  { loading: boolean }
] {
  const [, setData] = useContext(FakeAPIContext);
  const { load, loading } = useFakeLoading();
  return [
    async ({ data }) => {
      return load().then(() => {
        setData((prev) => [...prev, { ...data, id: uuid() }]);
      });
    },
    { loading },
  ];
}

export function useRestoreDataMutation(): [
  (props: { data: Data; index: number }) => Promise<any>,
  { loading: boolean }
] {
  const [, setData] = useContext(FakeAPIContext);
  const { load, loading } = useFakeLoading();
  return [
    async ({ data, index }) => {
      return load().then(() => {
        setData((prev) => immutableSplice(prev, index, 0, data));
      });
    },
    { loading },
  ];
}

export function useRemoveDataMutation(): [
  (props: { id: string }) => any,
  { loading: boolean }
] {
  const [, setData] = useContext(FakeAPIContext);
  const { load, loading } = useFakeLoading();
  return [
    async ({ id }) => {
      return load().then(() => {
        setData((prev) => prev.filter((x) => x.id !== id));
      });
    },
    { loading },
  ];
}

export function useUpdateDataMutation(): [
  (props: { data: Data; id: string }) => any,
  { loading: boolean }
] {
  const [, setData] = useContext(FakeAPIContext);
  const { load, loading } = useFakeLoading();
  return [
    async ({ data, id }) => {
      return load().then(() => {
        setData((prev) => prev.map((x) => (x.id === id ? { ...x, ...data } : x)));
      });
    },
    { loading },
  ];
}
