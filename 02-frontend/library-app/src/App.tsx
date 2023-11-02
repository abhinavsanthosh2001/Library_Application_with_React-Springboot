import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import './App.css';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import BookCheckoutPage from './layouts/BookCheckoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/oktaConfig';
import {OktaAuth,toRelativeUrl} from '@okta/okta-auth-js';
import { Security, LoginCallback, SecureRoute} from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage';
import { ShelfPage } from './layouts/shelfPage/ShelfPage';
import { MessagesPage } from './layouts/Messages/MessagesPage';
import { ManageLibraryPage } from './layouts/ManageLibraryPage/ManageLibraryPage';
import { ManageReserves } from './layouts/ManageReserves/ManageReserves';


const oktaAuth = new OktaAuth(oktaConfig);
export const App = () => {
  const customAuthHandler = () =>{
    history.push('/login')
  }
  const history = useHistory();
  const restoreOriginalUri =async (_oktaAuth: any , originaUri: any) => {
    history.replace(toRelativeUrl(originaUri ||'/', window.location.origin))
  };



  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security  oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
      <Navbar />
      <div className='flex-grow-1'>
        <Switch>
          <Route path='/' exact>
            <Redirect to='/home' />
          </Route>
          <Route path='/home' exact>
            <HomePage />
          </Route>
          <Route path='/search'>
            <SearchBooksPage />
          </Route>
          <Route path='/reviewlist/:bookId'>
            <ReviewListPage/>
          </Route>
          <Route path='/checkout/:bookId'>
            <BookCheckoutPage/>
          </Route>
          <SecureRoute path="/shelf">
            <ShelfPage/>
          </SecureRoute>
          <Route path='/login' render={() => <LoginWidget config={oktaConfig} /> } />
          <Route path='/login/callback' component={LoginCallback} />
          <SecureRoute path="/messages"> 
          <MessagesPage/>
          </SecureRoute>
          <SecureRoute path="/admin/ml"><ManageLibraryPage/></SecureRoute>
          <SecureRoute path="/admin/mrl"><ManageReserves/></SecureRoute>

        </Switch>
      </div>
      <Footer />
      </Security>
    </div>
  );
}