import './App.css';
import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import { useState } from 'react';


const auth = getAuth(app)


function App() {

  const [validated, setValidated] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleName = (event) => {
    setName(event.target.value);
  }

  const handleEmail = (event) => {
    const email = event.target.value;
    setEmail(email)
  }

  const handlePassword = (event) => {
    const password = event.target.value;
    setPassword(password)
  }

  const handleChecked = (event) => {
    setRegistered(event.target.checked)
  }


  const handleSubmit = (event) => {
    event.preventDefault();

    const setUserName = () => {
      updateProfile(auth.currentUser, {
        displayName: name
      })
        .then(() => {
          console.log('updated name')
        })
        .catch(error => {
          setError(error.message)
        })
    }

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (!/^[a-zA-Z]+$/.test(password)) {
      setError('Password should content letter')
      return;
    }
    setValidated(true);
    setError('')

    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user)
        })
        .catch((error) => {
          console.error(error)
          setError(error.message)
        })
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user)
          setEmail('')
          setPassword('')
          verifyEmail();
          setUserName();
        })
        .catch((error) => {
          console.error(error)
          setError(error.message)
        })

    }
  }
  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('rest password')
      })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('user verification sent')
      })
  }
  return (
    <div>
      <div className='registration w-50 mx-auto mt-5'>
        <h2 className='text-primary'>Please {registered ? 'Login' : 'Register'}</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>

          {!registered && <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Your Name</Form.Label>
            <Form.Control onBlur={handleName} type="text" placeholder="Enter Full Name" required />
            <Form.Control.Feedback type="invalid">
              Write your full name.
            </Form.Control.Feedback>
          </Form.Group>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmail} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePassword} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleChecked} type="checkbox" label="Already registered?" />
          </Form.Group>
          <p className='text-danger'>{error}</p>
          <Button onClick={resetPassword} variant="link">Forget Password?</Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? "Login" : 'Register'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
