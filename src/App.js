import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Components/Authentication/Auth';
import SignIn from './Authetication/SignIn';
import Homepage from './Homepage/Homepage';
import ContentDetailPage from './ContentDetail/ContentDetailPage';
import ContentCreatorPage from './ContentCreator/ContentCreatorPage';
import ContentEditorPage from './ContentEditor/ContentEditorPage';
import CategoryPage from './Category/CategoryPage';
import { Navbar } from "./Components/Navbar/Navbar";
import LoadingAnimation from './Components/Loading/Loading';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Sign-in route accessible only if the user is signed out */}
        <Route path="/signIn" element={<SignInOrNavigateToHome />} />
        {/* Authenticated routes accessible only if the user is signed in */}
        <Route path="*" element={<AuthenticatedRoutes />} />
      </Routes>
    </AuthProvider>
  );
}

// Component to render the sign-in page if the user is signed out, otherwise navigate to the home page
function SignInOrNavigateToHome() {
  const { user, loading } = useAuth();

  // Render loading animation while checking authentication status
  if (loading) {
    return <LoadingAnimation />;
  }

  // If user is authenticated, navigate to home page
  if (user) {
    return <Navigate to="/" replace />;
  }

  // If user is not authenticated, render sign-in page
  return <SignIn />;
}

// Component to render authenticated routes
function AuthenticatedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingAnimation />;
  }

  // If user is not authenticated, navigate to the sign-in page
  if (!user) {
    return <Navigate to="/signIn" replace />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/newrecipe" element={<ContentCreatorPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/recipe/:id" element={<ContentDetailPage />} />
        <Route path="/recipeEditor/:id" element={<ContentEditorPage />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

function Error404() {
  return (
    <div>
      <h1>404 — Page Not Found</h1>
      <a href="/">Take me back!</a>
    </div>
  );
}
