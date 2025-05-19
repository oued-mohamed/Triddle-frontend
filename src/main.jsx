import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import 'bootstrap/dist/css/bootstrap.min.css';
import FormFill from './pages/FormFill.jsx'
import Forms from './pages/Forms.jsx'
import CreateForm from './components/form/CreateForm.jsx'
import { FormProvider } from './context/FormStore.jsx' // Import FormProvider
import FormEdit from './pages/FormEdit.jsx'; 
import FormView from './pages/FormView.jsx';
import FormBuilder from './pages/FormBuilder.jsx'
// import { Navbar } from 'react-bootstrap'
import { useAuthStore } from './context/AuthStore.js';
import Navbar from './components/layout/Navbar';
import MainLayout from './components/layout/MainLayout';
// import FormResponses from './pages/FormResponses';
// import FormAnalytics from './pages/FormAnalytics';
import FormStore from "./context/FormStore.jsx";




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FormProvider> {/* Wrap your application with FormProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="navbar" element={<Navbar />} />

            <Route path="forms" element={<Forms />} />
            <Route path="forms/create" element={<CreateForm />} />
            <Route path="FormFill" element={<CreateForm />} />
            <Route path="forms/builder/:formId" element={<FormBuilder />} />
            <Route path="forms/builder/new" element={<FormBuilder />} />
            <Route path="forms/builder/edit" element={<FormBuilder />} />



             <Route path="forms/:formId/edit" element={<FormEdit />} />
            <Route path="forms/:formId/view" element={<FormView />} />
            <Route path="forms/:formId/fill" element={<FormFill />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FormProvider>
  </StrictMode>
);