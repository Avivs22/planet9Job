import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {isScamsUser} from "../common/utils.ts";


export function DashboardIndexPage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (isScamsUser()) {
      // p9-demo
      navigate('/dashboard/url/investigate');
    } else {
      // others
      navigate('/dashboard/social-media/home');
    }
  }, []);


  return (
    <></>
  );
}