import AboutUsPage from "@/app/AboutUs/page";
import { fetchUser, fetchUsers } from "@/lib/actions/userAction";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("Page", () => {
  it("renders a heading", () => {
    render(<AboutUsPage />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});

describe("Async Redux Actions", () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  it("fetchUsers should dispatch correct actions", async () => {
    await store.dispatch(fetchUsers());
    const actions = store.getActions();
    expect(actions[0].type).toEqual(fetchUsers.pending.type);
    expect(actions[1].type).toEqual(fetchUsers.fulfilled.type);
    // You can add more assertions as needed
  });

  it("fetchUser should dispatch correct actions", async () => {
    const formData = { emailid: "test@example.com", password: "password" };
    await store.dispatch(fetchUser(formData));
    const actions = store.getActions();
    expect(actions[0].type).toEqual(fetchUser.pending.type);
    expect(actions[1].type).toEqual(fetchUser.fulfilled.type);
    // You can add more assertions as needed
  });
});
