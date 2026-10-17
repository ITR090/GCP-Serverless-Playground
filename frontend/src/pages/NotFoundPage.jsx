import React from 'react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Compass, House } from 'lucide-react';

const NotFoundPage = () => {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="bg-hero grid min-h-screen place-items-center bg-base-200 px-4">
      <div className="max-w-md text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Compass className="h-8 w-8" />
        </span>
        <p className="mt-6 text-sm font-semibold text-primary">{notFound ? '404' : 'Error'}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {notFound ? "This page doesn't exist" : 'Something went wrong'}
        </h1>
        <p className="mt-3 text-base-content/70">
          {notFound
            ? 'The link may be broken or the page may have moved.'
            : 'Sorry, there was a problem loading this page. Please try again.'}
        </p>
        <Link to="/" className="btn btn-primary mt-8 gap-2">
          <House className="h-4 w-4" /> Back to home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage;
