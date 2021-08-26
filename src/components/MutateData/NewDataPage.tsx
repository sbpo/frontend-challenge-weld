import { useEffect, useState } from "react";
import { Data, useCreateDataMutation } from "../../API/fakeApollo";
import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import SlideOverPage from "../basic/SlideOverPage";
import EditDataForm from "./EditDataForm";

export const NewDataPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    setSidebarOpen(true);
  }, []);
  const [createData, { loading }] = useCreateDataMutation();
  const history = useHistory();

  const handleCreateData = useCallback(
    async (data: Omit<Data, "id">) => {
      return createData({ data });
    },
    [createData]
  );

  const closePage = useCallback(() => {
    setSidebarOpen(false);
    setTimeout(() => {
      history.push("/");
    }, 500);
  }, [history]);

  return (
    <SlideOverPage title="Add data" onClose={closePage} open={sidebarOpen}>
      <EditDataForm
        startData={{ description: "", title: "" }}
        isNew={true}
        handleCommit={handleCreateData}
        loading={loading}
      />
    </SlideOverPage>
  );
};

export default NewDataPage;
