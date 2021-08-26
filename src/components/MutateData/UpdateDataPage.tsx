import { useEffect, useState } from "react";
import { Data, useDataByID, useUpdateDataMutation } from "../../API/fakeApollo";
import { LoadingOverlay } from "../basic/Loading";
import { useHistory, useParams } from "react-router-dom";
import { useCallback } from "react";
import SlideOverPage from "../basic/SlideOverPage";
import EditDataForm from "./EditDataForm";
export const UpdateDataPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    setSidebarOpen(true);
  }, []);
  const [updateData, { loading }] = useUpdateDataMutation();
  const { id } = useParams<{ id: string }>();
  const { data, loading: dataLoading } = useDataByID(id);

  const history = useHistory();

  const closePage = useCallback(() => {
    setSidebarOpen(false);
    setTimeout(() => {
      history.push("/");
    }, 500);
  }, [history]);
  const handleUpdateData = useCallback(
    async (data: Omit<Data, "id">) => {
      await updateData({ data: { ...data, id }, id });
      closePage();
    },
    [updateData, id, closePage]
  );

  return (
    <SlideOverPage title="Edit data" onClose={closePage} open={sidebarOpen}>
      <>
        {data && (
          <EditDataForm
            loading={loading}
            startData={data}
            isNew={false}
            handleCommit={handleUpdateData}
          />
        )}
        {dataLoading && <LoadingOverlay />}
        {!dataLoading && !data && <div className="text-red-500">Error finding data</div>}
      </>
    </SlideOverPage>
  );
};

export default UpdateDataPage;
