import ManageUserPage from "../AdminPage/ManageUserPage";
import DashBoard from "../Pages/DashBoard";

const ManageUser = () => {
  return (
    <>
      <DashBoard>
        <ManageUserPage />
      </DashBoard>
    </>
  );
};

export default ManageUser;
