import { CheckBadgeIcon, ClockIcon, ExclamationCircleIcon, LockClosedIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Empty, Image, Pagination } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import UpdateLabelsComponent from "./UpdateLabelsComponent";
import fallbackImageLabels from '../../assets/fallbackImage/fallback-labels.png'

const AdminLabelsPage = () => {

    const navigate = useNavigate()
    const { pageNumber, perPageLabel, status } = useParams();
    

    // Paginatin and Search State __________________________________________________
    const [lebelStatus, setLabelStatus] = useState(status)
    const [totalItems, setTotalItems] = useState();
    const [searchText, setSearchText] = useState('');
    const [labelsData, setLabelsData] = useState();
    const [fetchLoading, setFetchLoading] = useState(false);

    useEffect( () => {
        setFetchLoading(true)
        axios.get(`https://shark-app-65c5t.ondigitalocean.app/admin/api/v1/labels?page=${pageNumber}&limit=${perPageLabel}&status=${lebelStatus}`)
            .then( res => {
              if(res.status == 200){
                setFetchLoading(false);
                setTotalItems(res.data.dataCount);
                setLabelsData(res.data.data);
              }
            })
            .catch(er => console.log(er));
    },[ pageNumber, perPageLabel, lebelStatus]);

    const handlePageChange = (page) => {
        navigate(`/admin-dashboard/labels/${page}/${10}/${lebelStatus}`)
    };
  
    const handleStatus = (e) => {
        setLabelStatus(e)
        navigate(`/admin-dashboard/labels/${1}/${10}/${e}`)
    }
  
    const handleSearch = (e) => {
        setSearchText(e)
    }
  
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {          
        setFetchLoading(true);
        axios.get(`https://shark-app-65c5t.ondigitalocean.app/admin/api/v1/labels/search?status=${lebelStatus}&search=${searchText}`)
          .then( res => {
            if(res.status == 200){
              setFetchLoading(false);
              setTotalItems(res.data.dataCount);
              setLabelsData(res.data.data);
            }
          })
          .catch(er => console.log(er));
      }
    };

    const handleUpdate = (id) => {
      const link = `/admin-dashboard/labels/${id}`
      navigate(link)
    };


    return (
        <div className="md:h-full">
            <div className='h-full overflow-y-auto p-2'>
                {/* Search Lebels Section ______________________________________________________________________________ */}
                <div className="md:flex md:justify-between md:items-center bg-slate-50 py-2 px-2 rounded-lg">
                    <div className="my-2">
                        <input type="text" onKeyPress={handleKeyPress} onChange={e => handleSearch(e.target.value)} placeholder="Type & Enter to Search" className="input input-sm rounded-full input-bordered w-full"/>
                    </div>
                </div>


                {/* Total Labels Count Section _____________________________________________________________________________________ */}
                <div className="flex justify-between items-center my-3">
                    <div className="flex items-center">
                        <ExclamationCircleIcon className="w-6 h-6 me-1 text-slate-500"/>
                        Label Count
                    </div>
                    <div><span className="text-sm font-bold">{labelsData?.length}</span> <span className="ms-1 p-2 bg-slate-50 rounded-md text-sm font-bold">{totalItems}</span> </div>
                </div>

                {/* Labels List and Relase Title Section _____________________________________________________________________________ */}
                <div className="flex justify-between items-center py-2 rounded-full bg-slate-100 px-4">
                    <h4 className="font-bold text-slate-600">Profile</h4>
                </div>

                {/* Main Div ______________________________________________Labels list */}
                <main className="my-2 p-2">
                    <div className="mb-3">
                        <button onClick={() => handleStatus('All')} className="btn btn-sm btn-neutral mx-1">All</button>
                        <button onClick={() => handleStatus('Pending')} className="btn btn-sm btn-neutral mx-1">Pending</button>
                        <button onClick={() => handleStatus('Approved')} className="btn btn-sm btn-neutral mx-1">Approved</button>
                        <button onClick={() => handleStatus('Rejected')} className="btn btn-sm btn-neutral mx-1">Rejected</button>
                        <button onClick={() => handleStatus('Locked')} className="btn btn-sm btn-neutral mx-1">Locked</button>
                    </div>
                    {
                      fetchLoading == true && <div className="mt-4 flex items-center justify-center"><span className="loading loading-spinner loading-md me-2"></span></div>
                    }
                    {
                      !fetchLoading && labelsData?.map((data) => 
                        <div style={{cursor: 'pointer'}} onClick={() => handleUpdate(data._id)} key={data._id} className="md:flex justify-between p-1 my-1 rounded-md border">
                          <div className="flex items-center">
                                <Image
                                  width={55}
                                  height={55}
                                  className="rounded-lg"
                                  src={data.imgUrl}
                                  fallback={fallbackImageLabels}
                                  preview={false}
                                />
                            <div className="ps-2">
                              <h2 className="font-bold">{data.labelName}</h2>
                              <p className="text-sm text-slate-400">{data?.userName}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 items-center">
                            {
                                data.status === 'Pending' &&
                                <span style={{width: '110px'}} className="flex justify-center bg-yellow-500 my-3 py-1 rounded-md text-sm me-2 font-bold flex items-center"><ClockIcon className="w-4 h-4 me-1"/> {data.status}</span>
                            }
                            {
                                data.status === 'Approved' &&
                                <span style={{width: '110px'}} className="flex justify-center bg-green-500 my-3 py-1 rounded-md text-sm me-2 font-bold flex items-center"><CheckBadgeIcon className="w-4 h-4 me-1"/> {data.status}</span>
                            }
                            {
                                data.status === 'Rejected' &&
                                <span style={{width: '110px'}} className="flex justify-center bg-red-500 my-3 py-1 rounded-md text-sm me-2 font-bold flex items-center"><XCircleIcon className="w-4 h-4 me-1"/> {data.status}</span>
                            }
                            {
                                data.status === 'Locked' &&
                                <span style={{width: '110px'}} className="flex justify-center bg-slate-200 my-3 py-1 rounded-md text-sm me-2 font-bold flex items-center"><LockClosedIcon className="w-4 h-4 me-1"/> {data.status}</span>
                            }
                            {/* <span onClick={() => handleUpdate(data._id)} className="btn btn-xs btn-neutral py-1 px-2 rounded-md text-xs me-2 font-bold flex items-center">Update Status</span> */}
                          </div>
                        </div>
                      )
                    }
                    
                    {
                        !totalItems && !fetchLoading && <Empty className="pt-12" />
                    }
                    {
                        totalItems > 10 && !fetchLoading && <div className="flex justify-center items-center my-4">
                            <Pagination 
                            defaultCurrent={pageNumber} 
                            total={totalItems}
                            pageSize={perPageLabel}
                            onChange={handlePageChange}
                            /> 
                      </div>
                    }
                  
                </main>

            </div>
        </div>
    );
};

export default AdminLabelsPage;