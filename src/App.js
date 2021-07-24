import { BrowserRouter as Router , Switch, Route} from "react-router-dom";
import Home from './Home'
import { Redirect } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import Login from './Login';
import Signup from './Signup';
import Profil from "./Profil";
import OtherProfil from "./OtherProfil";
import Logout from "./Logout";
import Post from "./Post";
import Messages from "./Messages";
const App=()=>{
  return (
    <Router>
      <div>
        <Redirect to="/login"/>
        <Switch>
          {/* <Route path="/home" component={Home}/> */}
          <Route path="/messages" component={Messages}/>
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout}/>
          <Route path="/signup" component={Signup} />
          <Route path="/profil" component={Profil}/>
          <Route path="/profil-:checkLogin" component={OtherProfil}/>
          <Route path="/post-:postId" component={Post} />
        </Switch>
      </div>
    </Router>
  )
}
export default App;