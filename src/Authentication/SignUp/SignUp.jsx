import { useLoaderData, useNavigate } from "react-router-dom";
import { 
    DocumentTextIcon, EnvelopeIcon, KeyIcon, 
 } from '@heroicons/react/24/solid'
import { useForm } from "react-hook-form";
import { useState } from "react";
import auth from "../../../firebase.config";
// import { useAuthState, useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import LoadingComponentsInsidePage from "../../LoadingComponents/LoadingComponentsInsidePage";
import axios from "axios";

const SignUp = () => {
    // Get Data From React Router Loader _______________
    const userData = useLoaderData();
    const navigate = useNavigate()

    // const [user] = useAuthState(auth);

    const id = userData.data.data._id;
    const roll = userData.data.data.roll;

    const [loadingHandle, setLoadingHandle] = useState(false)

    // Create User IN Firebase __________________________
    const [
        createUserWithEmailAndPassword,
        // user,
        loading,
        error,
      ] = useCreateUserWithEmailAndPassword(auth);

      const [updateProfile, updating, error1] = useUpdateProfile(auth);



    // User Update Form _________________________________
    const [passwordError, setPasswordError] = useState();
    const { register, handleSubmit, formState: { errors }} = useForm({values: {userName: userData.data.data.userName, email: userData.data.data.email}});
    const onSubmit = async (data) => {
        const date = new Date();
        const openingDate = date.toLocaleDateString();
        const openingTime = date.toLocaleTimeString([], { hour12: true});
        
        if(data.password1 === data.password2){
            const password = data.password1;
            const email = data.email
            // _________________
            await createUserWithEmailAndPassword(email, password).then(res => {
                const uid = res.user.uid
                const userData = {openingDate, openingTime, uid};
                setLoadingHandle(true)
                axios.put(`https://shark-app-65c5t.ondigitalocean.app/api/v1/users/${id}`, userData).then( async res => {
                    const displayName = `${data.userName}'__'${id}'__'${roll}`
                    if(res.status == 200){
                        setLoadingHandle(false);
                        await updateProfile({ displayName });
                        if(roll === 'User'){
                            localStorage.setItem('popupShown', 'false');
                            navigate('/')
                        }
                        if(roll === 'Admin'){
                            navigate('/admin-dashboard')
                        }
                    }
                })
            })
            
        }else{
            setPasswordError('Password Not Match')
        }
    }

    return (
        <div className='xl:max-w-[1140px] lg:max-w-[90%] md:max-w-[90%] sm:max-w-[90%] w-[95%] mx-auto'>
            <div className="h-screen flex justify-center items-center">
                <div className="card w-96 bg-base-100 shadow-xl border">
                    <h3 className="px-4 text-2xl font-semibold text-green-500 italic text-center py-2">🎉Congratulations🎉</h3>
                    <p className="px-4 text-center font-semibold text-gray-500">An account has been created for you on our site. Now you set your password.</p>
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}  className="w-100">
                            <label className="input input-bordered flex items-center gap-2 mb-2 bg-slate-200">
                                <EnvelopeIcon className="w-4 h-4 opacity-70" />
                                <input type="text" className="grow" {...register("email", { required: true})} disabled/>
                            </label>

                            <label className="input input-bordered flex items-center gap-2 mb-2 bg-slate-200">
                                <DocumentTextIcon className="w-4 h-4 opacity-70" />
                                <input type="text" className="grow" placeholder="User Name" {...register("userName", { required: true})} disabled/>
                            </label>

                            <label className="input input-bordered flex items-center gap-2 mb-2">
                                <KeyIcon className="w-4 h-4 opacity-70" />
                                <input type="password" className="grow" placeholder="New Password" {...register("password1", { required: true})}/>
                            </label>
                                {errors.password1 && <span className='text-red-600 pb-2 block'>Please Fill Password</span>}
                            <label className="input input-bordered flex items-center gap-2 mb-2">
                                <KeyIcon className="w-4 h-4 opacity-70" />
                                <input type="password" className="grow" placeholder="Confirm Password" {...register("password2", { required: true})}/>
                            </label>
                                {errors.password2 && <span className='text-red-600 pb-2 block'>Please Confirm Password</span>}
                                {passwordError && <span className='text-red-600 pb-2 block font-bold'>{passwordError}</span>}

                            <div>
                                {
                                    loadingHandle && loading  && <LoadingComponentsInsidePage/>
                                }
                                {
                                    updating && <LoadingComponentsInsidePage/>
                                }
                                {
                                    error && <span className='text-red-600 pb-2 block font-bold'>{error}</span>
                                }
                                {
                                    error1 && <span className='text-red-600 pb-2 block font-bold'>{error1}</span>
                                }
                            </div>
                            <div className="flex justify-center mt-4">
                                {
                                    !userData.data ? <input className="btn btn-neutral rounded-full btn-wide" type="submit" value={'Submit'} disabled/> : <input className="btn btn-neutral rounded-full btn-wide" type="submit" value={'Submit'} />
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;