import { BellAlertIcon, BellIcon } from "@heroicons/react/24/solid";
import { Drawer, Result } from "antd";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import LoadingComponentsInsidePage from "../../../LoadingComponents/LoadingComponentsInsidePage";
import ActionRequiredRelease from "../ActionRequiredRelease";

export const EditReleaseContext = createContext();

const EditReleaseMainPage = () => {

    const {id} = useParams();
    const [releaseId] = useState(id)

    const [releaseFormData, setReleaseFormData] = useState();
    const [preReleaseData, setPreReleaseData] = useState();
    const [uploadedImageLink, setUploadedImageLink] = useState();
    const [uploadedImage, setUploadedImage] = useState('');

    const releaseContextValue = {
        releaseFormData,
        setReleaseFormData,
        preReleaseData,
        setPreReleaseData,
        uploadedImageLink,
        setUploadedImageLink,
        uploadedImage,
        setUploadedImage,
        releaseId
    }
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        axios.get(`https://shark-app-65c5t.ondigitalocean.app/api/v1/release/single/${id}`)
            .then( res => {
              if(res.status == 200){
                setLoading(false)
                setPreReleaseData(res.data.data[0]);
                setUploadedImageLink(res.data.data[0].imgUrl)
                const imgUrl = res.data.data[0].imgUrl;
                const key = res.data.data[0].key;
                setUploadedImage({imgUrl, key})
              }
            })
            .catch(er => console.log(er));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    if(loading){
        return <LoadingComponentsInsidePage/>
    }
    

    return (
        <div className="md:flex md:h-full">
            <div className='h-full md:basis-3/4 overflow-y-auto md:border-r p-2'>
                {/* <div>
                    <button><Link className="px-2 py-1 font-semibold text-sm text-slate-500 flex items-center inline bg-slate-200 rounded-md" to={'/'}><ChevronLeftIcon className="w-4 h-4 me-1 font-bold"/>Back</Link></button>
                </div> */}
                <EditReleaseContext.Provider value={releaseContextValue}>
                    {
                        preReleaseData && <Outlet/>
                    }
                    {
                        !preReleaseData && 
                        <div>
                            <Result
                                title="Something went wrong"
                            />
                            <p>Please Go Back to release page and Edit Release Step by Step. Please don&apos;t reload the site when you updateting Release. If you reload the site when you updateing then you have to edit release again</p>
                        </div>
                    }
                </EditReleaseContext.Provider>
            </div>

            {/* Blog Post Div  _______________________________*/}
            <div className="md:basis-1/4 hidden md:block">
                <div className='p-2 border-b'>
                    <h4 className='flex items-center font-bold text-lg text-slate-500'> <BellIcon className='w-6 h-6 me-2 text-slate-500'/> Notification</h4>
                    <ActionRequiredRelease onClose={onClose}/>
                </div>
            </div>

            {/* Sideber Div Mobile _______________________________*/}
            <BellAlertIcon onClick={showDrawer} className='w-10 h-10 p-2 text-slate-500 bg-white rounded-full border block md:hidden fixed top-[50%] right-4 pointer'/>
            <Drawer className='bg-white' title="Notification" onClose={onClose} open={open}>
                <ActionRequiredRelease onClose={onClose}/>
            </Drawer>
        </div>
    );
};

export default EditReleaseMainPage;