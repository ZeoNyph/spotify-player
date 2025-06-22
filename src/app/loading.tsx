import { ScaleLoader } from "react-spinners";

export default function LoadingScreen(){
    return(
        <div className="h-screen w-screen bg-background">
            <ScaleLoader/>
        </div>

    );
}