import { getFormSubmissionInfo } from "react-router-dom";
import Header from "../components/header";
import { Fragment } from "react";
import Footer from "../components/footer";
import Chatbot from "../components/Chatbot";

export default function Forum()
{
    return (
        <>

        <Header />
        <div class="forum-embed">
          <iframe src="https://mankind222.discussion.community/" frameborder="0" width="100%" height="600px"></iframe>
      </div>
        <Chatbot />
        <Footer />
        
        
        </>



    )
     

    
}