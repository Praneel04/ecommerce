import { StarIcon } from "@heroicons/react/solid";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

import NotFound from "./NotFound";
import { getPriceString } from "./util/getPriceString";
import ReviewModal from "./ReviewModal";
import apiAdapter from "./services/ApiAdapter";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false); // New state for login modal

  const { id } = useParams();

  let user = localStorage.getItem("minimalUser");
  if (user) user = JSON.parse(user);

  const calculateReviewStats = (product) => {
    if (!product || !product.reviews || product.reviews.length === 0) {
      return { average: 0, totalCount: 0 };
    }
    
    const totalCount = product.reviews.length;
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / totalCount;
    
    return { average, totalCount };
  };

  const getProduct = async () => {
    try {
      const data = await apiAdapter.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const addToCart = async () => {
    try {
      await apiAdapter.addToCart(user.id, {
        product,
        quantity: 1,
      });
      toast.success("Product added to cart");
    } catch (error) {
      console.log(error);
      toast.error("Unable to add product to cart, try again later");
    }
  };

  // Handle the button click based on login status
  const handleButtonClick = () => {
    if (user) {
      // User is logged in, add to cart
      addToCart();
    } else {
      // User is not logged in, open login modal
      setLoginModalOpen(true);
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await getProduct();
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };

    run();
  }, [id]);

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>
      <p className="mt-4 text-gray-600">Loading product details...</p>
    </div>
  );
  
  if (!product) return <NotFound />;

  const reviewStats = calculateReviewStats(product);

  return (
    <div className="bg-light-color">
      <div className="pt-6">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2">
            <li>
              <div className="flex items-center">
                <a href="/" className="mr-2 text-sm font-medium text-primary-color hover:text-accent-color transition duration-300">
                  Home
                </a>
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-4 h-5 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li className="text-sm">
              <a
                href={`products/${id}`}
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {product.title}
              </a>
            </li>
          </ol>
        </nav>

        {/* Image gallery with elegant styling */}
        <div className="mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
          <div className="hidden aspect-w-3 aspect-h-4 rounded-lg overflow-hidden lg:block elegant-card">
            <img
              src={product.images[0]}
              alt="product"
              className="w-full h-full object-center object-cover"
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden elegant-card">
              <img
                src={product.images[1]}
                alt="product"
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden elegant-card">
              <img
                src={product.images[2]}
                alt="product"
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>
          <div className="aspect-w-4 aspect-h-5 sm:rounded-lg sm:overflow-hidden lg:aspect-w-3 lg:aspect-h-4 elegant-card">
            <img
              src={product.images[3]}
              alt="product"
              className="w-full h-full object-center object-cover"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-primary-color sm:text-3xl">
              {product.title}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:mt-0 lg:row-span-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-accent-color font-playfair">
              {getPriceString(product.price)}
            </p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        reviewStats.average > rating
                          ? "text-accent-color"
                          : "text-gray-200",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{reviewStats.average.toFixed(1)} out of 5 stars</p>
                <span
                  className="ml-3 text-sm font-medium text-accent-color"
                >
                  {reviewStats.totalCount} {reviewStats.totalCount === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>

            <form className="mt-10">
              <button
                type="button"
                className="elegant-button w-full"
                onClick={handleButtonClick}
              >
                {!user ? "Sign in to proceed" : "Add to bag"}
              </button>
            </form>
          </div>
        </div>

        <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
          {/* Description and details */}
          <div>
            <h3 className="sr-only">Description</h3>

            <div className="space-y-6">
              <p className="text-base text-gray-900">{product.description}</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold tracking-tight mt-10 text-primary-color section-title">
            Reviews
          </h3>
          <div className="lg:flex flex-col justify-center w-full mt-8">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div
                  className="lg:w-1/2 lg:mr-7 lg:mb-0 mt-7 mb-7 bg-white p-6 shadow rounded elegant-card"
                  key={`${review.userId}-${index}`}
                >
                  <div className="flex items-center">
                    <div className="flex items-start justify-between w-full">
                      <div className="pl-3 w-full">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((ratingValue) => (
                            <StarIcon
                              key={ratingValue}
                              className={classNames(
                                review.rating > ratingValue
                                  ? "text-gray-900"
                                  : "text-gray-200",
                                "h-5 w-5 flex-shrink-0"
                              )}
                              aria-hidden="true"
                            />
                          ))}
                        </div>

                        <p className="text-sm leading-normal font-medium pt-2 text-gray-900 mb-2">
                          {review.userId ? review.username : "Anonymous"}
                        </p>
                        <p className="text-sm leading-normal  text-gray-500">
                          {review.reviewBody}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-6 text-center py-10">
                <p className="text-gray-500">No reviews yet. Be the first to add one!</p>
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              className="mt-10 elegant-button-secondary"
              onClick={() => setReviewModalOpen(true)}
              disabled={!user}
            >
              Add Review
            </button>
          </div>
          <ReviewModal
            open={reviewModalOpen}
            setOpen={setReviewModalOpen}
            user={user}
            productId={product.id}
            setProduct={setProduct}
          />
        </div>
      </div>
    </div>
  );
}