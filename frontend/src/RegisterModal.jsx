/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useState } from "react";
import axios from "axios";

export default function RegisterModal({ open = false, setOpen }) {
  const cancelButtonRef = useRef(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  
  // This should be stored securely in a real application
  const ADMIN_SECRET_CODE = "admin123";

  const handleLogin = async () => {
    try {
      // Check if admin code is correct when admin registration is attempted
      let role = "USER";
      if (isAdmin) {
        if (adminCode !== ADMIN_SECRET_CODE) {
          alert("Invalid admin code");
          return;
        }
        role = "ADMIN";
        console.log("Setting role to ADMIN");
      }
      
      // Debug what we're sending to the server
      const userData = {
        username,
        password,
        email,
        role
      };
      console.log("Sending registration data:", userData);
      
      const response = await axios.post("http://localhost:8080/users", userData);
      const data = response.data;
      console.log("Registration response:", data);
      
      // Make sure role is explicitly included in localStorage
      const userToStore = {
        email: data.email,
        id: data.id,
        username: data.username,
        // Explicitly use the role we set rather than what came back from server
        role: role 
      };
      
      console.log("Storing user in localStorage:", userToStore);
      localStorage.setItem("minimalUser", JSON.stringify(userToStore));
      
      setOpen(false);
      
      // Use redirect instead of reload to avoid losing state
      window.location.href = "/";
    } catch (error) {
      console.error("Registration error:", error);
      setPassword("");
      alert("Error Registering user. Try again later");
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h1 className="text-3xl mb-5 font-bold tracking-tight text-gray-900">
                      Register
                    </h1>
                    <form>
                      <div className="mt-5">
                        <div className="">
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Username
                          </label>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="given-name"
                            className="p-1 mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-xl border border-gray-200 rounded-md"
                            onChange={(e) => {
                              setUsername(e.target.value);
                            }}
                            value={username}
                          />
                        </div>

                        <div className="mt-5">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="given-name"
                            className="p-1 mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-xl border border-gray-200 rounded-md"
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                            value={email}
                          />
                        </div>

                        <div className="mt-5">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            className="p-1 mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-xl border border-gray-300 rounded-md"
                            onChange={(e) => {
                              setPassword(e.target.value);
                            }}
                            value={password}
                          />
                        </div>
                        
                        <div className="mt-5">
                          <div className="flex items-center">
                            <input
                              id="is-admin"
                              name="is-admin"
                              type="checkbox"
                              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                              checked={isAdmin}
                              onChange={(e) => setIsAdmin(e.target.checked)}
                            />
                            <label htmlFor="is-admin" className="ml-2 block text-sm text-gray-900">
                              Register as Admin
                            </label>
                          </div>
                        </div>
                        
                        {isAdmin && (
                          <div className="mt-5">
                            <label
                              htmlFor="admin-code"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Admin Code
                            </label>
                            <input
                              type="password"
                              name="admin-code"
                              id="admin-code"
                              className="p-1 mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-xl border border-gray-300 rounded-md"
                              onChange={(e) => {
                                setAdminCode(e.target.value);
                              }}
                              value={adminCode}
                            />
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 pt-10 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={handleLogin}
                        >
                          Register
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
