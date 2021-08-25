import React, { useMemo, useReducer } from "react";
import { Data, useCreateDataMutation } from "./fakeApollo";
import { Button } from "./components/basic/Button";
import { LoadingOverlay } from "./components/basic/Loading";
import { ArrowLeftIcon, XCircleIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";

export type ActionType =
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
      type: "ON_SUCCESS";
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
    case "ON_SUCCESS":
      return { ...state, title: "", description: "" };
    default:
      return state;
  }
};

const NewDataPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    title: "",
    description: "",
  });
  const [createData, { loading }] = useCreateDataMutation();

  const formValidation = useMemo(() => {
    const titleValid = validateFormField(state.title);
    const descriptionValid = validateFormField(state.description);
    return titleValid && descriptionValid;
  }, [state.description, state.title]);

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <div>
        <Link to="/" className="flex items-center space-x-2 focus:outline-none text-xs mb-2">
          <ArrowLeftIcon className="h-3 w-3" />
          <span>Go back</span>
        </Link>
        <h1 className="text-2xl font-bold mb-4">Add data</h1>
        <div className="relative">
          <div>Title</div>
          <div className="relative">
            <input
              className="px-2 py-1 outline-none border rounded focus:ring focus:ring-blue-400 mb-4 w-64"
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

          <div>Description</div>
          <div className="relative">
            <textarea
              rows={5}
              className="px-2 py-1 outline-none border rounded focus:ring focus:ring-blue-400 w-64"
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
          <Button
            className={`mt-4 ${formValidation ? "" : "opacity-50"}`}
            onClick={() => {
              if (!loading && formValidation)
                createData({ data: state }).then(() => {
                  console.log("success");
                  dispatch({ type: "ON_SUCCESS" });
                });
            }}
          >
            Add item
          </Button>
          {loading && <LoadingOverlay />}
        </div>
      </div>
    </div>
  );
};

export default NewDataPage;

const validateFormField = (text: string) => {
  return text.length > 0;
};