import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Router from "react-router-dom";
import ProjectPage from './react-components/ProjectPage';
import ProjectDetailsPage from './react-components/ProjectDetailsPage';
import { ViewerProvider } from './react-components/ReactContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
   <Router.BrowserRouter>
    <ViewerProvider>
        <Router.Routes>
          <Router.Route path='/' element={<ProjectPage />}></Router.Route>
          <Router.Route path="/project/:id" element={<ProjectDetailsPage /> }></Router.Route>
        </Router.Routes>
      </ViewerProvider>
   </Router.BrowserRouter>
  </>
)
