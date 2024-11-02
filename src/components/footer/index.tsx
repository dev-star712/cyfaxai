import { FormattedMessage } from "react-intl";  

const Footer = () => {  
    return (  
      <div className="flex items-center justify-center bg-[#09171B] px-4 py-2 max-lg:py-2 lg:bg-[#09171B] lg:px-0">  
        <p className="text-[12px] text-white lg:text-base">  
          <FormattedMessage id="footerTitle" />    
        </p>  
      </div>
    );  
};  

export default Footer;