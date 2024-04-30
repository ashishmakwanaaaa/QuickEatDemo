// In your jest.setup.js or at the top of your test file before imports
jest.mock("next/navigation", () => ({
  useNavigation: () => ({
    navigate: jest.fn().mockImplementation((url) => Promise.resolve(true)),
    replace: jest.fn().mockImplementation((url) => Promise.resolve(true)),
    back: jest.fn().mockImplementation(() => Promise.resolve(true)),
  }),
}));

import React from "react";
import {
  render as rtlRender,
  RenderResult,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { Provider } from "react-redux";
import fetch from "jest-fetch-mock";
import { PersistGate } from "redux-persist/integration/react";
import PageTest from "../components/Aboutus";
import { persistor, store } from "../../lib/store"; // Adjust the import path as necessary
import { ReactElement } from "react";
import Contact from "../../app/components/Contact";
import Services from "../../app/components/Services";
import AddCustomer from "../../app/Pages/AddCustomer";
import CustomerList from "../../app/UserPage/CustomerList";
import { it } from "node:test";
import { fetchCustomer } from "../../lib/actions/customerAction";
import { act } from "react-dom/test-utils";
import Login from "../../app/Pages/Login";

afterEach(cleanup)

// Type definition for the sendComponent function, specifying that it returns a RenderResult
const sendComponent = (component: ReactElement): RenderResult =>
  rtlRender(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {component}
      </PersistGate>
    </Provider>
  );

// This module mock might need adjustment based on your actual routing library and its types
jest.mock("next/router", () => require("next-router-mock"));
jest.mock("node-fetch", () => require("jest-fetch-mock"));
jest.mock("next/navigation", () => ({
  ...require("next-router-mock"),
  useSearchParams: () => jest.fn(),
}));

// aboutus page tesing
describe("AboutUs", () => {
  it("renders AboutUs page unchanged", () => {
    const { container } = sendComponent(<PageTest />);
    expect(container).toMatchSnapshot();
  });
});

//contact page testing
describe("Contact", () => {
  it("renders contact Page unchanged", () => {
    const { container } = sendComponent(<Contact />);
    expect(container).toMatchSnapshot();
  });
});

//service page testing
describe("Service", () => {
  it("renders service Page unchanged", () => {
    const { container } = sendComponent(<Services />);
    expect(container).toMatchSnapshot();
  });
});

describe("AddCustomer", () => {
  beforeEach(() => {
    fetch.resetMocks(); // Ensure fetis re beforeseech t ach test
  });

  it("renders correctly", () => {
    const { container } = sendComponent(<AddCustomer />);
    expect(container).toMatchSnapshot();
  });

  it("allows input fields to be updated", () => {
    sendComponent(<AddCustomer />);
    const firstNameInput: any = screen.getByTestId("customername12");
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    expect(firstNameInput.value).toBe("John");
  });

  it("submits the customer data and handles the response", async () => {
    console.log("Before mockResponse");
    fetch.mockResponseOnce(
      JSON.stringify({ message: "Customer Added Successfully" })
    );
    console.log("After mockResponse");

    sendComponent(<AddCustomer />);
    const submitButton = await screen.getByTestId("addcustomerbutton");

    console.log("Before click");
    fireEvent.click(submitButton);
    console.log("After click");

    await waitFor(() => {
      console.log("Inside waitFor");
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(
        screen.getByText("Customer Added Successfully")
      ).toBeInTheDocument();
    });
  });
  afterEach(() => {
    cleanup();
  });
});

// describe("CustomerList", () => {
//   it("should fetch data and display it correctly", async () => {
//     const json = await fetchCustomer("660ac2b65106785cbea8b8c6");
//     // fetch.mockResponseOnce(JSON.stringify([{ id: 1, name: "John Doe" }]));
//     sendComponent(<CustomerList />);

//     await waitFor(() => {
//       expect(Array.isArray(json)).toEqual(true);
//       expect(json.length).toEqual(0);
//     });
//   });
// });

describe("Login", () => {
  it("submits the form with invalid", async () => {
    sendComponent(<Login />);
    expect(screen.getByTestId("emailid")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId("login")).toBeEnabled();

    fireEvent.change(screen.getByTestId("emailid"), {
      target: { value: "ashishmak2406@gmail.com" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Ashish123" },
    });
    fireEvent.submit(screen.getByTestId("login"));
  });
});
