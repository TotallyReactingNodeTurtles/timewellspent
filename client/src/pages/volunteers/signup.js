import { useEffect } from "react";
import googleOneTap from 'google-one-tap'
import { useStateContext,useDispatchContext } from "../../utils/GlobalState";
import ACTIONS from '../../utils/actions'
import { ADD_GOOGLE_VOLUNTEER, ADD_VOLUNTEER } from "../../utils/mutations";
import { useMutation, useQuery } from "@apollo/client";
import Auth from "../../utils/auth";
import { useState } from "react";

export default function GoogleSignUp() {
    
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const [createGoogleVolunteer] = useMutation(ADD_GOOGLE_VOLUNTEER);
    // const [googleVolunteer] = useQuery(QUERY_GOOGLE_VOLUNTEER)

      // set initial form state
  const [uservFormData, setVolunteerFormData] = useState({ username: '', email: '', password: '' });
  // set state for form validation
 
  // set state for alert

  // new code
  const [createVolunteer, { error }] = useMutation(ADD_VOLUNTEER);
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    // event.preventDefault();
    setVolunteerFormData({ ...uservFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    // event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      // event.preventDefault();
      event.stopPropagation();
    }

    // new code
    try {
      const { data } = await createVolunteer({
        variables: { ...uservFormData },
      });

      Auth.login(data.createVolunteer.token);
    } catch (err) {
      console.error(err);
    };

    setVolunteerFormData({
      username: '',
      email: '',
      password: '',
    });
  };

     useEffect(()=>{
        if(Auth.loggedIn()){
          return;
        }
        const clientID = process.env.REACT_APP_GOOGLE_CLIENT_ID
        const options = {
            client_id: clientID, 
            auto_select: false, 
            cancel_on_tap_outside: false, 
            context: 'signup',
        };
        function decodeJwtResponse(token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
          }

        googleOneTap(options, async (response) => {
            const res = await fetch('/api/google-signup',{
                method: 'POST',
                body: JSON.stringify({
                    token: response.credential
                }),
                headers: {
                    'Content-Type' : 'application/json',
                },
            });
            if(res.ok){
                const userData = await res.json();
                console.log(userData);
                const { name: username, email, picture, sub, jti } = userData
                
                const { data, errors } = await createGoogleVolunteer({
                    variables: {
                        username: username,
                        email: email,
                        jti: jti,
                        sub: sub,
                        picture: picture,
                    }
                })
                if(errors){
                    console.log(errors);
                }
                const responsePayload = decodeJwtResponse(response.credential);
                dispatch({type: ACTIONS.GOOGLE_INFO, payload: responsePayload})
                console.log(responsePayload);
                localStorage.setItem('userData', JSON.stringify({username, email, picture}));
                Auth.login(data.createGoogleVolunteer.token);
                
            }
        });
     },[])   
       
        
    return (
      <div className="container my-1">
        <h1>Sign Up</h1>
        <form onSubmit={handleFormSubmit}>
          <div className="flex-row space-between my-2">
            <label htmlFor="username">Username</label>
            <input
              placeholder="Amazing person"
              name="username"
              type="username"
              id="username"
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
          </div>
          <div className="flex-row space-between my-2">
            <label htmlFor="email">Email:</label>
            <input
              placeholder="email@domain.com"
              name="email"
              type="email"
              id="email"
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
          </div>
          <div className="flex-row space-between my-2">
            <label htmlFor="pwd">Password:</label>
            <input
              placeholder="******"
              name="password"
              type="password"
              id="pwd"
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
          </div>
          <div className="flex-row space-between my-2">
            <label htmlFor="skills">Skills:</label>
            <input
              placeholder="Organizing, outgoing,"
              name="skills"
              type="skills"
              id="skills"
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
          </div>
          {error ? (
            <div>
              <p className="error-text">The provided credentials are incorrect</p>
            </div>
          ) : null}
          <div className="flex-row flex-end">
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
          </div>
        </form>
  
      </div>
    );
}
