/* EmailJS Credentials */
const EMAILJS_PUBLIC_KEY  = 'xLhN0XqTr4h7cr27W'; 
const EMAILJS_SERVICE_ID  = 'service_be9feas';   
const EMAILJS_TEMPLATE_ID = 'template_w1cpff6';  

/* CV File Name */
const CV_FILE_NAME = 'resume.pdf';
const PORTFOLIO_CONFIG = {
  emailjs: {
    publicKey:  EMAILJS_PUBLIC_KEY,
    serviceId:  EMAILJS_SERVICE_ID,
    templateId: EMAILJS_TEMPLATE_ID,
    isConfigured: (
      EMAILJS_PUBLIC_KEY  !== 'YOUR_PUBLIC_KEY'  &&
      EMAILJS_SERVICE_ID  !== 'YOUR_SERVICE_ID'  &&
      EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
      EMAILJS_PUBLIC_KEY.trim()  !== '' &&
      EMAILJS_SERVICE_ID.trim()  !== '' &&
      EMAILJS_TEMPLATE_ID.trim() !== ''
    )
  },
  cv: {
    fileName: CV_FILE_NAME,
    path: CV_FILE_NAME
  }
};
