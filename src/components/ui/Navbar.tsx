export function Navbar() {
  return (
    <nav className=" dark:border-gray-850 mb-16 flex h-14 w-full items-center border-b border-gray-200 border-gray-800 px-4 md:px-6">
      <h1 className="text-2xl font-bold">ECOMMERCE</h1>
      <nav className="flex-1">
        <div className="flex w-full justify-center">
          <span className="mx-2 translate-y-0.5 text-sm font-medium transition-colors hover:text-gray-900">
            Categories
          </span>
          <span className="mx-2 translate-y-0.5 text-sm font-medium transition-colors hover:text-gray-900">
            Sale
          </span>
          <span className="mx-2 translate-y-0.5 text-sm font-medium transition-colors hover:text-gray-900">
            Clearance
          </span>
          <span className="mx-2 translate-y-0.5 text-sm font-medium transition-colors hover:text-gray-900">
            New stock
          </span>
          <span className="mx-2 translate-y-0.5 text-sm font-medium transition-colors hover:text-gray-900">
            Trending
          </span>
        </div>
      </nav>
      <div className="ml-auto flex ">
        <span className="mx-2 translate-y-0.5 text-sm font-semibold	 transition-colors hover:text-gray-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </span>
        <span className="mx-2 translate-y-0.5 text-sm font-semibold	 transition-colors hover:text-gray-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </span>
      </div>
    </nav>
  );
}
