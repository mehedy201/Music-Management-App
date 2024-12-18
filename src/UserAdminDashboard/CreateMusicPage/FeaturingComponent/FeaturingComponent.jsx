import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../UserAdminHomePage/UserAdminHomePage";
import fallbackImage from '../../../assets/fallbackImage.jpg'
import { Empty, Image } from "antd";
import toast from "react-hot-toast";

// eslint-disable-next-line react/prop-types
const FeaturingComponent = ({handleCancel, reFetchArtist}) => {

    const { userNameIdRoll, setFeaturing, featuring } = useContext(AuthContext);

    const [featuringData, setFeaturingData] = useState();
    const [fetchLoading, setFetchLoading] = useState(false);
    const [forSearch, setForSearch] = useState()

    useEffect( () => {
        setFetchLoading(true)
        axios.get(`https://shark-app-65c5t.ondigitalocean.app/api/v1/artist/for-release/${userNameIdRoll[1]}`)
            .then( res => {
              if(res.status == 200){
                setFetchLoading(false);
                setFeaturingData(res.data.data);
                setForSearch(res.data.data);
              }
            })
            .catch(er => console.log(er));
    },[reFetchArtist, userNameIdRoll])

    const handleData = (data) => {
        if(featuring){
            const dubleCheck = featuring.some(a => a._id === data._id);
            if(dubleCheck){
              toast.error("All ready added this Featuring")
            }else{
              setFeaturing([...featuring, data])
            }
        }else{
            setFeaturing([data])
        }
    }

    const handleSearch = (e) => {
      const searchData = forSearch.filter(d =>d.artistName.toLowerCase().includes(e.toLowerCase()));
      setFeaturingData(searchData);
    }


    return (
        <div>
            <input type="text" placeholder="Search" onChange={e => handleSearch(e.target.value)} className="input input-sm rounded-full input-bordered w-full"/>
            {
                fetchLoading == true && <div className="mt-4 flex items-center justify-center"><span className="loading loading-spinner loading-md me-2"></span></div>
            }
            {
              featuringData?.map((data) => 
                <div style={{cursor: 'pointer'}} onClick={handleCancel} key={data._id} className="flex items-center justify-between p-1 my-1 rounded-md">
                    <div style={{cursor: 'pointer'}}  onClick={() => handleData(data)} className="w-full">
                        <div className="flex items-center">
                                <Image
                                width={55}
                                height={55}
                                className="rounded-lg"
                                src={data.imgUrl}
                                fallback={fallbackImage}
                                />
                            <div className="ps-2">
                            <h2 className="font-bold">{data.artistName}</h2>
                            <p className="text-sm text-slate-400">ID: {data._id}</p>
                            </div>
                        </div>
                    </div>
                </div>
              )
            }
            {
              !featuringData && !fetchLoading &&
              <div>
                  <Empty className="pt-12" />
                  <div className="flex justify-center items-center my-2">
                    <a className="btn btn-sm btn-neutral rounded-full" href="https://app.dreamrecords.in/create-artist" target={'_blank'}>Add Featuring</a>
                  </div>
              </div>
            }
        </div>
    );
};

export default FeaturingComponent;