const Footer = () => {
    return (
        <footer className="bg-[#a3b39c] text-[#72856e] py-5">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="left-side mx-5 md:mx-0 mb-4 md:mb-0 md:mr-4">
                    <div className="company-info">
                        <img src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713009973/lype_crhi55.svg" alt="Company Logo" className="w-24 mb-2" />
                        <p className="mt-2 md:mt-0">Lype është një kompani që ofron një gamë të gjerë të librave në gjuhën shqipe dhe angleze.</p>
                    </div>
                    <div className="social-icons mt-4 flex">
                        <a href="#" className="mr-4"><img src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713134321/twitter-svgrepo-com_1_rpehlw.svg" alt="Twitter" className="w-6" /></a>
                        <a href="#" className="mr-4"><img src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713134320/Frame_zje8fa.svg" alt="Instagram" className="w-6" /></a>
                        <a href="#" className="mr-4"><img src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713134319/Frame_1_jh90tv.svg" alt="Facebook" className="w-6" /></a>
                        <a href="#"><img src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713134318/Frame_2_pzzh6s.svg" alt="Discord" className="w-6" /></a>
                    </div>
                    <p className="trademark mt-4">© 2024 Lype co. Të gjitha të drejtat e rezervuara</p>
                </div>
                <div className="right-side mx-5 md:mx-0">
                    <ul className="categories text-right font-bold">
                        <li>
                            <a href="/">Ballina</a>
                        </li>
                        <li>Rreth nesh</li>
                        <li>
                            <a href="/kontakti">Na Kontaktoni</a>
                        </li>
                        <li>FAQ</li>
                    </ul>
                    <p className="privacy-policy text-right text-sm mt-4 md:mt-10">Politika e Privatësisë | Rregullat e Shërbimit</p>
                </div>
            </div>
        </footer>

    )
}

export default Footer