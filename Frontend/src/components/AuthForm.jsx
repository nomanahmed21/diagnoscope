import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';
import {v4 as uuidv4} from "uuid"

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const endpoint = isSignup ? 'signup' : 'login';
    if(endpoint=='signup'){
      data.phone = data.phone.replace(/\s/g, ''); // remove spaces before sending
      console.log(`data send to backend: ${data}`)
    }
    console.log(data)

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message);
        console.log("result",result.user)
        navigate("/UserPage");
      } else {
        alert(result.error);
        if (endpoint !== 'login') {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong!');
    }

    reset();
  };

  const handleUserAccess = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/UserPage', {
        method: 'GET',
        credentials: 'include'
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message);
        navigate("/UserPage");
      } else {
        alert(result.error || "Access denied.");
        navigate('/login');
      }
    } catch (error) {
      console.error("Fetch failed:", error);
      alert("Something went wrong. Please try again.");
      navigate('/login');
    }
  };

  useEffect(() => {
    handleUserAccess();
  }, []);

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>

        {isSignup && (
          <>
            <input
              {...register('firstName', { required: 'First name is required' })}
              placeholder="First Name"
            />
            {errors.firstName && <p className="error">{errors.firstName.message}</p>}

            <input
              {...register('lastName', { required: 'Last name is required' })}
              placeholder="Last Name"
            />
            {errors.lastName && <p className="error">{errors.lastName.message}</p>}

            <input
              type="tel"
              {...register('phone', {
                required: 'Phone number is required',
                validate: (value) =>
                  value.replace(/\s/g, '').length === 10 || 'Invalid phone number'
              })}
              placeholder="00000 00000"
              maxLength="11"
              onInput={(e) => {
                let value = e.target.value.replace(/\D/g, ""); // only digits
                if (value.length > 5) {
                  value = value.slice(0, 5) + " " + value.slice(5);
                }
                e.target.value = value;
              }}
            />


            {errors.phone && <p className="error">{errors.phone.message}</p>}

            {/* Age Field */}
            <input
              {...register('age', {
                required: 'Age is required',
                min: { value: 1, message: 'Age must be at least 1' },
                max: { value: 120, message: 'Age must be less than 120' }
              })}
              type="number"
              placeholder="Age"
            />
            {errors.age && <p className="error">{errors.age.message}</p>}

            {/* Gender Field */}
            <select
              {...register('gender', { required: 'Gender is required' })}
              defaultValue=""
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="error">{errors.gender.message}</p>}
          </>
        )}

        <input
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
          })}
          placeholder="Email"
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Minimum 6 characters' }
          })}
          type="password"
          placeholder="Password"
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>

        <p className="switch">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </form>
    </div>
  );
}
