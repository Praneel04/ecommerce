/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { getPriceString } from "./util/getPriceString";
import apiAdapter from "./services/ApiAdapter";

const lineItems = [
  {
    id: 1,
    title: "Throwback Hip Bag",
    color: "Salmon",
    price: "$90.00",
    quantity: 1,
    images: [
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg",
    ],
  },
  {
    id: 2,
    title: "Medium Stuff Satchel",
    color: "Blue",
    price: "$32.00",
    quantity: 1,
    images: [
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
    ],
  },
];

export default function Cart({ open, setOpen }) {
  const [lineItems, setLineItems] = useState([]);
  const [total, setTotal] = useState(0.0);

  let user = localStorage.getItem("minimalUser");
  if (user) user = JSON.parse(user);

  const getCart = async () => {
    try {
      const data = await apiAdapter.getCart(user.id);
      setLineItems(data.lineItems);
      setTotal(data.totalCost);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    if (open && user) getCart();
  }, [open]);

  const removeLineItem = async (id) => {
    try {
      await apiAdapter.removeFromCart(id, user.id);
      getCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const checkout = async () => {
    console.log("checkout");
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={() => setOpen(false)}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900 font-playfair">
                        Shopping cart
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {!user && (
                      <div className="grid place-items-center h-screen">
                        <div className="text-center">
                          <p className="text-lg text-gray-600 mb-4">Login to enable cart</p>
                          <button 
                            onClick={() => {
                              setOpen(false);
                              // You would need to add a way to open login modal
                            }} 
                            className="elegant-button-secondary text-sm"
                          >
                            Sign in
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mt-8">
                      {user && (
                        <div className="flow-root">
                          <ul className="-my-6 divide-y divide-gray-200">
                            {lineItems.map(
                              ({ product, quantity, trueId: id }) => (
                                <li key={id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 elegant-card">
                                    <img
                                      src={product.images[0]}
                                      alt="product"
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <a href={`product/${product.id}`} className="hover:text-accent-color transition duration-300">
                                            {product.title}
                                          </a>
                                        </h3>
                                        <p className="ml-4 font-bold">
                                          {getPriceString(product.price)}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {product.color}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <p className="text-gray-500">
                                        Qty: {quantity}
                                      </p>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium text-accent-color hover:text-red-500 transition duration-300"
                                          onClick={() => removeLineItem(id)}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {user && (
                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>{getPriceString(total)}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <a
                          href="/checkout"
                          className="elegant-button flex items-center justify-center w-full"
                        >
                          Checkout
                        </a>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{" "}
                          <button
                            type="button"
                            className="font-medium text-accent-color hover:text-accent-color transition duration-300"
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}