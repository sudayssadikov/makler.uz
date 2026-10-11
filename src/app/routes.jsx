import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { RequireAuth, RequireAdmin, VerifiedRoute } from './guards';
import { HomePage } from '../features/home/HomePage';
import { SearchQuiz } from '../features/search/SearchQuiz';
import { ListingDetails } from '../features/listings/ListingDetails';
import { CreateListingWizard } from '../features/listings/CreateListingWizard';
import { MyListingsPage } from '../features/listings/MyListingsPage';
import { FavoritesPage } from '../features/listings/FavoritesPage';
import { RequestsPage } from '../features/requests/RequestsPage';
import { ContractsPage, ContractDetailsPage } from '../features/contracts/ContractsPage';
import { AdminDashboard } from '../features/admin/AdminDashboard';
import { GuidePage } from '../features/guide/GuidePage';
import { ForbiddenPage } from '../features/common/ForbiddenPage';
import { NotFoundPage } from '../features/common/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchQuiz />} />
        <Route path="guide" element={<GuidePage />} />
        <Route path="listings/:id" element={<ListingDetails />} />
        <Route
          path="add-listing"
          element={
            <VerifiedRoute>
              <CreateListingWizard />
            </VerifiedRoute>
          }
        />
        <Route
          path="my-listings"
          element={
            <RequireAuth>
              <MyListingsPage />
            </RequireAuth>
          }
        />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route
          path="requests"
          element={
            <RequireAuth>
              <RequestsPage />
            </RequireAuth>
          }
        />
        <Route
          path="contracts"
          element={
            <RequireAuth>
              <ContractsPage />
            </RequireAuth>
          }
        />
        <Route
          path="contracts/:id"
          element={
            <RequireAuth>
              <ContractDetailsPage />
            </RequireAuth>
          }
        />
        <Route
          path="admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
        <Route path="403" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
