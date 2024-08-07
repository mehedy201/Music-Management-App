import { BellAlertIcon, CheckBadgeIcon, ClockIcon, ExclamationCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Drawer, Empty, Image, Pagination } from "antd";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../UserAdminHomePage/UserAdminHomePage";
import CreateLabelsForm from "./CreateLabelsForm";
import fallbackImage from "../../assets/fallbackImage.jpg"
import ActionRequiredLabels from "./ActionRequiredLabels";

const UserLabelsPage = () => {

    const navigate = useNavigate('')
    // Get Data From Context API
    const { userNameIdRoll, refatchLabelsData } = useContext(AuthContext);


    // Paginatin and Search State __________________________________________________
    const [lebelStatus, setLabelStatus] = useState('All')
    const [totalItems, setTotalItems] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(10);
    const [searchText, setSearchText] = useState('');

    const [labelsData, setLabelsData] = useState();
    const [fetchLoading, setFetchLoading] = useState(false);

    useEffect( () => {
      setItemPerPage(10)
      setFetchLoading(true)
      axios.get(`https://shark-app-65c5t.ondigitalocean.app/api/v1/labels/${userNameIdRoll[1]}?page=${currentPage}&limit=${itemPerPage}&status=${lebelStatus}`)
          .then( res => {
            if(res.status == 200){
              setFetchLoading(false);
              setTotalItems(res.data.dataCount);
              setLabelsData(res.data.data);
            }
          })
          .catch(er => console.log(er));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[refatchLabelsData, currentPage, lebelStatus])


    const handlePageChange = (page) => {
      setCurrentPage(page)
    };

    const handleStatus = (e) => {
        setCurrentPage(1)
        setLabelStatus(e)
    }

    const handleSearch = (e) => {
        setSearchText(e)
    }

    const handleKeyPress = (event) => {
        setItemPerPage(50)
        if (event.key === 'Enter') {          
          setFetchLoading(true);
          axios.get(`https://shark-app-65c5t.ondigitalocean.app/api/v1/labels/search/${userNameIdRoll[1]}?status=${lebelStatus}&search=${searchText}`)
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

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };


    return (
        <div className="md:flex md:h-full">
            <div className='h-full md:basis-3/4 overflow-y-auto md:border-r p-2'>
                {/* Search and Create Labels Section ______________________________________________________________________________ */}
                <div className="md:flex md:justify-between md:items-center bg-slate-50 py-2 px-2 rounded-lg">
                    <div className="my-2">
                        <input type="text" onKeyPress={handleKeyPress} onChange={e => handleSearch(e.target.value)} placeholder="Type & Enter to Search" className="input input-sm rounded-full input-bordered w-full"/>
                    </div>
                    <div className="my-2">
                        <button onClick={()=>document.getElementById('create_labels_modal').showModal()} className='btn btn-neutral py-1 px-6 rounded-full btn-sm border-none me-2 w-full'>Create Label</button>
                    </div>
                </div>
                    {/* Create Labels form with Modal Start _______________________________________________________________________ */}
                    <dialog id="create_labels_modal" className="modal"> 
                        <div className="modal-box">
                            <CreateLabelsForm/>
                        </div>
                    </dialog>
                    {/* Create Labels form with Modal End _______________________________________________________________________ */}

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
                    <h4 className="font-bold text-slate-600">Releases</h4>
                </div>

                {/* Main Div ______________________________________________Labels list */}
                <main className="my-2 p-2">
                    <div>
                        <button onClick={() => handleStatus('All')} className="btn btn-sm btn-neutral mx-1">All</button>
                        <button onClick={() => handleStatus('Pending')} className="btn btn-sm btn-neutral mx-1">Pending</button>
                        <button onClick={() => handleStatus('Approved')} className="btn btn-sm btn-neutral mx-1">Approved</button>
                        <button onClick={() => handleStatus('Rejected')} className="btn btn-sm btn-neutral mx-1">Rejected</button>
                    </div>
                    {
                      fetchLoading == true && <div className="mt-4 flex items-center justify-center"><span className="loading loading-spinner loading-md me-2"></span></div>
                    }
                    {
                      !fetchLoading && labelsData?.map((data) => 
                        <div style={{cursor: 'pointer'}} onClick={() => navigate(`/labels/${data._id}`)} key={data._id} className="md:flex justify-between p-1 my-1 rounded-md">
                          <div className="flex items-center">
                                <Image
                                  width={55}
                                  height={55}
                                  className="rounded-lg"
                                  src={data.imgUrl}
                                  fallback={fallbackImage}
                                />
                            <div className="ps-2">
                              <h2 className="font-bold">{data.labelName}</h2>
                              <p className="text-sm text-slate-400">{data?.userName}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {
                              data.status === 'Pending' &&
                              <span style={{width: '100px'}} className="flex justify-center bg-yellow-500 my-3 py-1 rounded-md text-xs me-2 font-bold flex items-center"><ClockIcon className="w-4 h-4 me-1"/> {data.status}</span>
                            }
                            {
                              data.status === 'Approved' &&
                              <span style={{width: '100px'}} className="flex justify-center bg-green-500 my-3 py-1 rounded-md text-xs me-2 font-bold flex items-center"><CheckBadgeIcon className="w-4 h-4 me-1"/> {data.status}</span>
                            }
                            {
                              data.status === 'Rejected' &&
                              <span style={{width: '100px'}} className="flex justify-center bg-red-500 my-3 py-1 rounded-md text-xs me-2 font-bold flex items-center"><XCircleIcon className="w-4 h-4 me-1"/> {data.status}</span>
                            }
                            {/* {
                              data.status === 'Rejected' &&
                              <button onClick={() => deleteLabels(data._id, data.key)}><TrashIcon className="w-5 h-5 text-red-500"/></button>
                            } */}
                          </div>
                        </div>
                      )
                    }
                    
                    {
                        !totalItems && !fetchLoading && <Empty className="pt-12" />
                    }
                    {
                        totalItems > 1 && !fetchLoading && <div className="flex justify-center items-center my-4">
                            <Pagination 
                            defaultCurrent={currentPage}
                            pageSize={itemPerPage} 
                            total={totalItems}
                            onChange={handlePageChange}
                            /> 
                      </div>
                    }
                  
                </main>

            </div>

            {/* Blog Post Div  _______________________________*/}
            <div className="md:basis-1/4 overflow-y-auto hidden md:block">
                <div className='p-2'>
                    <h4 className='flex items-center font-bold text-md text-slate-500'> <BellAlertIcon className='w-5 h-5 me-2 text-slate-500'/> Notification</h4>
                </div>
                <ActionRequiredLabels onClose={onClose}/>
            </div>

            {/* Sideber Div Mobile _______________________________*/}
            <BellAlertIcon onClick={showDrawer} className='w-10 h-10 p-2 text-slate-500 bg-white rounded-full border block md:hidden fixed top-[50%] right-4 pointer'/>
            <Drawer className='bg-white' title="Notification" onClose={onClose} open={open}>
              <ActionRequiredLabels onClose={onClose}/>
            </Drawer>
        </div>
    );
};

export default UserLabelsPage;