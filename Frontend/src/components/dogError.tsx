import * as React from 'react';
import { useGetDogImageQuery } from '../features/dogsSlice';
import { Typography } from '@mui/material';

const DogError: React.FC = () => {
    const {data: dogImageLink, refetch: setDogImageLink, isLoading: dogImageLinkIsLoading, error, isSuccess: dogImageLinkIsSuccess} = useGetDogImageQuery(undefined);

    React.useEffect(()=>{
        setDogImageLink();
    },[])

if(error){
    console.log("Dog error image failed to load");
    return(<></>)
}

if(dogImageLinkIsLoading){
    return (<>loading</>)
}

if(dogImageLinkIsSuccess){
    return(
        //use copilot to beautify
        <>
        <img src={dogImageLink}></img>
        <Typography>Oh No! Something went Wrong!</Typography>
        </>
    )
}
}

export default DogError;