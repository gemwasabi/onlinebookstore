import ilustrimi from "../assets/img/kontakt.png";
import emailIcon from "../assets/img/email.svg";
import locationIcon from "../assets/img/location.svg";
import phoneIcon from "../assets/img/phone.svg";
import wheelchairIcon from "../assets/img/kontakti/wheelchair.svg";
import assistanceIcon from "../assets/img/kontakti/assist.svg";
import serviceAnimalsIcon from "../assets/img/kontakti/service-dog.svg";
import signageIcon from "../assets/img/kontakti/signage.svg";
import accessiblePathwaysIcon from "../assets/img/kontakti/path.svg";

const ContactUs = () => {
    return (
        <div className="min-h-screen bg-[#7b8e76] flex flex-col items-center justify-center py-2 lg:p-6 md:p-6">
            <div className="bg-[#BDC6BA] p-6 md:p-10 lg:rounded-lg md:rounded-lg shadow-md w-full md:w-3/4 lg:w-2/3 mb-6">
                <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-10 space-y-6 md:space-y-0">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Na kontaktoni</h2>
                        <p className="text-gray-600 mb-4">
                            Ne jemi këtu për të ju ndihmuar dhe për të ju përgjigjur pyetjeve që ju keni. Mos hezitoni të na kontaktoni 🩷!
                        </p>
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center space-x-2">
                                <img src={locationIcon} alt="Location Icon" className="w-6 h-6" />
                                <span className="text-gray-800">Innovation & Training Park Prizren
                                    20000 Ukë Bytyçi, Prizren</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <img src={phoneIcon} alt="Phone Icon" className="w-6 h-6" />
                                <span className="text-gray-800">+381 (0) 38 541 400</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <img src={emailIcon} alt="Email Icon" className="w-6 h-6" />
                                <a href="mailto:shki@ubt-uni.net" className="text-blue-500 hover:underline">shki@ubt-uni.net</a>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <img src={ilustrimi} alt="Contact Illustration" className="w-full h-auto md:ml-0 md:mr-10 mb-6 md:mb-0" />
                    </div>
                </div>
            </div>

            <div className="bg-[#BDC6BA] p-6 md:p-10 lg:rounded-lg md:rounded-lg shadow-md w-full md:w-3/4 lg:w-2/3 mb-6">
                <div className="flex flex-col items-center space-y-6 md:space-y-0">
                    <div className="text-center md:text-left md:w-1/2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Orari i punës</h3>
                        <p className="text-gray-600">E hënë - E premte: 09:00 - 18:00</p>
                        <p className="text-gray-600">E shtunë: 09:00 - 14:00</p>
                        <p className="text-gray-600">E diel: Mbyllur</p>
                    </div>

                    <div className="text-center md:text-left md:w-1/2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Lokacioni</h3>
                        <p className="text-gray-600">Gjeje në hartë:</p>
                        <div className="overflow-hidden rounded-lg shadow-md border border-gray-300 mt-4">
                            <iframe
                                title="Location Map"
                                width="100%"
                                height="300"
                                border="0"
                                style={{ minWidth: '250px' }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2954.6982306858313!2d20.74960057598199!3d42.22089387120622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135395681e7b0d99%3A0x68339e84735da1c2!2sInnovation%20%26%20Training%20Park%20Prizren!5e0!3m2!1sen!2s!4v1719331360773!5m2!1sen!2s">

                            </iframe>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#BDC6BA] p-6 md:p-10 lg:rounded-lg md:rounded-lg shadow-md w-full md:w-3/4 lg:w-2/3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Aksesueshmëria</h3>
                    <div className="flex items-center space-x-4 mb-4">
                        <img src={wheelchairIcon} alt="Wheelchair Accessibility Icon" className="w-6 h-6" />
                        <span className="text-gray-800">Mund të hyni me karrocë</span>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                        <img src={assistanceIcon} alt="Assistance Icon" className="w-6 h-6" />
                        <span className="text-gray-800">Ndihmë e mundshme nga stafi për persona në nevojë</span>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                        <img src={serviceAnimalsIcon} alt="Service Animals Icon" className="w-6 h-6" />
                        <span className="text-gray-800">Kafshët e shërbimit janë të mirëseardhur</span>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                        <img src={signageIcon} alt="Clear Signage Icon" className="w-6 h-6" />
                        <span className="text-gray-800">Shënime të qarta gjinden nëpër librari</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <img src={accessiblePathwaysIcon} alt="Accessible Pathways Icon" className="w-6 h-6" />
                        <span className="text-gray-800">Kalim i lirë nëpër korridore</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
