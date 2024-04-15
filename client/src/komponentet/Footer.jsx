import React from 'react'
import './Footer.css';
const Footer = () => {
  return (
    <footer className="footer">
        <div className="container">
            <div className="left-side">
                <div className="company-info">
                    <img src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713009973/lype_crhi55.svg" alt="Company Logo"/>
                    <p>Lype është një kompani që ofron një gamë të gjerë të librave në gjuhën shqipe dhe angleze.</p>
                </div>
                <div className="social-icons">
                    <a href="#"><img src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713134321/twitter-svgrepo-com_1_rpehlw.svg" alt="Twitter"/></a>
                    <a href="#"><img src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713134320/Frame_zje8fa.svg" alt="Instagram"/></a>
                    <a href="#"><img src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713134319/Frame_1_jh90tv.svg" alt="Facebook"/></a>
                    <a href="#"><img src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713134318/Frame_2_pzzh6s.svg" alt="Discord"/></a>
                </div>
                <p className="trademark">© 2024 Lype co. Të gjitha të drejtat e rezervuara</p>
            </div>
            <div className="right-side">
                <ul className="categories">
                    <li>Ballina</li>
                    <li>Rreth nesh</li>
                    <li>Na Kontaktoni</li>
                    <li>FAQ</li>
                </ul>
                <p className="privacy-policy">Politika e Privatësisë | Rregullat e Shërbimit</p>
            </div>
        </div>
    </footer>
  )
}

export default Footer