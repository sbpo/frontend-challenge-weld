import React, { useMemo, useReducer } from "react";
import { Data } from "../../API/fakeApollo";
import { Button } from "../basic/Button";
import { LoadingOverlay } from "../basic/Loading";
import { XCircleIcon } from "@heroicons/react/outline";

type ActionType =
  | {
      type: "UPDATE_TITLE";
      payload: string;
    }
  | {
      type: "UPDATE_DESCRIPTION";
      payload: string;
    }
  | {
      type: "CLEAR_DESCRIPTION";
    }
  | {
      type: "CLEAR_TITLE";
    }
  | {
      type: "RESET_STATE";
    };

type NewDataReducer = (state: Omit<Data, "id">, action: ActionType) => Omit<Data, "id">;
const reducer: NewDataReducer = (state: Omit<Data, "id">, action: ActionType) => {
  switch (action.type) {
    case "UPDATE_TITLE":
      return { ...state, title: action.payload };
    case "UPDATE_DESCRIPTION":
      return { ...state, description: action.payload };
    case "CLEAR_DESCRIPTION":
      return { ...state, description: "" };
    case "CLEAR_TITLE":
      return { ...state, title: "" };
    case "RESET_STATE":
      return { ...state, title: "", description: "" };
    default:
      return state;
  }
};

const EditDataForm: React.FC<{
  startData: Omit<Data, "id">;
  isNew: boolean;
  loading: boolean;
  handleCommit: (data: Omit<Data, "id">) => Promise<any>;
}> = ({ startData, isNew, loading, handleCommit }) => {
  const [state, dispatch] = useReducer(reducer, startData);

  const formValidation = useMemo(() => {
    const titleValid = validateFormField(state.title);
    const descriptionValid = validateFormField(state.description);
    return titleValid && descriptionValid;
  }, [state.description, state.title]);

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex-1">
        <div className="mb-1">Title</div>
        <div className="relative">
          <input
            className="px-2 py-1 outline-none border rounded focus:ring focus:ring-offset-2 focus:ring-indigo-400 w-full"
            value={state.title}
            onChange={(e) => {
              dispatch({ type: "UPDATE_TITLE", payload: e.target.value });
            }}
          />
          {state.title.length > 0 && (
            <button
              tabIndex={-1}
              onClick={() => {
                dispatch({ type: "CLEAR_TITLE" });
              }}
            >
              <XCircleIcon className="w-4 h-4 absolute top-0 right-0 mt-2 mr-2 " />
            </button>
          )}
        </div>

        <div className="mb-1 mt-4">Description</div>
        <div className="relative">
          <textarea
            rows={5}
            className="px-2 py-1 outline-none border rounded focus:ring focus:ring-offset-2 focus:ring-indigo-400 w-full"
            value={state.description}
            onChange={(e) => {
              dispatch({ type: "UPDATE_DESCRIPTION", payload: e.target.value });
            }}
          />
          {state.description.length > 0 && (
            <button
              tabIndex={-1}
              onClick={() => {
                dispatch({ type: "CLEAR_DESCRIPTION" });
              }}
            >
              <XCircleIcon className="w-4 h-4 absolute top-0 right-0 mt-2 mr-2 " />
            </button>
          )}
        </div>
      </div>
      <div>
        <Button
          className={`mt-4 ${formValidation ? "" : "opacity-75"}`}
          onClick={() => {
            if (!formValidation) {
              alert("Form invalid");
              return;
            }
            if (!loading) {
              handleCommit(state).then(() => {
                if (isNew) dispatch({ type: "RESET_STATE" });
              });
            }
          }}
        >
          {isNew ? "Add item" : "Update item"}
        </Button>
      </div>
      {loading && <LoadingOverlay />}
    </div>
  );
};

export default EditDataForm;

const validateFormField = (text: string) => {
  return text.length > 0;
};
