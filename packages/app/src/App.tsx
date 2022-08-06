import { getReferenceString } from '@medplum/core';
import { ErrorBoundary, FooterLinks, Header, Loading, useMedplum, useMedplumProfile } from '@medplum/react';
import React, { Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import { BotsPage } from './admin/BotsPage';
import { ClientsPage } from './admin/ClientsPage';
import { CreateBotPage } from './admin/CreateBotPage';
import { CreateClientPage } from './admin/CreateClientPage';
import { InvitePage } from './admin/InvitePage';
import { PatientsPage } from './admin/PatientsPage';
import { ProjectDetailsPage } from './admin/ProjectDetailsPage';
import { ProjectPage } from './admin/ProjectPage';
import { SecretsPage } from './admin/SecretsPage';
import { SuperAdminPage } from './admin/SuperAdminPage';
import { UsersPage } from './admin/UsersPage';
import { BatchPage } from './BatchPage';
import { BulkAppPage } from './BulkAppPage';
import { ChangePasswordPage } from './ChangePasswordPage';
import { CreateResourcePage } from './CreateResourcePage';
import { FormPage } from './FormPage';
import { HomePage } from './HomePage';
import { AssaysPage } from './lab/AssaysPage';
import { PanelsPage } from './lab/PanelsPage';
import { OAuthPage } from './OAuthPage';
import { RegisterPage } from './RegisterPage';
import { ResetPasswordPage } from './ResetPasswordPage';
import { ResourcePage } from './ResourcePage';
import { ResourceVersionPage } from './ResourceVersionPage';
import { SetPasswordPage } from './SetPasswordPage';
import { SignInPage } from './SignInPage';
import { SmartSearchPage } from './SmartSearchPage';
import '@medplum/react/defaulttheme.css';
import '@medplum/react/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

export function App(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const profile = useMedplumProfile();

  if (medplum.isLoading()) {
    return <Loading />;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        transition={Slide}
        autoClose={3000}
        hideProgressBar
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {profile && (
        <Header
          onLogo={() => navigate('/')}
          onProfile={() => navigate(`/${getReferenceString(profile)}`)}
          onSignOut={() => {
            medplum.signOut();
            navigate('/signin');
          }}
          config={medplum.getUserConfiguration()}
        />
      )}
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/oauth" element={<OAuthPage />} />
            <Route path="/resetpassword" element={<ResetPasswordPage />} />
            <Route path="/setpassword/:id/:secret" element={<SetPasswordPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/changepassword" element={<ChangePasswordPage />} />
            <Route path="/batch" element={<BatchPage />} />
            <Route path="/bulk/:resourceType" element={<BulkAppPage />} />
            <Route path="/smart" element={<SmartSearchPage />} />
            <Route path="/forms/:id" element={<FormPage />} />
            <Route path="/admin/super" element={<SuperAdminPage />} />
            <Route path="/admin" element={<ProjectPage />}>
              <Route path="patients" element={<PatientsPage />} />
              <Route path="bots/new" element={<CreateBotPage />} />
              <Route path="bots" element={<BotsPage />} />
              <Route path="clients/new" element={<CreateClientPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="details" element={<ProjectDetailsPage />} />
              <Route path="invite" element={<InvitePage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="project" element={<ProjectDetailsPage />} />
              <Route path="secrets" element={<SecretsPage />} />
            </Route>
            <Route path="/lab/assays" element={<AssaysPage />} />
            <Route path="/lab/panels" element={<PanelsPage />} />
            <Route path="/:resourceType/:id/_history/:versionId/:tab" element={<ResourceVersionPage />} />
            <Route path="/:resourceType/:id/_history/:versionId" element={<ResourceVersionPage />} />
            <Route path="/:resourceType/new" element={<CreateResourcePage />} />
            <Route path="/:resourceType/:id/:tab" element={<ResourcePage />} />
            <Route path="/:resourceType/:id" element={<ResourcePage />} />
            <Route path="/:resourceType" element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      {!profile && (
        <FooterLinks>
          <a href="https://www.medplum.com/privacy">Terms</a>
          <a href="https://www.medplum.com/privacy">Privacy</a>
        </FooterLinks>
      )}
    </>
  );
}
