import { ArrowDownTrayIcon, CheckBadgeIcon, ClockIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SingleSupportPage = () => {

    const {id} = useParams();
    

    const [supportData, setSupportData] = useState();
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        axios.get(`https://shark-app-65c5t.ondigitalocean.app/common/api/v1/support/single/${id}`)
        .then(res => {
        if(res.status === 200){
            setLoading(false)
            setSupportData(res.data.data);
        }
    })
    },[id])


    return (
        <div className="mt-16 mx-2 h-screen overflow-y-auto">
            {
                loading && <div className='flex justify-center items-center'><span className="loading loading-spinner loading-md me-2"></span></div>
            }
            {
                supportData && supportData.map(data => 
                    <div className='p-2 rounded-md border' key={data._id}>
                        <div className="relative p-2 rounded-md">
                            {
                                data.status === 'Pending' &&
                                <div className="flex items-center p-1 absolute top-2 right-2 bg-[#ffae00] rounded-md shadow">
                                    <ClockIcon className="h-3 w-3 text-white me-1"/>
                                    <p className="text-xs font-semibold text-white">{data.status}</p>
                                </div>
                            }
                            {
                                data.status === 'Solved' &&
                                <div className="flex items-center p-1 absolute top-2 right-2 bg-[#00c90d] rounded-md shadow">
                                    <CheckBadgeIcon className="h-3 w-3 text-white me-1"/>
                                    <p className="text-xs font-semibold text-white">{data.status}</p>
                                </div>
                            }
                            <div>
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold">Support Title <span className="text-sm ">{data.status}</span></h2>
                                    <p>{data.date} {data.month} {data.year} || {data.time}</p>
                                </div>
                                <p className="font-bold text-sm">User Name</p>

                                <div className="p-4 rounded-lg border">
                                    <p className='text-sm text-slate-500'>{data?.supportText} </p>
                                    <p className='text-sm text-slate-500'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore quod ducimus nihil optio illum quidem odit rerum non praesentium fugit? </p>
                                    <p className='text-sm text-slate-500'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore quod ducimus nihil optio illum quidem odit rerum non praesentium fugit? </p>
                                    <p className='text-sm text-slate-500'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore quod ducimus nihil optio illum quidem odit rerum non praesentium fugit? </p>
                                    {
                                        data?.attachment &&
                                        <div className='p-2 border rounded-md mt-2'>
                                            <p className='text-sm text-slate-500'>Attachment</p>
                                            <a className="px-2 py-1 bg-slate-100 border rounded-md flex items-center font-bold" href={data?.attachment?.fileUrl} download={data?.attachment?.fileUrl}><ArrowDownTrayIcon className="w-4 h-4 me-2"/> Download</a>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            data.status === 'Solved' && 
                            <div className='my-3 p-3 md:p-4 border rounded-lg bg-green-100'>
                                <p>Support Issue Solved on <span className="font-bold text-slate-500">{data.ansDate} {data.ansMonth} {data.ansYear} || {data.ansTime}</span></p>
                                <p className='text-sm text-slate-500'>{data?.supportAnsText} </p>
                            </div>
                        }
                       
                    </div>
                )
            }
        </div>
    );
};

export default SingleSupportPage;