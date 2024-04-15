import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './Components/Authentication/Auth';
import SignIn from './Authetication/SignIn';
import Homepage from './Homepage/Homepage';
import ContentDetailPage from './ContentDetail/ContentDetailPage';
import ContentCreatorPage from './ContentCreator/ContentCreatorPage';
import ContentEditorPage from './ContentEditor/ContentEditorPage';
import { Navbar } from "./Components/Navbar/Navbar";

export default function App() {

  return (
    <AuthProvider>
      <>
      <Routes>
          {/* Routes without Navbar */}
          <Route path="/signIn" element={<SignIn />} />
          <Route path="*" element={<AuthenticatedRoutes />} />
        </Routes>
      </>
    </AuthProvider>
  );
}

function AuthenticatedRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Homepage />} />
        <Route path="/newrecipe" element={<ContentCreatorPage />} />
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
      <a href="/home">Take me back!</a>
    </div>
  );
}